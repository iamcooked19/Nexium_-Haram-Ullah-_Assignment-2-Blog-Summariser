import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// ✅ Define API response type
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

// ✅ API Route: POST /api/summarize
export async function POST(req: NextRequest): Promise<NextResponse> {
  const responseData: SummaryResponse = {
    success: false,
    url: "",
    summary: "",
    summaryUrdu: "",
    length: 0,
  };

  try {
    // ✅ Parse JSON body safely
    const body = await req.json();
    const inputUrl: unknown = body?.url;

    // ✅ Validate URL
    if (typeof inputUrl !== "string" || !inputUrl.startsWith("http")) {
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

    // ✅ Populate response
    responseData.success = true;
    responseData.summary = summary;
    responseData.summaryUrdu = summaryUrdu;
    responseData.length = fullText.length;

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in API route:", error);
    responseData.summary =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(responseData, { status: 400 });
  }
}
