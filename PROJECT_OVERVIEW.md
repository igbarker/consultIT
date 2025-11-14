# consultIT - Project Overview

## 🎯 What is consultIT?

consultIT is an AI-powered B2B SaaS platform that disrupts the traditional enterprise software/service evaluation process. Instead of paying expensive consultants ($500+/hour), companies can use consultIT to guide them from problem identification to vendor selection—all in one place.

**The Vision:** Become the one-stop shop for finding, evaluating, selecting, and procuring business solutions.

---

## ✅ What We've Built (Current Status)

### 🏠 Landing Page
- **Clean, modern design** with rotating word animation ("challenge", "problem", "issue", etc.)
- **Multiple input methods:**
  - Text input (textarea)
  - Voice input button (UI ready, functionality pending)
  - File upload button (UI ready, functionality pending)
- **Sign-in link** at bottom for returning users
- **Logout button** (top-right) for authenticated users

### 🤖 AI-Powered Conversation Flow

#### Phase 1: Problem Discovery
- User enters their challenge/problem
- AI generates **5-7 contextual, consultative questions** based on their specific problem
- Questions reference details from their input (like a real consultant would)
- Questions focus on:
  - Problem scope and timeline
  - Business impact
  - Current approaches
  - Success vision
  - Constraints
- Each question has context explaining "why we're asking this"

#### Phase 2: Authentication Gate
- After problem questions, user must sign up/sign in
- **Email/password authentication** (via Supabase)
- Email confirmation flow
- State persistence across auth redirects

#### Phase 3: Firmographic Questions
- After sign-up, asks basic company info:
  - Team size
  - Industry
  - Company size
  - Budget range
  - Timeline
- These are separate from consultative questions (as requested)

#### Phase 4: Summary
- Shows summary of their challenge
- Displays all key requirements
- Options to:
  - Edit answers
  - Export summary
  - Export narrative
  - Find vendors (next step)

### 🔐 Authentication & User Management
- **Supabase Auth** integration
- Email/password signup and signin
- Session management
- Protected routes
- Sign-in page for returning users
- Logout functionality

### 💾 State Management
- Conversation state saved to `sessionStorage`
- Persists across page refreshes
- Prevents data loss during auth flows
- Smart restoration of where user left off

### 🎨 Design System
- **Font:** Plus Jakarta Sans (modern, rounded)
- **Color Palette:** Soft pastels with blue/violet gradients
- **Style:** Clean, minimal, Google-inspired
- **Animations:** Smooth transitions, loading states
- **Glassmorphism:** Backdrop blur effects

---

## 🚧 What's Next (In Progress / Planned)

### 🔍 Vendor Discovery & Matching (Next Priority)
- **Google Search API** integration for real-time vendor discovery
- **Vendor matching algorithm** based on:
  - Problem requirements
  - Firmographic data
  - Budget constraints
  - Industry needs
- **Top 3 vendor recommendations** (with confidence scores)
- **Vendor results page** showing:
  - Company name + logo
  - Price range
  - Brief description
  - Key features
  - Why we recommended them
  - Match score vs. requirements
  - Link to vendor website

### 💰 Monetization (Future)
- **Token system** for unlocking additional vendors (beyond top 3)
- **Paywall** for vendors 4-10 (blurred preview)
- **Per-project pricing** with AI usage limits
- **Freemium model** (free for top 3, pay for more)

### 👥 Team Collaboration (Phase 2)
- **Invite colleagues** to projects
- **Chat system** broken up by topics/focus areas:
  - Separate chat per vendor
  - Sub-chats for: legal, pros, cons, etc.
  - AI participation (if asked)
  - @mentions, file attachments, emoji reactions
- **Calendar integration:**
  - Internal team meetings
  - Project deadlines
  - Reminders
  - "Today" view on main page
- **Task management:**
  - Assignable tasks
  - Due dates
  - Priority levels
  - Project accountability

### 📊 Project Dashboard
- **Portfolio view** of all projects
- **Project status** tracking (Active, Completed, Archived)
- **Multiple projects** simultaneously
- **Project search and filtering**

### 📄 Advanced Features (Future)
- **RFP generation** (AI-powered)
- **Vendor comparison** tools
- **Demo script generation** (AI-powered)
- **TCO calculators**
- **Risk analysis**
- **Export capabilities** (PDF, narrative summaries)

---

## 🛠️ Technical Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend & Services
- **Supabase** (PostgreSQL database + Auth)
- **OpenAI GPT-4** (for AI question generation)
- **Next.js API Routes** (serverless functions)

### Infrastructure
- **Vercel** (hosting - planned)
- **GitHub** (version control)

### Development Tools
- **TypeScript** (type safety)
- **ESLint** (code quality)
- **Git** (version control)

---

## 📁 Project Structure

```
consultit/
├── app/
│   ├── page.tsx              # Landing page
│   ├── conversation/
│   │   └── page.tsx          # Main conversation flow
│   ├── signin/
│   │   └── page.tsx          # Sign-in page
│   ├── auth/
│   │   └── callback/         # OAuth callback handler
│   ├── api/
│   │   └── conversation/
│   │       ├── generate-questions/  # AI question generation
│   │       └── firmographic-questions/  # Firmographic questions
│   └── layout.tsx            # Root layout
├── components/
│   ├── LoadingScreen.tsx     # Loading states with fun facts
│   ├── QuestionFlow.tsx      # Question display component
│   └── SignUpForm.tsx        # Auth form component
├── lib/
│   └── supabase/
│       ├── client.ts         # Client-side Supabase
│       └── server.ts         # Server-side Supabase
└── middleware.ts             # Auth session management
```

---

## 🎯 Key Features Implemented

### ✅ Completed
- [x] Landing page with problem input
- [x] AI-powered contextual question generation
- [x] Question flow UI (one question at a time)
- [x] Email/password authentication
- [x] State persistence across sessions
- [x] Sign-in page for returning users
- [x] Logout functionality
- [x] Summary page with all answers
- [x] Loading screens with dynamic messages
- [x] Responsive design

### 🚧 In Progress
- [ ] Vendor search and discovery
- [ ] Vendor matching algorithm
- [ ] Vendor results page

### 📋 Planned
- [ ] Team collaboration (chat, calendar, tasks)
- [ ] Project dashboard
- [ ] Vendor comparison tools
- [ ] RFP generation
- [ ] Payment/token system
- [ ] Voice input functionality
- [ ] File upload processing

---

## 🎨 Design Philosophy

**"Clean, modern, minimal"** - Inspired by Google's simplicity
- No clutter
- Focus on the task at hand
- Smooth animations
- Professional but approachable
- Soft pastel color palette
- Glassmorphism effects

---

## 🚀 Current Status

**Phase:** MVP Development  
**Timeline:** In active development  
**Next Milestone:** Vendor discovery and matching

The platform is currently functional for:
- Problem input
- AI question generation
- User authentication
- Answer collection
- Summary generation

**Ready for:** Beta testing with real users

---

## 💡 Unique Value Proposition

**Why consultIT instead of:**
- **ChatGPT?** → We provide a complete evaluation workflow in one place
- **Google search?** → We combine discovery, evaluation, and collaboration
- **Consultants?** → 90% cheaper, faster, and you stay in control

**The consultIT Advantage:**
- One-stop shop for entire evaluation process
- AI-powered but human-guided
- Team collaboration built-in
- All project data in one place
- No expensive consultants needed

---

## 📞 Questions or Want to Contribute?

This is an active project in development. If you have questions or want to learn more, reach out!

**Built with:** Next.js, React, TypeScript, Supabase, OpenAI  
**Status:** MVP in development  
**Vision:** Disrupt the $150B+ consulting industry

