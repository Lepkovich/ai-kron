import { handleChat } from "../services/chatService.js";

export async function chat(req, res) {

  const { sessionId, message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "No message provided"
    });
  }

  try {

    const result = await handleChat(sessionId, message);

    res.json(result);

  } catch (error) {

    console.error("Chat error:", error);

    res.status(500).json({
      error: "AI error",
      detail: error.message
    });

  }

}