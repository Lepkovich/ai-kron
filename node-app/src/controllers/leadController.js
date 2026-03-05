import prisma from "../lib/prisma.js";

export async function createLead(req, res) {
  try {
    const { name, phone, message } = req.body;

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        message
      }
    });

    res.json({
      status: "saved",
      lead
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
}