import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const DEFAULT_SYSTEM_PROMPT = `You are an expert Senior UI Engineer and React Developer.
Your task is to convert a Product Requirements Document (PRD) into a high-quality, modern, and responsive React component tree using Tailwind CSS.

RULES:
1. Use React (Next.js context) and Tailwind CSS exclusively.
2. Use Lucide React for icons.
3. Use Framer Motion for animations where appropriate.
4. Export a single default component that captures the entire UI structure.
5. Ensure the design is premium, with glassmorphism, smooth gradients, and balanced whitespace.
6. The code must be self-contained in one block. Do not explain, just provide the code.
7. Return only the code inside a markdown block.`;

export async function POST(req: Request) {
  try {
    const { prd, systemPrompt } = await req.json();

    if (!prd) {
      return NextResponse.json({ error: "PRD is required" }, { status: 400 });
    }

    if (!API_KEY) {
      // Mock mode for demonstration if no API key is provided
      console.warn("No Gemini API key found. Returning mock response.");
      return NextResponse.json({
        code: `
import React from 'react';
import { Layout, CheckCircle, Code, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const MockComponent = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-200 p-8 flex flex-col items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 max-w-2xl w-full text-center space-y-6"
      >
        <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto border border-cyan-500/30">
          <Layout className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          AI UI Agent Preview
        </h1>
        <p className="text-slate-400 text-lg">
          Please provide your Gemini API key in the .env file to see real generations. 
          This is a placeholder component showing the premium glassmorphic style.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
          <div className="flex items-center gap-2 text-cyan-400">
            <CheckCircle size={16} /> Tailwind Ready
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <CheckCircle size={16} /> React Framer Motion
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MockComponent;
        `.trim()
      });
    }

    let text = "";

    if (API_KEY.startsWith("gsk_") || API_KEY.startsWith("xai-")) {
      const isGroq = API_KEY.startsWith("gsk_");
      const apiUrl = isGroq
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.x.ai/v1/chat/completions";

      const modelName = isGroq ? "llama-3.3-70b-versatile" : "grok-beta";

      const aiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemPrompt || DEFAULT_SYSTEM_PROMPT },
            { role: "user", content: `PRD contents:\n${prd}` }
          ],
          temperature: 0,
        }),
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        const provider = isGroq ? "Groq" : "xAI";
        throw new Error(`${provider} API Error: ${errorData.error?.message || aiResponse.statusText}`);
      }

      const data = await aiResponse.json();
      text = data.choices[0].message.content;
    } else {
      // Logic for Google Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const fullPrompt = `${systemPrompt || DEFAULT_SYSTEM_PROMPT}\n\nPRD contents:\n${prd}`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      text = response.text();
    }

    // Extract code from markdown if present
    const codeMatch = text.match(/```(?:tsx|jsx|javascript|typescript|react)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : text.trim();

    return NextResponse.json({ code });
  } catch (error) {
    console.error("AI Generation failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate components";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
