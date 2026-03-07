import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";

import chatRoutes from "./routes/chatRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import { initCollection } from "./services/qdrant.js";
import { loadKnowledgeFiles } from "./services/knowledgeLoader.js";
import { ingestKnowledge } from "./services/knowledgeIngestor.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);
app.use("/lead", leadRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
const files = loadKnowledgeFiles();
console.log("Knowledge files:", files);

async function start() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    await initCollection();
    console.log("✅ Qdrant collection initialized");

    await ingestKnowledge();
    console.log("✅ Knowledge ingested");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
}

start();