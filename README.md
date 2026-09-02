# ResumeIQ AI

> A full-stack AI career intelligence platform that analyzes resumes against job descriptions, estimates ATS compatibility, identifies skill gaps, improves resume content, stores user history, and generates professional PDF reports.

## Highlights

- Secure user registration and login
- JWT-protected personal workspace
- PostgreSQL persistence with Prisma
- PDF resume upload and text extraction
- AI-powered ATS-style analysis
- Resume-to-job match scoring
- Missing keyword detection
- Strength and improvement recommendations
- AI Resume Rewriter with before/after comparison
- Saved analysis and rewrite history
- Protected professional PDF report downloads
- Responsive dashboard
- Light and dark theme preference
- Upload validation and API rate limiting

> **Important:** ATS and match scores are AI-generated estimates. They are guidance tools, not hiring decisions or guarantees of interview selection.

## Architecture

```text
                    ┌─────────────────────┐
                    │   React + Vite UI   │
                    └──────────┬──────────┘
                               │ HTTPS / REST
                    ┌──────────▼──────────┐
                    │ Express + TypeScript│
                    ├──────────┬──────────┤
                    │          │          │
               Authentication  AI     PDF Reports
                    │          │          │
                    └──────────┼──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Prisma + PostgreSQL │
                    └─────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma |
| AI | OpenAI API |
| PDF parsing | pdf-parse |
| PDF reports | PDFKit |
| Validation | Zod |
| Security | Helmet, rate limiting, JWT |

## Project Structure

```text
ai-resume-analyzer/
├── src/                       # React frontend
│   ├── ResumeAnalyzer.tsx
│   ├── ResumeRewriter.tsx
│   └── hooks/useTheme.ts
├── server/
│   ├── prisma/schema.prisma
│   ├── src/routes/
│   │   ├── auth.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── rewrite.routes.ts
│   │   └── report.routes.ts
│   └── .env.example
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- An OpenAI API key

### 1. Clone and install

```bash
git clone https://github.com/hack2ai/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
cd server && npm install
```

### 2. Configure the backend

Copy `server/.env.example` to `server/.env` and configure:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/resumeiq
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5-mini
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=use_a_long_random_secret
```

Never commit `.env` files or API keys.

### 3. Create database tables

```bash
cd server
npx prisma generate
npx prisma migrate dev
```

### 4. Start the backend

```bash
cd server
npm run dev
```

### 5. Start the frontend

```bash
npm run dev
```

The default local addresses are:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Production Deployment

A recommended production architecture is:

```text
Vercel / Netlify  →  React frontend
        │
        ▼
Render / Railway  →  Express API
        │
        ▼
Neon / Supabase / Railway PostgreSQL  →  Database
```

### Production environment variables

**Frontend**

```env
VITE_API_URL=https://your-api-domain.example
```

**Backend**

```env
NODE_ENV=production
DATABASE_URL=your_production_postgres_url
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-5-mini
CLIENT_ORIGIN=https://your-frontend-domain.example
JWT_SECRET=long_random_production_secret
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE_MB=10
```

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register` | Create account |
| `POST /api/auth/login` | Sign in |
| `GET /api/auth/me` | Current user |
| `POST /api/analyze` | Analyze resume |
| `GET /api/dashboard` | Analysis dashboard |
| `POST /api/rewrite` | Improve resume content with AI |
| `GET /api/rewrite/history` | Saved rewrites |
| `GET /api/reports/:analysisId.pdf` | Download analysis report |
| `GET /health` | Health check |

## Security Notes

- Keep API keys and database credentials server-side.
- Use a long random JWT secret in production.
- Configure `CLIENT_ORIGIN` to the exact frontend domain.
- Use HTTPS for all production traffic.
- Validate PDF type and file size.
- Keep rate limiting enabled.
- Rotate any secret that is accidentally committed.
- Review AI-provider data handling before processing real resumes containing sensitive information.

## Roadmap

- Explainable scoring breakdown
- Resume version timeline
- Streaming analysis progress
- Email notifications
- Admin observability dashboard
- Automated deployment workflow

## Author

**Pankaj (Tony) Kumar**  
AI Engineer · Full Stack Developer · Generative AI & RAG Specialist

- GitHub: https://github.com/hack2ai
- LinkedIn: https://www.linkedin.com/in/pankaj-kumar-ab591a216

## License

MIT
