// @ts-nocheck
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { targetGoal, currentSkills } = req.body;
    
    if (!apiKey) {
      return res.status(500).json({ error: "API Key missing on Vercel." });
    }

    // Naya stable model use kar rahe hain jo fast hai
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert career counselor. Generate a structured step-by-step career roadmap for someone who wants to become a "${targetGoal}". Their current skills are: "${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}". Provide the response ONLY in a valid JSON object string. Contain modules, topics, and estimated timelines. Do not add any markdown block wrappers like backticks or \`\`\`json text, just clean raw stringified JSON code.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Kisi bhi kism ke markdown ticks ko makhsoos tareeqay se saaf karne ka safe filter
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();

    // Sahi validation checklist parse test
    const parsedData = JSON.parse(text);
    return res.status(200).json(parsedData);

  } catch (error: any) {
    console.error("Vercel Runtime Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}