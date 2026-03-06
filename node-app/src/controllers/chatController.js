import { handleChat } from "../services/chatService.js";

export async function chat(req, res) {

  try {

    const { sessionId, message } = req.body;

    const result = await handleChat(sessionId, message);

    res.json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Chat failed"
    });

  }

}