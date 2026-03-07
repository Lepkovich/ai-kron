export async function createEmbedding(text) {

  console.log("🔢 [embeddings] Creating embedding for text:", text.slice(0, 60));
  console.log("🔑 [embeddings] API key present:", !!process.env.OPENROUTER_API_KEY);
  console.log("🔑 [embeddings] API key prefix:", process.env.OPENROUTER_API_KEY?.slice(0, 8));

  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      input: text
    })
  });

  console.log("📡 [embeddings] HTTP status:", response.status);

  const data = await response.json();

  if (!data.data) {
    console.error("❌ [embeddings] Full error response:", JSON.stringify(data, null, 2));
    throw new Error(`Embedding failed: ${JSON.stringify(data)}`);
  }

  console.log("✅ [embeddings] Embedding vector length:", data.data[0].embedding.length);
  return data.data[0].embedding;
}