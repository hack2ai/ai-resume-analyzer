# ResumeIQ AI

<p align="center">
  <strong>AI-powered career intelligence for smarter job applications.</strong>
</p>

<p align="center">
  Analyze resumes, optimize content, prepare for interviews, generate application materials, and track applications from one professional workspace.
</p>

<p align="center">
  <a href="https://github.com/hack2ai/ai-resume-analyzer/actions">CI</a> ·
  <a href="https://github.com/hack2ai/ai-resume-analyzer">GitHub Repository</a> ·
  <a href="https://github.com/hack2ai">GitHub Profile</a>
</p>

---

## Overview

**ResumeIQ AI** is a full-stack career intelligence platform that helps candidates move from **resume analysis to application readiness** in one workflow.

A user uploads a PDF resume, adds a target role and job description, and receives ATS-style insights, skill gaps, improvement priorities, career-readiness signals, AI-assisted resume rewriting, a tailored cover letter, interview preparation, and application tracking.

The platform is powered by **Google Gemini** and built with **React, TypeScript, Node.js, Express, Prisma, and PostgreSQL**.

> **Important:** ATS, job-match, readiness, and AI-generated recommendations are estimates for guidance only. They are not hiring decisions or guarantees of employment.

## AI Stack

### Primary AI

**Google Gemini** is the primary generative AI provider used by ResumeIQ AI.

- **Google AI Studio** — API key and Gemini access
- **Gemini 3.7 Flash** — configured model for resume analysis, rewriting, and cover-letter generation
- **Gemini OpenAI-compatible endpoint** — used to integrate Gemini through the OpenAI JavaScript SDK interface
- **OpenAI Node SDK** — client/transport library used for the OpenAI-compatible Gemini API; ResumeIQ does **not** use OpenAI-hosted models for its current AI workflow

### AI-powered features

- Resume-to-job ATS-style analysis
- Job-match scoring
- Missing keyword extraction
- Strength and improvement generation
- Resume section rewriting
- Tailored cover-letter generation

### Deterministic career tools

Not every feature is an LLM call. Several product features intentionally use application logic for predictable results:

- Keyword coverage and skill-gap calculations
- Career Readiness Score
- Resume Action Plan
- Resume Version Comparison
- Score Progress calculations
- Interview question categorization
- Mock-interview scoring across clarity, relevance, and structure
- Job-application status tracking

This hybrid design keeps AI useful while making core product calculations explainable and repeatable.

## Key Capabilities

| Area | Capabilities |
|---|---|
| Resume analysis | PDF parsing, ATS-style analysis, job matching, strengths, improvements |
| Skill intelligence | Missing keywords, matched terms, keyword coverage, skill gaps |
| Career intelligence | Career Readiness Score, action plan, improvement roadmap |
| Resume optimization | AI rewriting with before/after comparison and keyword suggestions |
| Cover letters | Tailored Gemini-generated cover letters and history |
| Interview preparation | Behavioral, technical, resume-based, gap-focused questions |
| Mock interview | Guided practice with structured scoring and feedback |
| Application tracking | Applied, Interview, Offer, Rejected workflow with filtering |
| Progress tracking | Analysis history, score progress, version comparison |
| Reports | Downloadable PDF analysis reports |
| Security | JWT, bcryptjs, Helmet, CORS allow-list, rate limiting, Zod |
| Engineering | TypeScript checks, production builds, GitHub Actions CI |

## Product Workflow

```text
┌─────────────────────────────────────────────┐
│  1. Upload Resume + Target Job Description  │
└──────────────────────┬──────────────────────┘
                       ▼
              ┌─────────────────┐
              │  Gemini AI      │
              │  Resume Analysis│
              └────────┬────────┘
                       ▼
        ┌──────────────┼───────────────┐
        ▼              ▼               ▼
   ATS Score       Job Match       Skill Gaps
        │              │               │
        └──────────────┼───────────────┘
                       ▼
               Career Readiness
                       │
          ┌────────────┼─────────────┐
          ▼            ▼             ▼
      AI Rewrite   Cover Letter   Interview Prep
          │            │             │
          └────────────┼─────────────┘
                       ▼
              Job Application Tracker
```

## Architecture

```text
                       HTTPS / REST
┌──────────────────────────────────────────────────┐
│                  React + Vite UI                 │
│             TypeScript + Tailwind CSS            │
└─────────────────────────┬────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────┐
│              Node.js + Express API               │
│                                                  │
│ Auth │ Resume Analysis │ Rewrite │ Cover Letter │
│      │ Reports         │ Apps    │ Health       │
└───────────────┬──────────────────────┬───────────┘
                │                      │
                ▼                      ▼
┌────────────────────────┐   ┌────────────────────┐
│ Prisma + PostgreSQL    │   │ Google Gemini      │
│ users / analyses /     │   │ Gemini 3.7 Flash   │
│ rewrites / letters /   │   │ generation         │
│ applications          │   │                    │
└────────────────────────┘   └────────────────────┘
```

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- React Hook Form
- Framer Motion
- Radix UI components
- Sonner

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- JWT / JSON Web Tokens
- bcryptjs
- Helmet
- CORS
- express-rate-limit
- Multer

### AI & document processing

- **Google AI Studio**
- **Google Gemini / Gemini 3.7 Flash**
- **OpenAI Node SDK** for the Gemini OpenAI-compatible API interface
- `pdf-parse` for PDF resume extraction
- PDFKit for report generation

### Development & tooling

- GitHub
- GitHub Actions
- npm
- Vite
- TypeScript compiler
- Prisma migrations
- Replit Vite plugins included in the frontend toolchain

## Project Structure

```text
ai-resume-analyzer/
│
├── src/
│   ├── ResumeAnalyzer.tsx
│   ├── ResumeInsightsSuite.tsx
│   ├── ResumeRewriter.tsx
│   ├── CoverLetterGenerator.tsx
│   ├── JobApplicationTracker.tsx
│   ├── InterviewPreparation.tsx
│   ├── AIMockInterview.tsx
│   ├── SkillGapAnalyzer.tsx
│   ├── CareerReadinessScore.tsx
│   ├── ResumeActionPlan.tsx
│   ├── ResumeVersionComparison.tsx
│   ├── ScoreProgress.tsx
│   ├── AnalysisHistory.tsx
│   └── hooks/
│
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
│
├── .github/
│   └── workflows/
│
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Google AI Studio account/API key

### 1. Clone

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

Create a PostgreSQL database named:

```text
resumeiq
```

Local development configuration:

```text
Host: localhost
Port: 5433
Database: resumeiq
User: postgres
```

Use your own PostgreSQL password.

### 5. Configure backend environment

Create:

```text
server/.env
```

Copy values from `server/.env.example` and configure your secrets.

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

Never commit `.env`, API keys, passwords, or JWT secrets.

### 6. Initialize the database

From `server/`:

```bash
npx prisma generate
npx prisma migrate dev
```

### 7. Start the backend

```bash
npm run dev
```

API:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/health
```

Expected:

```json
{"status":"ok","service":"resumeiq-api"}
```

### 8. Start the frontend

Open another terminal in the repository root:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Quality Checks

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

GitHub Actions runs the repository quality checks for pushes and pull requests.

## API Reference

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Current user |

### Resume intelligence

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/analyze` | Analyze a PDF resume against a job description |
| GET | `/api/dashboard` | Retrieve saved analyses |
| POST | `/api/rewrite` | Rewrite a resume section with Gemini |
| GET | `/api/rewrite/history` | Retrieve rewrite history |
| GET | `/api/reports/:analysisId.pdf` | Download an analysis PDF |

### Cover letters

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/cover-letter` | Generate a tailored cover letter |
| GET | `/api/cover-letter/history` | Retrieve cover-letter history |

### Job applications

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/applications` | List applications |
| POST | `/api/applications` | Create application |
| PATCH | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |

### Monitoring

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health check |

## Security

ResumeIQ includes server-side safeguards designed for a production-oriented application:

- JWT authentication
- bcryptjs password hashing
- User-scoped database access
- Helmet security headers
- CORS origin allow-list
- API rate limiting
- Zod request validation
- PDF file type and size validation
- Production environment validation
- Server-side storage of AI credentials
- No application secrets committed to source control

For public deployment, use HTTPS, platform secret management, strong random secrets, and a managed PostgreSQL service.

## CI / Quality Engineering

The repository uses GitHub Actions to validate both frontend and backend builds.

The CI pipeline checks:

```text
Frontend
  ├── npm install
  ├── TypeScript type check
  └── Vite production build

Backend
  ├── npm install
  ├── Prisma Client generation
  ├── TypeScript type check
  └── TypeScript production build
```

The latest validated local dependency audit reports **0 vulnerabilities**.

## Production Deployment

Recommended deployment architecture:

```text
                         HTTPS
                           │
                           ▼
                 ┌─────────────────┐
                 │ Vercel / Netlify│
                 │ React Frontend  │
                 └────────┬────────┘
                          │
                          │ HTTPS / REST
                          ▼
                 ┌─────────────────┐
                 │ Railway / Render│
                 │ Express Backend │
                 └────────┬────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
        Managed PostgreSQL     Google Gemini
```

Production secrets should be configured through the hosting platform rather than committed to Git.

## Project Status

| Component | Status |
|---|---|
| Core application | Complete |
| Frontend typecheck | Passing |
| Frontend production build | Passing |
| Backend typecheck | Passing |
| Backend production build | Passing |
| PostgreSQL + Prisma | Validated locally |
| Dependency audit | 0 vulnerabilities in validated local environment |
| GitHub Actions CI | Passing on latest validated commit |
| Production deployment | Planned |

## Future Enhancements

- Streaming analysis progress
- Email notifications
- More explainable scoring
- Observability and admin dashboards
- Automated deployment pipeline
- Organization-level compliance controls

## Author

**Pankaj Kumar (Tony)**  
AI Engineer · Full Stack Developer · Generative AI & RAG Specialist

- GitHub: https://github.com/hack2ai
- LinkedIn: https://www.linkedin.com/in/pankaj-kumar-ab591a216

## License

MIT License
