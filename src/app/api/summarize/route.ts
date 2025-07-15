import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// Define response type
type SummaryResponse = {
  success: boolean;
  url: string;
  summary: string;
  summaryUrdu: string;
  length: number;
};

// ✅ Simple Urdu translator
function translateToUrdu(text: string): string {
  // Replace with actual translation logic later
  return text
    .replace(/Blog/gi, "بلاگ")
    .replace(/Summary/gi, "خلاصہ")
    .replace(/English/gi, "انگریزی")
    .replace(/Urdu/gi, "اردو");
}

// POST handler
export async function POST(req: NextRequest): Promise<NextResponse> {
  let responseData: SummaryResponse = {
    success: false,
    url: "",
    summary: "",
    summaryUrdu: "",
    length: 0,
  };

  try {
    const body = (await req.json()) as { url: string };
    const inputUrl = body.url;

    if (!inputUrl || typeof inputUrl !== "string") {
      throw new Error("Invalid URL provided");
    }

    responseData.url = inputUrl;

    // ✅ Fetch and scrape blog content
    const { data: html } = await axios.get<string>(inputUrl);
    const $ = cheerio.load(html);

    // Grab text content from <p> tags
    let fullText = "";
    $("p").each((_, el) => {
      fullText += $(el).text() + " ";
    });

    // ✅ Simulate summary (static logic)
    const summary = fullText.slice(0, 300) + "... [summary simulated]";
    const summaryUrdu = translateToUrdu(summary);

    responseData = {
      success: true,
      url: inputUrl,
      summary,
      summaryUrdu,
      length: fullText.length,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: unknown) {
    console.error("Error:", error);
    responseData.summary =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(responseData, { status: 400 });
  }
}
