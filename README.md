# ResumeIQ AI

> A full-stack AI career intelligence platform that analyzes resumes against job descriptions, estimates ATS compatibility, identifies skill gaps, rewrites resume content, generates tailored cover letters, prepares candidates for interviews, and tracks job applications.

## Why ResumeIQ AI?

ResumeIQ AI turns a resume and a target job description into a practical career-improvement workspace. It combines AI analysis with deterministic career tools so users can understand their current fit, improve their resume, prepare for interviews, generate application materials, and track applications in one place.

> **Important:** ATS, match, readiness, and other AI-assisted scores are estimates for guidance. They are not hiring decisions, interview guarantees, or assessments of a person's worth.

## Features

### Resume intelligence

- PDF resume upload with file-type and size validation
- PDF text extraction
- AI-powered ATS-style analysis
- Resume-to-job match scoring
- Missing keyword detection
- Strengths and priority improvements
- Skill Gap Analyzer with keyword coverage
- Score Progress across saved analyses
- Resume Version Comparison
- Career Readiness Score
- Resume Improvement Roadmap
- Analysis History with search, sorting, and score filtering

### AI writing tools

- AI Resume Rewriter with before/after comparison
- Section-focused rewriting for summary, experience, skills, projects, education, or custom content
- Tailored AI Cover Letter Generator
- Cover Letter History
- Copy generated content for applications

### Interview preparation

- Role-focused Interview Preparation
- Behavioral, technical, resume-based, and gap-focused questions
- AI Mock Interview practice with structured feedback
- Practice scoring across clarity, relevance, and structure

### Application management

- Job Application Tracker
- Applied / Interview / Offer / Rejected status workflow
- Search and filtering
- Status updates and deletion
- PostgreSQL-backed persistence for logged-in users

### Security and reliability

- JWT authentication
- Password hashing with bcryptjs
- Helmet security headers
- CORS allow-list configuration
- API rate limiting
- Zod request validation
- Protected user-specific routes and database queries
- PDF upload validation and size limits
- Health endpoint for service monitoring
- Production environment validation
- GitHub Actions CI checks

## Architecture

```text
                    ┌──────────────────────────┐
                    │      React + Vite UI      │
                    │  ResumeIQ Career Workspace│
                    └─────────────┬────────────┘
                                  │ REST / HTTPS
                    ┌─────────────▼────────────┐
                    │ Node.js + Express + TS   │
                    ├──────────┬───────┬───────┤
                    │          │       │       │
              Authentication  Gemini  PDF    Reports
                    │          │       │       │
                    └──────────┴───────┴───────┘
                                  │
                    ┌─────────────▼────────────┐
                    │ Prisma + PostgreSQL      │
                    │ users / analyses /       │
                    │ rewrites / cover letters│
                    │ / applications           │
                    └──────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma |
| AI | Google Gemini via OpenAI-compatible API |
| PDF parsing | pdf-parse |
| PDF reports | PDFKit |
| Validation | Zod |
| Authentication | JWT, bcryptjs |
| Security | Helmet, CORS, express-rate-limit |
| CI | GitHub Actions |

## Project Structure

```text
ai-resume-analyzer/
├── src/
│   ├── ResumeAnalyzer.tsx
│   ├── ResumeInsightsSuite.tsx
│   ├── ResumeRewriter.tsx
│   ├── CoverLetterGenerator.tsx
│   ├── JobApplicationTracker.tsx
│   ├── AIMockInterview.tsx
│   ├── InterviewPreparation.tsx
│   ├── SkillGapAnalyzer.tsx
│   ├── CareerReadinessScore.tsx
│   ├── ResumeActionPlan.tsx
│   ├── ResumeVersionComparison.tsx
│   ├── ScoreProgress.tsx
│   ├── AnalysisHistory.tsx
│   └── hooks/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts
│   │   ├── lib/
│   │   ├── middleware/
│   │   └── routes/
│   ├── package.json
│   └── .env.example
├── .github/
│   └── workflows/
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Google AI Studio Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/hack2ai/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure PostgreSQL

Create a PostgreSQL database named `resumeiq`.

For the local development environment used by the project:

```text
host: localhost
port: 5433
user: postgres
database: resumeiq
```

Use your own password and never commit it.

### 5. Configure backend environment variables

Create `server/.env` from `server/.env.example` and set values similar to:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5433/resumeiq
GEMINI_API_KEY=YOUR_GOOGLE_AI_STUDIO_KEY
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
GEMINI_MODEL=gemini-3.7-flash
CLIENT_ORIGIN=http://localhost:5173
MAX_FILE_SIZE_MB=10
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=7d
```

Never commit `server/.env`, API keys, passwords, or JWT secrets.

### 6. Create/update database tables

```bash
cd server
npx prisma generate
npx prisma migrate dev
```

### 7. Start the backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/health
```

Expected response:

```json
{"status":"ok","service":"resumeiq-api"}
```

### 8. Start the frontend

Open a second terminal:

```bash
cd ai-resume-analyzer
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Development Checks

Frontend:

```bash
npm run typecheck
npm run build
```

Backend:

```bash
cd server
npm run prisma:generate
npm run typecheck
npm run build
npm audit
```

The project uses GitHub Actions to run automated quality checks for repository changes.

## API Overview

### Authentication

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register` | Create account |
| `POST /api/auth/login` | Sign in |
| `GET /api/auth/me` | Current user |

### Resume analysis

| Endpoint | Purpose |
|---|---|
| `POST /api/analyze` | Analyze uploaded resume against a job description |
| `GET /api/dashboard` | Load saved analyses |
| `POST /api/rewrite` | Rewrite a resume section with AI |
| `GET /api/rewrite/history` | Load rewrite history |
| `GET /api/reports/:analysisId.pdf` | Download a saved analysis report |

### Cover letters

| Endpoint | Purpose |
|---|---|
| `POST /api/cover-letter` | Generate a tailored cover letter |
| `GET /api/cover-letter/history` | Load saved cover letters |

### Job applications

| Endpoint | Purpose |
|---|---|
| `GET /api/applications` | List the authenticated user's applications |
| `POST /api/applications` | Create an application |
| `PATCH /api/applications/:id` | Update an application |
| `DELETE /api/applications/:id` | Delete an application |

### Monitoring

| Endpoint | Purpose |
|---|---|
| `GET /health` | API health check |

## Production Deployment

Recommended architecture:

```text
Vercel / Netlify
      │
      │ HTTPS
      ▼
React + Vite frontend
      │
      │ HTTPS / REST
      ▼
Render / Railway
      │
      ├── Express API
      └── Prisma
             │
             ▼
      Managed PostgreSQL
```

### Production frontend variables

```env
VITE_API_URL=https://your-api-domain.example
```

### Production backend variables

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your_production_postgresql_url
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
GEMINI_MODEL=gemini-3.7-flash
CLIENT_ORIGIN=https://your-frontend-domain.example
MAX_FILE_SIZE_MB=10
JWT_SECRET=long_random_production_secret
JWT_EXPIRES_IN=7d
```

For production, use a managed PostgreSQL provider and HTTPS everywhere.

## Security Notes

- Keep all API keys and database credentials on the server.
- Never expose `GEMINI_API_KEY` through frontend code.
- Use a long random production `JWT_SECRET`.
- Configure `CLIENT_ORIGIN` to the exact production frontend origin.
- Use HTTPS in production.
- Keep Helmet and rate limiting enabled.
- Validate all request payloads.
- Validate uploaded PDFs and enforce a size limit.
- Scope database queries to the authenticated user.
- Rotate credentials that are accidentally exposed.
- Review the AI provider's privacy and data-retention terms before processing sensitive resumes.

## Current Project Status

ResumeIQ AI has its core product workflow implemented and locally validated, including frontend and backend type checking/builds, PostgreSQL migrations, Gemini-powered analysis, AI writing tools, interview tools, application tracking, and dependency auditing.

Production deployment, external end-to-end monitoring, and any organization-specific compliance requirements should be completed before treating the system as a public production service.

## Author

**Pankaj (Tony) Kumar**  
AI Engineer · Full Stack Developer · Generative AI & RAG Specialist

- GitHub: https://github.com/hack2ai
- LinkedIn: https://www.linkedin.com/in/pankaj-kumar-ab591a216

## License

MIT
