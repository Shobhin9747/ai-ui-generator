import { NextResponse } from "next/server";
import { generateComponentTree, previewUI, exportCode } from "@/tools/uiTools";

export async function POST(req: Request) {
  try {
    // We now expect the structured Json data instead of raw PRD
    const { structuredJson } = await req.json();

    if (!structuredJson) {
      return NextResponse.json({ error: "Structured JSON input is required" }, { status: 400 });
    }

    // 1. Tool Call: Generate Code
    const code = await generateComponentTree(structuredJson);

    // 2. Tool Call: Preview Preparation
    const previewStatus = previewUI(code);

    // 3. Tool Call: Export Preparation
    const exportStatus = exportCode(code);

    return NextResponse.json({ 
      code,
      toolResults: {
        preview: previewStatus,
        export: exportStatus
      }
    });
  } catch (error) {
    console.error("AI Generation failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Synthesis failed" }, { status: 500 });
  }
}
