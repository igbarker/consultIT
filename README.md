# consultIT

AI-Powered Vendor Evaluation Platform

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **AI**: OpenAI GPT-4

## Project Structure

```
consultit/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/              # Utility functions
└── public/           # Static assets
```

## Development Phases

- **Phase 1** (Current): Core flow - problem input, AI questions, vendor recommendations
- **Phase 2**: Team collaboration, chat, vendor comparison
- **Phase 3**: Calendar, tasks, project management
- **Phase 4**: Polish and launch

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

