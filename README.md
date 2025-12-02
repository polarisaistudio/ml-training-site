# ML/AI Interview Preparation Platform

A structured learning platform to prepare for ML/AI Engineer job interviews. Organized by "time to interview ready" instead of knowledge categories.

## Features

### Public Pages
- **Homepage** - Overview of all 5 learning stages with progress tracking
- **Stage Detail** - List of content items in each stage
- **Question Bank** - Browse all available interview questions
- **Question Detail** - Full question with answer
- **Project Tutorial** - Step-by-step project guides
- **Content Roadmap** - Track what's available vs planned

### Admin Pages (Password Protected)
- **Dashboard** - Overview stats and quick actions
- **Questions Management** - Add, edit, delete questions
- **Interview Logs** - Record and track real interview experiences

## Learning Stages

1. **Resume Ready** (Week 1-2) - Guided projects, resume bullets, BQ stories
2. **Coding Ready** (Week 3-6) - Algorithm problems (LeetCode style)
3. **ML Ready** (Week 7-10) - ML concepts (八股文), ML coding problems
4. **System Design Ready** (Week 11-13) - ML system design problems
5. **Mock Interview Practice** (Ongoing) - Mock interview question sets

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon database account (free tier available)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ml-training-website
npm install
```

### 2. Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project (e.g., "ml-interview-prep")
3. Copy the connection string from the dashboard

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your values:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
ADMIN_PASSWORD=your-secure-password
```

### 4. Set Up Database

Push the schema to your database:

```bash
npm run db:push
```

Seed initial data (stages and content types):

```bash
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

1. Navigate to `/admin`
2. Enter the password set in `ADMIN_PASSWORD` environment variable
3. You can now add questions and interview logs

### Adding Content via Admin

1. **Add Questions**:
   - Go to Admin > Questions > Add Question
   - Fill in title, content, answer
   - Select stage and content type
   - Check "Published" to make it visible
   - Check "Verified from real interview" if applicable

2. **Add Interview Logs**:
   - Go to Admin > Interview Logs > Add Interview Log
   - Record company, position, questions asked
   - Track difficulty and result

## Database Commands

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema changes directly
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed initial data
npm run db:seed
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables:
   - `DATABASE_URL` - Your Neon connection string
   - `ADMIN_PASSWORD` - Admin panel password
3. Deploy

The site will be live at your Vercel URL.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── stages/[slug]/        # Stage detail pages
│   ├── questions/            # Question bank
│   ├── projects/[id]/        # Project tutorials
│   ├── roadmap/              # Content roadmap
│   ├── admin/                # Admin panel
│   │   ├── login/            # Admin login
│   │   ├── questions/        # Question management
│   │   └── interview-logs/   # Interview log management
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # Reusable UI components
│   └── layout/               # Layout components
├── db/
│   ├── schema.ts             # Database schema
│   ├── index.ts              # Database connection
│   └── seed.ts               # Seed script
├── lib/
│   ├── auth.ts               # Authentication helpers
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript types
```

## Phase 2+ Roadmap

Features planned for future phases:

- [ ] User accounts / authentication
- [ ] Progress tracking per user
- [ ] Search and advanced filters
- [ ] Assessment/diagnostic tests
- [ ] Time estimation calculator
- [ ] Learning resource recommendations
- [ ] Markdown file management
- [ ] Analytics and statistics
- [ ] AI/LLM integration for practice

## Contributing

This is currently a personal project. Feel free to fork and adapt for your own use.

## License

MIT
