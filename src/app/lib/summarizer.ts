import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';

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

// 🔥 THIS IS YOUR API HANDLER
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST allowed' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    // Scrape blog text
    const fullText = await scrapeBlogText(url);

    // Generate summary (simulate AI summary)
    const summary = fullText.slice(0, 200) + '... [summary simulated]';

    // Translate summary to Urdu
    const summaryUrdu = translateToUrdu(summary);

    // Send response
    res.status(200).json({
      success: true,
      url,
      summary,
      summaryUrdu,
      length: summary.length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
