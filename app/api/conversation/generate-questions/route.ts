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
          content: `You are an expert business consultant conducting a discovery interview. Your job is to ask insightful, consultative questions that demonstrate you've actually read and understood the user's specific problem.

CRITICAL RULES:
1. Reference specific details from their problem statement - show you're listening
2. Ask questions that a $500/hour consultant would ask - deep, strategic, not surface-level
3. Focus on understanding: problem scope/trends, business impact, current processes, what they've tried, constraints, success criteria
4. Be conversational and professional - like talking to a colleague, not filling out a form
5. Each question must have a clear "context" explaining why it matters
6. Mix question types: mostly text (open-ended), some yes/no for quick validation
7. DO NOT ask generic company demographics (we'll ask those separately later)
8. Make questions feel personalized to THEIR specific situation

Example of GOOD consultative question:
"You mentioned [specific detail from their problem]. Help me understand - is this a recent trend or has it been building over time? And when [specific impact] happens, what's the actual cost to your business?"

Example of BAD question (too generic):
"How many employees are in your company?"

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "unique_snake_case_id",
    "question": "The conversational, consultative question that references their specific problem",
    "context": "Why this question matters - how it helps us find the right solution",
    "type": "text" | "yesno",
    "required": true
  }
]

Generate 5-7 questions.`
        },
        {
          role: "user",
          content: `User's problem: "${problem}"\n\nGenerate consultative questions that show you understand their specific situation. Reference details from their problem.`
        }
      ],
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content;
    
    // Parse the response - it should be a JSON array
    let questions = [];
    try {
      // Try parsing as array directly
      questions = JSON.parse(response || '[]');
      
      // If it's wrapped in an object with "questions" key, extract it
      if (questions && typeof questions === 'object' && !Array.isArray(questions)) {
        questions = questions.questions || questions.data || [];
      }
      
      // Ensure it's an array
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Response was:', response);
      // Fallback to mock questions
      questions = generateMockQuestions(problem);
    }

    return NextResponse.json({ questions });
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

  // Generic fallback for any problem - make it more consultative
  return [
    {
      id: "problem_scope",
      question: `Help me understand the scope of this challenge. You mentioned "${problem.substring(0, 50)}..." - how long has this been an issue, and is it getting worse or staying the same?`,
      context: "Understanding the timeline and trajectory helps us gauge urgency and identify what might have changed recently.",
      type: "text",
      required: true
    },
    {
      id: "business_impact",
      question: "When this problem occurs, what's the actual cost to your business? Are we talking about lost revenue, increased costs, team frustration, or customer complaints?",
      context: "Quantifying the business impact helps us prioritize features and justify the investment in a solution.",
      type: "text",
      required: true
    },
    {
      id: "current_approach",
      question: "What are you doing today to address this? Walk me through your current process and help me understand where it's breaking down.",
      context: "Knowing what you've already tried helps us avoid recommending similar solutions that won't solve the root cause.",
      type: "text",
      required: true
    },
    {
      id: "success_vision",
      question: "If we solve this perfectly, what would be different in 6 months? Paint me a picture of what success looks like.",
      context: "Your vision of success helps us match you with solutions that align with your goals, not just check boxes.",
      type: "text",
      required: true
    },
    {
      id: "constraints",
      question: "What constraints are we working with? Budget, timeline, technical limitations, or team capabilities?",
      context: "Understanding constraints upfront helps us recommend realistic solutions that you can actually implement.",
      type: "text",
      required: false
    },
    {
      id: "must_haves",
      question: "Are there any absolute must-haves or deal-breakers? Features or capabilities that would make a solution a non-starter?",
      context: "Critical requirements help us filter vendors effectively and save you time evaluating options that won't work.",
      type: "text",
      required: false
    },
  ];
}

