export function buildPrompt({ history, knowledgeChunks, userMessage }) {

  const knowledge = knowledgeChunks.length > 0
    ? knowledgeChunks.join("\n\n")
    : "Информация по данному вопросу не найдена в базе знаний.";

  const historyText = history
    .map(m => `${m.role === "user" ? "Пользователь" : "Ассистент"}: ${m.content}`)
    .join("\n");

  // Извлекаем имя пользователя из истории если есть
  const nameMatch = historyText.match(/меня зовут ([А-ЯЁа-яё]+)/i);
  const userName = nameMatch ? `Имя пользователя: ${nameMatch[1]}` : "";

  const prompt = `Ты профессиональный консультант магазина кронштейнов. Отвечай по-русски, кратко и по делу.
${userName ? `\n${userName}\n` : ""}
=====================
БАЗА ЗНАНИЙ
=====================
${knowledge}

=====================
ИСТОРИЯ ДИАЛОГА
=====================
${historyText}

=====================
ВОПРОС ПОЛЬЗОВАТЕЛЯ
=====================
${userMessage}

Ответь как эксперт-консультант. Если пользователь спрашивает своё имя — возьми его из истории диалога выше.`;

  return prompt;
}