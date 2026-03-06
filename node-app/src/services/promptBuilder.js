export function buildPrompt(history) {

  const systemPrompt = {
    role: "system",
    content: `
You are an AI assistant on a website.
Your goal is to help users and answer their questions.

Be helpful and concise.
If the user wants consultation or service, suggest leaving a phone number.
`
  };

  const messages = history.map(m => ({
    role: m.role,
    content: m.content
  }));

  return [systemPrompt, ...messages];

}