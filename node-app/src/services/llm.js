export async function askLLM(prompt) {

  console.log("🤖 [llm] Sending to Groq, prompt length:", prompt.length);
  console.log("🔑 [llm] Groq key present:", !!process.env.GROQ_API_KEY);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",  // быстрая, бесплатная, отлично знает русский
      messages: [{ role: "user", content: prompt }]
    })
  });

  console.log("📡 [llm] HTTP status:", response.status);

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    console.error("❌ [llm] Unexpected response:", JSON.stringify(data, null, 2));
    throw new Error(`LLM response invalid: ${JSON.stringify(data)}`);
  }

  console.log("✅ [llm] Got answer, tokens used:", data.usage?.total_tokens);
  return data.choices[0].message.content;
}