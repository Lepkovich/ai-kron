import { QdrantClient } from "@qdrant/js-client-rest";
import { createEmbedding } from "./embeddings.js";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || "http://qdrant:6333"
});

console.log("🗄️ [ragSearch] Qdrant URL:", process.env.QDRANT_URL || "http://qdrant:6333");

const COLLECTION = "knowledge";

export async function searchKnowledge(query, limit = 5) {

  console.log("🔍 [ragSearch] Query:", query);

  // Check collection exists
  try {
    const collections = await qdrant.getCollections();
    const names = collections.collections.map(c => c.name);
    console.log("📦 [ragSearch] Collections in Qdrant:", names);

    if (!names.includes(COLLECTION)) {
      console.warn(`⚠️ [ragSearch] Collection "${COLLECTION}" does NOT exist!`);
    }
  } catch (e) {
    console.error("❌ [ragSearch] Cannot connect to Qdrant:", e.message);
    throw e;
  }

  const embedding = await createEmbedding(query);

  console.log("🔎 [ragSearch] Searching collection:", COLLECTION, "limit:", limit);

  const result = await qdrant.search(COLLECTION, {
    vector: embedding,
    limit: limit
  });

  console.log("✅ [ragSearch] Results count:", result.length);
  result.forEach((r, i) => {
    console.log(`  [${i}] score=${r.score?.toFixed(4)} payload keys:`, Object.keys(r.payload || {}));
  });

  return result.map(item => item.payload.text);
}