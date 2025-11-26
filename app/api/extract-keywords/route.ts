import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ keywords: [] });
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50, // Reduced for faster responses - we only need a few keywords
      messages: [
        {
          role: 'user',
          content: `Extract 2-4 key concepts from this text. Return ONLY comma-separated keywords, nothing else.

Text: "${text}"

Keywords:`
        }
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const keywordsText = content.text.trim();
      const keywords = keywordsText
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .slice(0, 4);

      return NextResponse.json({ keywords });
    }

    return NextResponse.json({ keywords: [] });
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return NextResponse.json(
      { error: 'Failed to extract keywords' },
      { status: 500 }
    );
  }
}
