// const { QdrantClient } = require("@qdrant/js-client-rest");
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: "http://qdrant:6333"
});

const COLLECTION = "knowledge";

async function initCollection() {
  const collections = await client.getCollections();

  const exists = collections.collections.find(
    c => c.name === COLLECTION
  );

  if (!exists) {
    await client.createCollection(COLLECTION, {
      vectors: {
        size: 384,
        distance: "Cosine"
      }
    });

    console.log("✅ Qdrant collection created");
  }
}

export {
  client,
  initCollection,
  COLLECTION
};