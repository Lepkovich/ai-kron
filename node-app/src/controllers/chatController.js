export async function chat(req, res) {
  try {
    const { message } = req.body;

    console.log("Incoming message:", message);

    res.json({
      reply: "AI response placeholder"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
}