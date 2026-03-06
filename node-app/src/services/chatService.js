import prisma from "../lib/prisma.js";
import { sendToLLM } from "./llmService.js";
import { buildPrompt } from "./promptBuilder.js";

export async function handleChat(sessionId, message) {

  let session;

  if (!sessionId) {

    const user = await prisma.user.create({
      data: {}
    });

    session = await prisma.chatSession.create({
      data: {
        userId: user.id
      }
    });

  } else {

    session = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    });

  }

  await prisma.message.create({
    data: {
      sessionId: session.id,
      role: "user",
      content: message
    }
  });

  const history = await prisma.message.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: "asc" }
  });

  const prompt = buildPrompt(history);

  const aiReply = await sendToLLM(prompt);

  await prisma.message.create({
    data: {
      sessionId: session.id,
      role: "assistant",
      content: aiReply
    }
  });

  return {
    sessionId: session.id,
    reply: aiReply
  };

}