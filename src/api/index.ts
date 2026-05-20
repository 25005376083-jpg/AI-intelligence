// @ts-nocheck
export const config = {
  runtime: 'edge', 
};

export default async function handler(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API Key is missing on Vercel Settings." }), { status: 500, headers });
    }

    // ─── FEATURE 1: CAREER ROADMAP ───────────────────────────────────
    if (path.includes('/api/generate-roadmap') || path.endsWith('/api') || req.method === 'POST') {
      const { targetGoal, currentSkills } = await req.json();

      const prompt = `You are an expert career counselor. Generate a structured step-by-step career roadmap for someone who wants to become a "${targetGoal}". Their current skills are: "${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}". Provide the response ONLY in structured JSON format containing modules, topics, and estimated timelines. Do not add any markdown formatting like \`\`\`json.`;

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

      let text = resData.candidates[0].content.parts[0].text.trim();
      if (text.startsWith("```json")) text = text.substring(7, text.length - 3).trim();
      else if (text.startsWith("```")) text = text.substring(3, text.length - 3).trim();

      return new Response(JSON.stringify(JSON.parse(text)), { status: 200, headers });
    }

    // ─── FUTURE FEATURES (MOCK INTERVIEW / RESUME) ───────────────────
    // Yahan hum kal ko mock interview ka logic bina kisi naye config ke direct add kar saken gey.

    return new Response(JSON.stringify({ error: "Endpoint not found" }), { status: 404, headers });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Server Error: " + error.message }), { status: 500, headers });
  }
}