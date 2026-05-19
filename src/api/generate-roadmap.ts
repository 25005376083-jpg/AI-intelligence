// @ts-nocheck
export const config = {
  runtime: 'edge', // Is se Vercel bina crash huye super-fast chalega
};

export default async function handler(req: Request) {
  // CORS Headers setting
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const { targetGoal, currentSkills } = await req.json();
    
    // Server variables check
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API Key missing on Vercel." }), { status: 500, headers });
    }

    const prompt = `You are an expert career counselor. Generate a structured step-by-step career roadmap for someone who wants to become a "${targetGoal}". Their current skills are: "${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}". Provide the response ONLY in structured JSON format containing modules, topics, and estimated timelines. Do not add any markdown formatting like \`\`\`json.`;

    // Direct Fetch API Call (Isme kisi SDK package crash ka darr nahi hota)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const resData = await response.json();
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: resData.error?.message || "Gemini API Error" }), { status: response.status, headers });
    }

    let text = resData.candidates[0].content.parts[0].text.trim();

    // Clean any markdown ticks safely
    if (text.startsWith("```json")) {
      text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith("```")) {
      text = text.substring(3, text.length - 3).trim();
    }

    return new Response(JSON.stringify(JSON.parse(text)), { status: 200, headers });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500, headers });
  }
}