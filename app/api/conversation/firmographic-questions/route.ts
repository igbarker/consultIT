import { NextResponse } from 'next/server';

// Firmographic questions (after sign-up)
const FIRMOGRAPHIC_QUESTIONS = [
  {
    id: "team_size",
    question: "How many team members will be using this solution?",
    context: "This helps us recommend vendors that scale to your team size and provide accurate pricing.",
    type: "number",
    required: true,
  },
  {
    id: "industry",
    question: "What industry is your company in?",
    context: "Industry affects compliance requirements and vendor expertise in your sector.",
    type: "select",
    options: [
      "Technology/SaaS",
      "Healthcare",
      "Finance/Banking",
      "Retail/E-commerce",
      "Manufacturing",
      "Professional Services",
      "Education",
      "Government",
      "Other"
    ],
    required: false,
  },
  {
    id: "company_size",
    question: "What's your company size?",
    context: "Company size helps match you with vendors who specialize in businesses of your scale.",
    type: "select",
    options: [
      "Just me",
      "2-10 employees",
      "11-50 employees",
      "51-200 employees",
      "201-500 employees",
      "500+ employees"
    ],
    required: false,
  },
  {
    id: "budget",
    question: "What's your budget range for this solution?",
    context: "Budget helps us filter to vendors that fit your financial constraints.",
    type: "select",
    options: [
      "Under $5K/year",
      "$5K-$20K/year",
      "$20K-$50K/year",
      "$50K-$100K/year",
      "Over $100K/year",
      "Not sure yet"
    ],
    required: false,
  },
  {
    id: "timeline",
    question: "When do you need this solution in place?",
    context: "Timeline affects which vendors we recommend based on implementation speed.",
    type: "select",
    options: [
      "Immediately (within 1 month)",
      "1-3 months",
      "3-6 months",
      "6+ months",
      "No rush"
    ],
    required: false,
  },
];

export async function GET() {
  return NextResponse.json({ questions: FIRMOGRAPHIC_QUESTIONS });
}

