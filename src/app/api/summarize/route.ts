export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// Simple Urdu translator
function translateToUrdu(text: string): string {
  const dictionary: Record<string, string> = {
    'blog': 'بلاگ',
    'is': 'ہے',
    'example': 'مثال',
    'this': 'یہ',
    'and': 'اور',
    'for': 'کے لئے',
    'use': 'استعمال',
    'you': 'آپ',
    'can': 'کر سکتے ہیں',
    'in': 'میں',
    'documents': 'دستاویزات'
    // Add more words if needed
  };

  return text
    .split(' ')
    .map(word => dictionary[word.toLowerCase()] || word)
    .join(' ');
}

// Blog scraper
async function scrapeBlogText(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const text = $('p').text();
  return text.trim() || 'No text found';
}

// API POST handler
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, message: 'URL is required' },
        { status: 400 }
      );
    }

    const fullText = await scrapeBlogText(url);

    // Simulate AI summary
    const summary = fullText.slice(0, 5000) + '... [summary simulated]';

    // Translate to Urdu
    const summaryUrdu = translateToUrdu(summary);

    return NextResponse.json({
      success: true,
      url,
      summary,
      summaryUrdu,
      length: summary.length
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
