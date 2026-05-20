// @ts-nocheck
export const config = {
  runtime: 'edge', // Vercel Edge Runtime jo kabhi crash nahi hota
};

export default async function handler(req: Request) {
  // CORS aur Response Headers Setup
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS Preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const { targetGoal, currentSkills } = await req.json();
    
    // Vercel Environment Variables se key uthana
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API Key is missing on Vercel Settings." }), { status: 500, headers });
    }

    // Expert Prompt Configuration
    const prompt = `You are an expert career counselor. Generate a structured step-by-step career roadmap for someone who wants to become a "${targetGoal}". Their current skills are: "${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}". Provide the response ONLY in a valid structured JSON format containing modules, topics, and estimated timelines. Do not add any markdown formatting like \`\`\`json or backticks. Return raw JSON text only.`;

    // Direct Google Gemini API Endpoint HTTP Fetch Call (Absolute Proof)
    const googleResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const resData = await googleResponse.json();
    
    if (!googleResponse.ok) {
      return new Response(JSON.stringify({ error: resData.error?.message || "Gemini API Error" }), { status: googleResponse.status, headers });
    }

    // Extract Text Response safely
    let text = resData.candidates[0].content.parts[0].text.trim();

    // Safe Markdown Cleaners
    if (text.startsWith("```json")) {
      text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith("```")) {
      text = text.substring(3, text.length - 3).trim();
    }

    // Perfect JSON verification before sending to App.tsx
    const parsedJson = JSON.parse(text);
    return new Response(JSON.stringify(parsedJson), { status: 200, headers });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Server Error: " + (error.message || "Unknown error") }), { status: 500, headers });
  }
}