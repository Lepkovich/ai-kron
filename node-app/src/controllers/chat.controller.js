export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    // Пока просто тест
    return res.json({
      reply: `Вы написали: ${message}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
