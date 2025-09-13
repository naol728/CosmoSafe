// aiController.ts
import { Request, Response } from "express";
import { askQuestionStream } from "../utils/aiService"; // Import the updated service function
import { AxiosError } from "axios"; // Import AxiosError for type checking

export const aiStream = async (req: Request, res: Response) => {
  // Set headers for Server-Sent Events (SSE) immediately
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // Flush headers to ensure the client starts receiving the stream connection immediately
  res.flushHeaders?.();

  try {
    const { payload } = req.query;
    if (!payload) {
      res.write('data: {"error": "Payload is required"}\n\n');
      return res.end();
    }

    let query: string;
    let metadata: any; // Consider a more specific type for metadata if possible

    try {
      const parsedPayload = JSON.parse(payload as string);
      query = parsedPayload.query;
      metadata = parsedPayload.metadata;
    } catch (parseError) {
      console.error("Payload parsing error:", parseError);
      res.write('data: {"error": "Invalid payload format"}\n\n');
      return res.end();
    }

    if (!query) {
      res.write('data: {"error": "Query is required"}\n\n');
      return res.end();
    }

    const contextString = `Analyze this study based on the following metadata: ${JSON.stringify(
      metadata,
      null,
      2
    )}`;

    // Call the service function which now includes internal exponential backoff
    const stream = await askQuestionStream(query, contextString);

    // Pipe the AI stream data directly to the client's response stream
    stream.on("data", (chunk: Buffer) => {
      // Assuming the AI stream chunks are already valid JSON or text that you want to send directly
      // If the AI sends JSON objects per chunk, you might need to handle it differently
      res.write(`data: ${chunk.toString()}\n\n`);
    });

    stream.on("end", () => {
      res.end(); // End the client's response when the AI stream ends
    });

    stream.on("error", (err) => {
      console.error("Gemini API stream error caught in controller:", err);
      // Send an error message to the client within the SSE stream
      res.write(
        `data: {\"error\": \"Stream from AI service failed: ${err.message}\"}\n\n`
      );
      res.end(); // End the client's response
    });
  } catch (err) {
    // This catch block handles errors *before* the stream begins, or the final error from askQuestionStream
    console.error("aiStream top-level error:", err);

    let errorMessage = "Internal server error";
    // Check if it's an AxiosError (likely from askQuestionStream)
    if (
      err instanceof AxiosError &&
      err.message.includes("Max retries exceeded")
    ) {
      errorMessage =
        "AI service is currently busy (rate limited). Please try again shortly.";
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    // Since headers are already sent for SSE, we can only send data messages
    // If headers were not sent, we could send a traditional HTTP error response
    if (res.headersSent) {
      res.write(`data: {\"error\": \"${errorMessage}\"}\n\n`);
      res.end();
    } else {
      // This case should ideally not be hit often if headers are flushed early
      // but included for completeness. It means an error happened *very* early.
      res.status(500).send(errorMessage);
    }
  }
};
