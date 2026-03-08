import { QdrantClient } from "@qdrant/js-client-rest";
import { createEmbedding } from "./embeddings.js";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || "http://qdrant:6333"
});

const COLLECTION = "knowledge";

export async function searchKnowledge(query, limit = 5) {

  console.log("🔍 [ragSearch] Query:", query);

  const embedding = await createEmbedding(query);

  const result = await qdrant.search(COLLECTION, {
    vector: embedding,
    limit: limit
  });

  console.log("📊 [ragSearch] Scores:", result.map(r => r.score?.toFixed(4)));

  const filtered = result
    .filter(r => r.score > 0.75)
    .map(item => item.payload.text);

  console.log(`✅ [ragSearch] After filter (>0.75): ${filtered.length}/${result.length} chunks`);

  return filtered;
}