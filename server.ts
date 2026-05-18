import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DEFAULT_MODEL = "gemini-3-flash-preview";

// --- API Endpoints ---

// 1. Analyze Resume
app.post("/api/analyze-resume", async (req, res) => {
  const { resumeText, targetRole } = req.body;
  
  if (!resumeText || !targetRole) {
    return res.status(400).json({ error: "Missing resume text or target role" });
  }

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `
        Analyze the following resume for a ${targetRole} position.
        Resume Text: ${resumeText}
        
        Provide:
        1. ATS Score (0-100)
        2. Key Strengths
        3. Missing Skills/Keywords (specific to ${targetRole})
        4. Improvement Suggestions
        5. A professional summary rewrite.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            professionalSummary: { type: Type.STRING }
          },
          required: ["atsScore", "strengths", "missingSkills", "suggestions", "professionalSummary"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// 2. Generate Roadmap
app.post("/api/generate-roadmap", async (req, res) => {
  const { currentSkills, targetGoal } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `
        Generate a detailed learning roadmap for a student aiming to become a ${targetGoal}.
        Current Skills: ${currentSkills.join(", ")}
        
        Include:
        - Specific technologies to learn
        - Learning sequence (Foundations, Advanced, Specialization)
        - 3 innovative project ideas based on this path.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING }
                }
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          },
          required: ["roadmap", "projects"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

// 3. Mock Interview Questions
app.post("/api/interview-questions", async (req, res) => {
  const { role, level } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Generate 5 technical and 2 behavioral interview questions for a ${level} ${role} role.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technical: { type: Type.ARRAY, items: { type: Type.STRING } },
            behavioral: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["technical", "behavioral"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// --- Vite Middleware ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
