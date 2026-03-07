import { searchKnowledge } from "../services/ragSearch.js";
import { buildPrompt } from "../services/promptBuilder.js";
import { askLLM } from "../services/llm.js";

export async function chat(req, res) {

  const { message } = req.body;

  console.log("📨 [chat] Incoming message:", message);

  if (!message) {
    console.error("❌ [chat] No message in request body");
    return res.status(400).json({ error: "No message provided" });
  }

  try {

    // --- STEP 1: RAG Search ---
    console.log("🔍 [chat] Searching knowledge base...");
    let knowledge;
    try {
      knowledge = await searchKnowledge(message);
      console.log("✅ [chat] Knowledge chunks found:", knowledge.length);
      console.log("📚 [chat] Chunks preview:", knowledge.map((k, i) => `[${i}]: ${k.slice(0, 80)}...`));
    } catch (ragError) {
      console.error("❌ [chat] searchKnowledge failed:", ragError.message);
      console.error(ragError.stack);
      return res.status(500).json({ error: "RAG search failed", detail: ragError.message });
    }

    // --- STEP 2: Build Prompt ---
    console.log("🛠️ [chat] Building prompt...");
    let prompt;
    try {
      prompt = buildPrompt(message, knowledge);
      console.log("✅ [chat] Prompt built, length:", prompt.length);
    } catch (promptError) {
      console.error("❌ [chat] buildPrompt failed:", promptError.message);
      return res.status(500).json({ error: "Prompt build failed", detail: promptError.message });
    }

    // --- STEP 3: LLM Call ---
    console.log("🤖 [chat] Calling LLM...");
    let answer;
    try {
      answer = await askLLM(prompt);
      console.log("✅ [chat] LLM answered, length:", answer?.length);
    } catch (llmError) {
      console.error("❌ [chat] askLLM failed:", llmError.message);
      console.error(llmError.stack);
      return res.status(500).json({ error: "LLM call failed", detail: llmError.message });
    }

    res.json({ reply: answer });

  } catch (error) {
    console.error("❌ [chat] Unexpected error:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "AI error", detail: error.message });
  }

}