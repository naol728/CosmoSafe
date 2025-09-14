// aiController.ts
import { Request, Response } from "express";
import { askQuestionStream } from "../utils/aiService";
import { AxiosError } from "axios";
import { Readable } from "stream"; // Import Readable

export const aiStream = async (req: Request, res: Response) => {
  console.log("aiStream: Request received.");

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Corrected for your frontend origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendSseError = (message: string) => {
    console.error(`aiStream: Sending SSE error to client: ${message}`);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    } else {
      console.warn(
        "aiStream: Attempted to send SSE error but response was already ended."
      );
    }
  };

  try {
    res.flushHeaders?.(); // Flush headers as early as possible
    console.log("aiStream: Headers flushed.");

    const { payload } = req.query;
    if (!payload) {
      console.error("aiStream: Error: Payload is required.");
      return sendSseError("Payload is required.");
    }

    let query: string;
    let metadata: any;

    try {
      const parsedPayload = JSON.parse(payload as string);
      query = parsedPayload.query;
      metadata = parsedPayload.metadata;
      console.log("aiStream: Payload parsed successfully.");
    } catch (parseError) {
      console.error("aiStream: Payload parsing error:", parseError);
      return sendSseError("Invalid payload format.");
    }

    if (!query) {
      console.error("aiStream: Error: Query is required.");
      return sendSseError("Query is required.");
    }

    const contextString = `Analyze this study based on the following metadata: ${JSON.stringify(
      metadata,
      null,
      2
    )}`;
    console.log("aiStream: Context string prepared.");

    let stream: Readable;
    try {
      console.log("aiStream: Calling askQuestionStream...");
      stream = await askQuestionStream(query, contextString);
      console.log("aiStream: askQuestionStream returned a stream.");
    } catch (err) {
      console.error(
        "aiStream: Error from askQuestionStream (before piping):",
        err
      );
      let errorMessage = "Failed to get stream from AI service.";
      if (
        err instanceof AxiosError &&
        err.message.includes("Max retries exceeded")
      ) {
        errorMessage =
          "AI service is currently busy (rate limited). Please try again shortly.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      return sendSseError(errorMessage);
    }

    stream.on("data", (chunk: Buffer) => {
      const dataToSend = chunk.toString().trim();
      if (dataToSend) {
        console.log(
          "aiStream: Sending data chunk:",
          dataToSend.substring(0, 50) + (dataToSend.length > 50 ? "..." : "")
        ); // Log first 50 chars
        res.write(`data: ${dataToSend}\n\n`);
      }
    });

    stream.on("end", () => {
      console.log("aiStream: AI stream ended successfully.");
      if (!res.writableEnded) {
        res.write("data: [DONE]\n\n");
        res.end();
        console.log("aiStream: Response ended.");
      }
    });

    stream.on("error", (err) => {
      console.error(
        "aiStream: Gemini API stream error caught in controller:",
        err
      );
      // It's crucial to check if res is still writable before writing to it
      sendSseError(
        `Stream from AI service failed: ${err.message || "Unknown error"}`
      );
    });

    req.on("close", () => {
      console.warn("aiStream: Client disconnected from SSE stream.");
      if (stream && !stream.destroyed) {
        stream.destroy(); // Destroy the upstream AI service stream
        console.log(
          "aiStream: Upstream AI stream destroyed due to client disconnect."
        );
      }
      if (!res.writableEnded) {
        res.end();
        console.log("aiStream: Response ended due to client disconnect.");
      }
    });
  } catch (err) {
    console.error("aiStream: Top-level unexpected error:", err);
    let errorMessage = "Internal server error (unexpected top-level error).";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    if (!res.headersSent) {
      // If headers haven't been sent, we can still send a standard HTTP error.
      res.status(500).json({ error: errorMessage });
      console.error(`aiStream: Sent HTTP 500 error: ${errorMessage}`);
    } else {
      // If headers were already sent, we must use SSE format.
      sendSseError(errorMessage);
    }
  }
};
