import axios from "axios";

export async function sendToLLM(messages) {

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: process.env.LLM_MODEL,
      messages
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;

}