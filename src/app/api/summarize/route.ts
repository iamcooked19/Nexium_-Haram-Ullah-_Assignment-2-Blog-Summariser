import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

type SummaryResponse = {
  success: boolean;
  url: string;
  summary: string;
  summaryUrdu: string;
  length: number;
};

function translateToUrdu(text: string): string {
  return text
    .replace(/Blog/gi, "بلاگ")
    .replace(/Summary/gi, "خلاصہ")
    .replace(/English/gi, "انگریزی")
    .replace(/Urdu/gi, "اردو");
}

export async function POST(req: NextRequest) {
  const responseData: SummaryResponse = {
    success: false,
    url: "",
    summary: "",
    summaryUrdu: "",
    length: 0,
  };

  try {
    const { url } = (await req.json()) as { url: string };
    if (!url) throw new Error("Invalid URL");

    const { data: html } = await axios.get<string>(url);
    const $ = cheerio.load(html);
    let fullText = "";
    $("p").each((_i, el) => {
      fullText += $(el).text() + " ";
    });

    const summary = fullText.slice(0, 300) + "... [summary simulated]";
    const summaryUrdu = translateToUrdu(summary);

    responseData.success = true;
    responseData.url = url;
    responseData.summary = summary;
    responseData.summaryUrdu = summaryUrdu;
    responseData.length = fullText.length;

    return NextResponse.json(responseData, { status: 200 });
  } catch (err: unknown) {
    responseData.summary =
      err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(responseData, { status: 400 });
  }
}
