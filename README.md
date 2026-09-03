# ResumeIQ AI

<p align="center">
  <strong>AI-powered career intelligence for smarter job applications.</strong>
</p>

<p align="center">
  Analyze resumes, optimize content, prepare for interviews, generate application materials, and track applications from one workspace.
</p>

<p align="center">
  <a href="https://github.com/hack2ai/ai-resume-analyzer/actions">CI</a> ·
  <a href="https://github.com/hack2ai/ai-resume-analyzer">Repository</a> ·
  <a href="https://github.com/hack2ai">Author</a>
</p>

---

## Overview

**ResumeIQ AI** is a full-stack career intelligence platform built around a simple workflow: upload a resume, provide a target job description, and turn the analysis into concrete next steps.

The platform combines **Google Gemini**, **React**, **Express**, **Prisma**, and **PostgreSQL** to provide resume analysis, ATS-style scoring, skill-gap detection, AI rewriting, cover-letter generation, interview preparation, and job-application tracking.

> **Note:** ATS, job-match, readiness, and related scores are estimates for guidance only. They are not hiring decisions, interview guarantees, or guarantees of employment.

## Key Capabilities

| Area | Capabilities |
|---|---|
| Resume analysis | PDF parsing, ATS-style scoring, job matching, strengths, improvements |
| Skill intelligence | Missing keywords, matched terms, keyword coverage, skill gaps |
| Career insights | Career readiness score, improvement roadmap, action plan |
| Resume optimization | AI section rewriting with before/after comparison |
| Cover letters | Tailored Gemini-generated cover letters with history |
| Interview prep | Role-based questions, gap-focused questions, mock interview practice |
| Application tracking | Applied, Interview, Offer, Rejected workflow with search/filtering |
| Progress tracking | Analysis history, score progress, resume version comparison |
| Reports | Downloadable PDF analysis reports |
| Security | JWT auth, bcryptjs, Helmet, CORS allow-list, rate limiting, Zod validation |

## Product Workflow

```text
Upload Resume + Job Description
              │
              ▼
        Gemini Analysis
              │
     ┌────────┼─────────┐
     ▼        ▼         ▼
   ATS     Job Match   Skill Gaps
     │        │         │
     └────────┼─────────┘
              ▼
      Career Readiness
              │
     ┌────────┼───────────┐
     ▼        ▼           ▼
  Rewrite  Cover Letter  Interview Prep
     │        │           │
     └────────┼───────────┘
              ▼
      Job Application Tracker
```

## Architecture

```text
┌──────────────────────────────┐
│       React + Vite UI        │
│      ResumeIQ workspace      │
└──────────────┬───────────────┘
               │ REST / HTTPS
               ▼
┌──────────────────────────────┐
│   Node.js + Express + TS     │
│                              │
│ Auth │ Analysis │ Writing    │
│      │ Reports  │ Tracking   │
└──────┬───────────────┬───────┘
       │               │
       ▼               ▼
┌───────────────┐  ┌────────────────┐
│ Prisma +      │  │ Google Gemini  │
│ PostgreSQL    │  │ AI generation  │
└───────────────┘  └────────────────┘
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

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- JWT
- bcryptjs
- Helmet
- express-rate-limit
- Multer

### AI & Documents

- Google Gemini via its OpenAI-compatible API
- `pdf-parse` for resume text extraction
- PDFKit for generated reports

### Engineering

- GitHub Actions CI
- TypeScript type checking
- Production builds
- Dependency auditing

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
- A Google AI Studio Gemini API key

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

### 4. Create the PostgreSQL database

Create a database named:

```text
resumeiq
```

The local development configuration used for this project is:

```text
Host: localhost
Port: 5433
Database: resumeiq
User: postgres
```

Use your own PostgreSQL password.

### 5. Configure environment variables

Create:

```text
server/.env
```

Use `server/.env.example` as the template.

Example:

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

**Never commit `.env`, passwords, JWT secrets, or API keys.**

### 6. Initialize Prisma

From `server/`:

```bash
npx prisma generate
npx prisma migrate dev
```

### 7. Start the backend

From `server/`:

```bash
npm run dev
```

Backend:

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

Open a second terminal in the project root:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Development & Quality Checks

### Frontend

```bash
npm run typecheck
npm run build
```

### Backend

```bash
cd server
npm run prisma:generate
npm run typecheck
npm run build
npm audit
```

The repository also contains GitHub Actions workflows that validate frontend and backend quality on repository changes.

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Return the current user |

### Resume & career intelligence

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyze` | Analyze a PDF resume against a job description |
| GET | `/api/dashboard` | Load saved resume analyses |
| POST | `/api/rewrite` | Rewrite a resume section with AI |
| GET | `/api/rewrite/history` | Load saved rewrites |
| GET | `/api/reports/:analysisId.pdf` | Download a PDF analysis report |

### Cover letters

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/cover-letter` | Generate a tailored cover letter |
| GET | `/api/cover-letter/history` | Load saved cover letters |

### Job applications

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | List applications for the authenticated user |
| POST | `/api/applications` | Create an application |
| PATCH | `/api/applications/:id` | Update an application |
| DELETE | `/api/applications/:id` | Delete an application |

### Monitoring

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check API availability |

## Security

ResumeIQ applies several server-side controls:

- JWT-based authentication
- Password hashing with bcryptjs
- User-scoped database queries
- Helmet security headers
- CORS origin allow-list
- Request rate limiting
- Zod request validation
- PDF file-type and size validation
- Production environment-variable validation
- Server-side AI credentials
- No secrets committed to the repository

For production, use HTTPS, a managed PostgreSQL database, strong randomly generated secrets, and platform secret management.

## Production Deployment

Recommended architecture:

```text
             HTTPS
Frontend ───────────────► Backend
Vercel                   Railway / Render
                            │
                            ├── Express
                            ├── Prisma
                            └── Gemini
                                  │
                                  ▼
                           Managed PostgreSQL
```

### Frontend environment

```env
VITE_API_URL=https://your-api-domain.example
```

### Backend environment

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your_production_postgresql_url
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
GEMINI_MODEL=gemini-3.7-flash
CLIENT_ORIGIN=https://your-frontend-domain.example
MAX_FILE_SIZE_MB=10
JWT_SECRET=your_long_random_production_secret
JWT_EXPIRES_IN=7d
```

> Production deployment is intentionally documented here but not included as part of the repository's local development setup.

## Project Status

**Core application:** Complete  
**Local development:** Validated  
**Frontend typecheck/build:** Passing  
**Backend typecheck/build:** Passing  
**Dependency audit:** 0 vulnerabilities in the validated local environment  
**Production deployment:** Planned separately

## Future Enhancements

Potential next-stage improvements include:

- Streaming analysis progress
- Email notifications
- Advanced explainable scoring
- Admin observability
- Automated production deployment
- Organization-specific compliance controls

## Author

**Pankaj Kumar (Tony)**

AI Engineer · Full Stack Developer · Generative AI & RAG Specialist

- GitHub: https://github.com/hack2ai
- LinkedIn: https://www.linkedin.com/in/pankaj-kumar-ab591a216

## License

This project is licensed under the **MIT License**.
