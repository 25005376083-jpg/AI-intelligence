// @ts-nocheck
import { GoogleGenAI } from "@google/generative-ai";

// Vercel serverless environment variable pick karne ka standard tareeqa
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";

// Sahi SDK class instantiation
const genAI = new GoogleGenAI({ apiKey });

export default async function handler(req: any, res: any) {
  // CORS Headers configurations
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
      return res.status(500).json({ error: "Gemini API Key is missing on the server settings." });
    }

    // Model initialization
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert career counselor. Generate a structured step-by-step career roadmap for someone who wants to become a "${targetGoal}". Their current skills are: "${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}". Provide the response ONLY in structured JSON format containing modules, topics, and estimated timelines. Do not add any markdown formatting like \`\`\`json.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean markdown blocks safely if generated
    if (text.startsWith("```json")) {
      text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith("```")) {
      text = text.substring(3, text.length - 3).trim();
    }

    return res.status(200).json(JSON.parse(text));
  } catch (error: any) {
    console.error("Backend Error Log:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}