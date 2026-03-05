export async function createLead(req, res) {
  try {
    const { name, phone, message } = req.body;

    console.log("Lead received:", { name, phone, message });

    res.json({
      status: "lead received"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
}