import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { problem } = await req.json();

    if (!problem) {
      return NextResponse.json({ error: 'Problem is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert business consultant conducting a discovery interview. Generate 5-7 conversational, contextual questions to deeply understand the user's specific problem.

Rules:
1. Questions must be directly related to THEIR specific problem (don't ask generic company demographics)
2. Ask like a consultant who actually read their input
3. Focus on: problem scope, impact, current state, what they've tried, what success looks like
4. Be conversational but professional
5. Each question should have a clear "why we're asking" explanation
6. Mix of open-ended (text) and some binary (yes/no) questions
7. Keep questions focused on understanding the PROBLEM, not the company

Return as JSON array:
[
  {
    "id": "unique_id",
    "question": "The conversational question text",
    "context": "Why we're asking this - how it helps find the right solution",
    "type": "text" | "yesno",
    "required": true | false
  }
]`
        },
        {
          role: "user",
          content: `User's problem: "${problem}"\n\nGenerate 5-7 contextual questions to understand their specific situation.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    const data = JSON.parse(response || '{}');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

