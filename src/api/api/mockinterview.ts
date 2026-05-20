// @ts-nocheck
export const config = {
  runtime: 'edge', // Yeh bhi edge runtime par chalega taaki crash na ho
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

  try {
    // Frontend se job role aur skills receive karenge
    const { targetGoal, currentSkills } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key missing" }), { status: 500, headers });
    }

    // Mock Interview ke liye makhsoos prompt
    const prompt = `You are an expert technical interviewer. Generate 5 relevant interview questions along with their ideal sample answers for a candidate interviewing for the role of "${targetGoal}". Their current skills are: "${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}". Provide the response ONLY in a valid structured JSON array format containing objects with "question" and "sampleAnswer" fields. Do not add any markdown formatting like \`\`\`json or backticks.`;

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
    let text = resData.candidates[0].content.parts[0].text.trim();
    
    if (text.startsWith("```json")) text = text.substring(7, text.length - 3).trim();
    else if (text.startsWith("```")) text = text.substring(3, text.length - 3).trim();

    return new Response(JSON.stringify(JSON.parse(text)), { status: 200, headers });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}