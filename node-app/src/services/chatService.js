import prisma from "../lib/prisma.js";
import { askLLM } from "./llm.js";
import { buildPrompt } from "./promptBuilder.js";
import { searchKnowledge } from "./ragSearch.js";

export async function handleChat(sessionId, message) {

  console.log("💬 [chatService] sessionId:", sessionId, "message:", message?.slice(0, 50));

  let session;

  // --- SESSION MANAGEMENT ---
  if (!sessionId) {
    console.log("🆕 [chatService] Creating new session...");
    const user = await prisma.user.create({ data: {} });
    session = await prisma.chatSession.create({ data: { userId: user.id } });
    console.log("✅ [chatService] New session created:", session.id);
  } else {
    console.log("🔍 [chatService] Looking up session:", sessionId);
    session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!session) {
      console.warn("⚠️ [chatService] Session not found, creating new one");
      const user = await prisma.user.create({ data: {} });
      session = await prisma.chatSession.create({ data: { userId: user.id } });
    }
    console.log("✅ [chatService] Session found:", session.id);
  }

  // --- SAVE USER MESSAGE ---
  console.log("💾 [chatService] Saving user message...");
  await prisma.message.create({
    data: { sessionId: session.id, role: "user", content: message }
  });

  // --- LOAD HISTORY ---
  const history = await prisma.message.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: "asc" },
    take: 10
  });
  console.log("📜 [chatService] History length:", history.length);
  history.forEach(m => console.log(`  [${m.role}]: ${m.content.slice(0, 60)}`));

  // --- RAG SEARCH ---
  const knowledgeChunks = await searchKnowledge(message);

  // --- BUILD PROMPT ---
  const prompt = buildPrompt({ history, knowledgeChunks, userMessage: message });
  console.log("📝 [chatService] Prompt length:", prompt.length);

  // --- LLM CALL ---
  const aiReply = await askLLM(prompt);
  console.log("🤖 [chatService] AI reply:", aiReply.slice(0, 80));

  // --- SAVE AI MESSAGE ---
  await prisma.message.create({
    data: { sessionId: session.id, role: "assistant", content: aiReply }
  });

  return { sessionId: session.id, reply: aiReply };
}