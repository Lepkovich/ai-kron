import fs from "fs";
import path from "path";

import { QdrantClient } from "@qdrant/js-client-rest";

import { chunkText } from "./chunker.js";
import { createEmbedding } from "./embeddings.js";
import { loadKnowledgeFiles } from "./knowledgeLoader.js";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || "http://qdrant:6333"
});

const COLLECTION = "knowledge";

export async function ingestKnowledge() {

  const files = loadKnowledgeFiles();

  for (const file of files) {

    const content = fs.readFileSync(file, "utf8");

    const chunks = chunkText(content);

    for (const chunk of chunks) {

      const embedding = await createEmbedding(chunk);

      await qdrant.upsert(COLLECTION, {
        points: [
          {
            id: crypto.randomUUID(),
            vector: embedding,
            payload: {
              text: chunk,
              source: file
            }
          }
        ]
      });

      console.log("chunk stored:", file);
    }

  }

}