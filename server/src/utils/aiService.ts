// utils/aiService.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import { Readable } from "stream";

// Define an interface for the request body for better type safety
interface GeminiRequestBody {
  contents: {
    role: string;
    parts: { text: string }[];
  }[];
}

/**
 * Sends a question to the Gemini API and handles rate limiting with exponential backoff.
 *
 * @param question The user's question.
 * @param context Additional context to provide to the AI.
 * @param maxRetries The maximum number of times to retry the request (default: 5).
 * @param initialDelayMs The initial delay in milliseconds before the first retry (default: 1000ms = 1 second).
 * @param maxDelayMs The maximum delay in milliseconds between retries (default: 60000ms = 1 minute).
 * @returns A Readable stream from the Gemini API response.
 * @throws An error if the API key is missing, or if the request fails after all retries.
 */
export const askQuestionStream = async (
  question: string,
  context: string,
  maxRetries: number = 5,
  initialDelayMs: number = 1000, // 1 second
  maxDelayMs: number = 60000 // 1 minute
): Promise<Readable> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:streamGenerateContent?key=${apiKey}`;

  let retries = 0;
  let currentDelay = initialDelayMs;

  while (retries < maxRetries) {
    const requestBody: GeminiRequestBody = {
      contents: [
        {
          role: "user",
          parts: [
            // Combine context and question more naturally for the AI
            { text: `Context: ${context}` },
            { text: `Question: ${question}` },
          ],
        },
      ],
    };

    try {
      const response: AxiosResponse<Readable> = await axios.post(
        endpoint,
        requestBody,
        {
          responseType: "stream", // Important for streaming responses
          // You can add a request timeout here if desired, e.g., timeout: 30000 (30 seconds)
        }
      );
      // If we got a successful response, return the stream
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError; // Type assertion for better error handling

      if (axiosError.response && axiosError.response.status === 429) {
        retries++;
        console.warn(
          `Gemini API rate limit hit (429). Retrying in ${
            currentDelay / 1000
          }s... (Attempt ${retries}/${maxRetries})`
        );

        // Check for 'Retry-After' header, though it's often not present for 429 on Gemini
        const retryAfterHeader = axiosError.response.headers?.["retry-after"];
        if (retryAfterHeader) {
          const retryAfterSeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(retryAfterSeconds)) {
            currentDelay = Math.min(retryAfterSeconds * 1000, maxDelayMs); // Use Retry-After if available, but cap it
          }
        }

        if (retries < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          // Exponential increase, capped by maxDelayMs
          currentDelay = Math.min(currentDelay * 2, maxDelayMs);
        } else {
          // All retries exhausted
          console.error(
            `Failed to get response from Gemini API after ${maxRetries} retries due to rate limiting.`
          );
          throw new Error(
            `Gemini API rate limit: Max retries exceeded. (${axiosError.message})`
          );
        }
      } else {
        // Log other types of errors and re-throw them immediately
        console.error(
          "Gemini API request failed:",
          axiosError.response?.data?.toString() || axiosError.message
        );
        throw axiosError;
      }
    }
  }

  // This line should technically not be reached if maxRetries is > 0 and the loop handles failures
  // but it's good practice to have a final catch-all throw
  throw new Error("Unexpected error in askQuestionStream logic.");
};
