export function buildPrompt(userMessage, knowledgeChunks) {

  const knowledge = knowledgeChunks.join("\n\n");

  const prompt = `
Используй знания ниже чтобы ответить пользователю.

ЗНАНИЯ:
${knowledge}

ВОПРОС ПОЛЬЗОВАТЕЛЯ:
${userMessage}

Ответь как профессиональный консультант.
`;

  return prompt;
}