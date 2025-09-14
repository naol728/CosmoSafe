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
  const rapidApiKey = process.env.RAPIDAPI_KEY; // Using RAPIDAPI_KEY for the new endpoint
  const rapidApiHost = "gemini-pro-ai.p.rapidapi.com"; // Host for the new endpoint

  if (!rapidApiKey) {
    throw new Error("RAPIDAPI_KEY environment variable is not set.");
  }

  const endpoint = `https://${rapidApiHost}/`; // The new endpoint

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
          headers: {
            "x-rapidapi-key": rapidApiKey,
            "x-rapidapi-host": rapidApiHost,
            "Content-Type": "application/json",
          },
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

        // Check for 'Retry-After' header, though it's often not present for 429 on Gemini RapidAPI
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

// // utils/aiService.ts
// import axios, { AxiosError, AxiosResponse } from "axios";
// import { Readable } from "stream";

// // Define an interface for the request body for better type safety
// interface GeminiRequestBody {
//   contents: {
//     role: string;
//     parts: { text: string }[];
//   }[];
// }

// /**
//  * Sends a question to the Gemini API and handles rate limiting with exponential backoff.
//  *
//  * @param question The user's question.
//  * @param context Additional context to provide to the AI.
//  * @param maxRetries The maximum number of times to retry the request (default: 5).
//  * @param initialDelayMs The initial delay in milliseconds before the first retry (default: 1000ms = 1 second).
//  * @param maxDelayMs The maximum delay in milliseconds between retries (default: 60000ms = 1 minute).
//  * @returns A Readable stream from the Gemini API response.
//  * @throws An error if the API key is missing, or if the request fails after all retries.
//  */
// export const askQuestionStream = async (
//   question: string,
//   context: string,
//   maxRetries: number = 5,
//   initialDelayMs: number = 1000, // 1 second
//   maxDelayMs: number = 60000 // 1 minute
// ): Promise<Readable> => {
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) {
//     throw new Error("GEMINI_API_KEY environment variable is not set.");
//   }

//   const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:streamGenerateContent?key=${apiKey}`;

//   let retries = 0;
//   let currentDelay = initialDelayMs;

//   while (retries < maxRetries) {
//     const requestBody: GeminiRequestBody = {
//       contents: [
//         {
//           role: "user",
//           parts: [
//             // Combine context and question more naturally for the AI
//             { text: `Context: ${context}` },
//             { text: `Question: ${question}` },
//           ],
//         },
//       ],
//     };

//     try {
//       const response: AxiosResponse<Readable> = await axios.post(
//         endpoint,
//         requestBody,
//         {
//           responseType: "stream", // Important for streaming responses
//           // You can add a request timeout here if desired, e.g., timeout: 30000 (30 seconds)
//         }
//       );
//       // If we got a successful response, return the stream
//       return response.data;
//     } catch (err) {
//       const axiosError = err as AxiosError; // Type assertion for better error handling

//       if (axiosError.response && axiosError.response.status === 429) {
//         retries++;
//         console.warn(
//           `Gemini API rate limit hit (429). Retrying in ${
//             currentDelay / 1000
//           }s... (Attempt ${retries}/${maxRetries})`
//         );

//         // Check for 'Retry-After' header, though it's often not present for 429 on Gemini
//         const retryAfterHeader = axiosError.response.headers?.["retry-after"];
//         if (retryAfterHeader) {
//           const retryAfterSeconds = parseInt(retryAfterHeader, 10);
//           if (!isNaN(retryAfterSeconds)) {
//             currentDelay = Math.min(retryAfterSeconds * 1000, maxDelayMs); // Use Retry-After if available, but cap it
//           }
//         }

//         if (retries < maxRetries) {
//           await new Promise((resolve) => setTimeout(resolve, currentDelay));
//           // Exponential increase, capped by maxDelayMs
//           currentDelay = Math.min(currentDelay * 2, maxDelayMs);
//         } else {
//           // All retries exhausted
//           console.error(
//             `Failed to get response from Gemini API after ${maxRetries} retries due to rate limiting.`
//           );
//           throw new Error(
//             `Gemini API rate limit: Max retries exceeded. (${axiosError.message})`
//           );
//         }
//       } else {
//         // Log other types of errors and re-throw them immediately
//         console.error(
//           "Gemini API request failed:",
//           axiosError.response?.data?.toString() || axiosError.message
//         );
//         throw axiosError;
//       }
//     }
//   }

//   // This line should technically not be reached if maxRetries is > 0 and the loop handles failures
//   // but it's good practice to have a final catch-all throw
//   throw new Error("Unexpected error in askQuestionStream logic.");
// };

// utils/aiService.ts (Refactored for Google AI SDK)
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Readable } from "stream";
// import { EventEmitter } from "events"; // For creating a custom readable stream

// // Define a simple interface for stream output for consistency
// interface GeminiStreamPart {
//   text: string;
// }

// export const askQuestionStream = async (
//   question: string,
//   context: string
// ): Promise<Readable> => {
//   const apiKey = process.env.GOOGLE_GEMINI_API_KEY; // Use Google's API key now
//   if (!apiKey) {
//     throw new Error("GOOGLE_GEMINI_API_KEY environment variable is not set.");
//   }

//   const genAI = new GoogleGenerativeAI(apiKey);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//   const customStream = new EventEmitter(); // We'll manually emit data events

//   const history = [
//     {
//       role: "user",
//       parts: [{ text: `Context: ${context}` }],
//     },
//     {
//       role: "model",
//       parts: [{ text: "Understood. How can I help with this study?" }], // Example, adjust as needed
//     },
//   ];

//   try {
//     const result = await model.generateContentStream({
//       contents: [
//         ...history,
//         { role: "user", parts: [{ text: `Question: ${question}` }] },
//       ],
//     });

//     for await (const chunk of result.stream) {
//       const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//       if (chunkText) {
//         // Emit as a simple object so frontend can easily append
//         // You can choose your own format, e.g., { text: "word" }
//         customStream.emit("data", JSON.stringify({ text: chunkText }));
//       }
//     }
//     customStream.emit("end"); // Signal end of stream
//   } catch (error) {
//     console.error("Error from Google Gemini API:", error);
//     customStream.emit("error", error);
//   }

//   // To make this compatible with your existing Readable stream expectation,
//   // you'd wrap the EventEmitter in a Readable or adjust aiController to handle EventEmitter
//   // For simplicity, let's assume aiController expects raw text or specific JSON chunks.
//   // A more robust solution might involve a custom Transform stream.

//   // For now, let's just make sure it behaves like a Readable stream.
//   // This is a simplified way to create a Readable from an EventEmitter for this example.
//   const readableInstance = new Readable({
//     read() {}, // No-op, data is pushed
//   });

//   customStream.on("data", (data) => readableInstance.push(data));
//   customStream.on("end", () => readableInstance.push(null)); // Signal end
//   customStream.on("error", (err) => readableInstance.emit("error", err));

//   return readableInstance;
// };
