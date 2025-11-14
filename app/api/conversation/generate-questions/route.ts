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

    // MOCK MODE: If no API key, return smart mock questions
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
      const mockQuestions = generateMockQuestions(problem);
      return NextResponse.json({ questions: mockQuestions });
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

// Fallback mock questions generator
function generateMockQuestions(problem: string): any[] {
  const problemLower = problem.toLowerCase();
  
  // Detect problem type and return relevant questions
  if (problemLower.includes('crm') || problemLower.includes('sales')) {
    return [
      {
        id: "sales_process",
        question: "Walk me through your current sales process. Where does it break down?",
        context: "Understanding your current workflow helps us identify exactly what features you need in a new CRM.",
        type: "text",
        required: true
      },
      {
        id: "team_size",
        question: "How many sales reps will be using this CRM?",
        context: "Team size affects pricing and which CRM features you'll actually need.",
        type: "number",
        required: true
      },
      {
        id: "current_system",
        question: "What are you using now to track sales, and why isn't it working?",
        context: "Knowing what's not working prevents us from recommending similar solutions.",
        type: "text",
        required: false
      },
      {
        id: "must_haves",
        question: "What features are absolutely critical for your team?",
        context: "Must-haves help us filter to vendors that meet your core needs.",
        type: "text",
        required: true
      },
      {
        id: "integration_needs",
        question: "Do you need this to integrate with your email, calendar, or other tools?",
        context: "Integration requirements significantly narrow down your options.",
        type: "yesno",
        required: false
      },
    ];
  }

  if (problemLower.includes('support') || problemLower.includes('ticket') || problemLower.includes('helpdesk')) {
    return [
      {
        id: "volume_trend",
        question: "Is your support volume growing, or has it been steady?",
        context: "Growth trends help us recommend solutions that can scale with you.",
        type: "text",
        required: true
      },
      {
        id: "customer_impact",
        question: "What happens when customers wait too long? Are you seeing churn or complaints?",
        context: "Understanding business impact helps us prioritize the right features.",
        type: "text",
        required: true
      },
      {
        id: "current_process",
        question: "How does your team manage tickets today? What's breaking down?",
        context: "Knowing current pain points helps us avoid recommending similar systems.",
        type: "text",
        required: true
      },
      {
        id: "team_size",
        question: "How many support agents are handling tickets?",
        context: "Team size affects vendor selection and pricing models.",
        type: "number",
        required: true
      },
      {
        id: "success_vision",
        question: "What would success look like in 6 months?",
        context: "Your vision helps us match you with the right type of solution.",
        type: "text",
        required: false
      },
    ];
  }

  // Generic fallback for any problem
  return [
    {
      id: "problem_scope",
      question: "Help me understand the scope of this challenge. How long has this been an issue?",
      context: "Knowing the history helps us gauge urgency and understand what's changed.",
      type: "text",
      required: true
    },
    {
      id: "impact",
      question: "What's the impact on your business? Revenue, costs, team productivity?",
      context: "Business impact helps us prioritize features and justify investments.",
      type: "text",
      required: true
    },
    {
      id: "current_state",
      question: "What are you doing today to address this, and why isn't it working?",
      context: "Understanding current approaches helps us avoid similar solutions.",
      type: "text",
      required: true
    },
    {
      id: "ideal_solution",
      question: "If you could wave a magic wand, what would be different in 6 months?",
      context: "Your ideal outcome helps us find solutions that match your vision.",
      type: "text",
      required: true
    },
    {
      id: "must_haves",
      question: "Any must-have features or absolute deal-breakers?",
      context: "Critical requirements help us filter vendors effectively.",
      type: "text",
      required: false
    },
  ];
}

