import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const prompt = `
You are a helpful health assistant for the NutriTracker app. You can only answer questions related to health, nutrition, wellness, or features of the NutriTracker app itself.

If the user's question is about health, nutrition, wellness, or the app's features, provide a helpful, accurate, and professional response.

If the user's question is about anything else (politics, sports, entertainment, technology not related to health, etc.), politely decline to answer and say that you can only assist with health and app-related topics, and you don't have access to information outside that scope.

Keep responses concise but informative. Be friendly and professional.

User question: "${message}"
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content?.trim() || 'Sorry, I couldn\'t generate a response.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}