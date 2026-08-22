# AI Resume Analyzer

> AI-powered resume-to-job matching that turns a resume and job description into structured ATS-style insights, keyword gaps, strengths, and actionable improvement suggestions.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5.2-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-16A34A?style=for-the-badge)](LICENSE)

## Why This Project?

Recruiters and ATS platforms evaluate resumes against job-specific requirements. This project helps candidates understand that alignment by combining document parsing, structured API validation, and LLM-assisted analysis in a full-stack application.

> **Important:** ATS and match scores are estimates, not hiring decisions. Results should be treated as guidance rather than a guarantee of interview selection.

## Features

- PDF resume upload and parsing
- Job-description analysis
- ATS-style compatibility score
- Resume/job match percentage
- Missing keyword detection
- Strength identification
- Actionable improvement suggestions
- Structured overall summary
- React dashboard for results
- Type-safe API contracts
- OpenAPI and Zod validation

## Architecture

```text
              Resume PDF
                  │
                  ├──────────────┐
                  │              │
                  ▼              ▼
          PDF Text Extraction   Job Description
                  │              │
                  └──────┬───────┘
                         ▼
                   Express API
                         │
                  Validation Layer
                         │
                         ▼
                  OpenAI Analysis
                         │
                         ▼
                 Structured JSON
                         │
                         ▼
                  React Dashboard
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React • Vite • TypeScript • Tailwind CSS • shadcn/ui |
| Backend | Node.js • Express 5 • TypeScript |
| AI | OpenAI GPT-5.2 |
| PDF processing | pdf-parse |
| File upload | Multer |
| Validation | Zod |
| API contract | OpenAPI |
| Data fetching | React Query / generated API client |
| Workspace | pnpm monorepo |

## Repository Structure

```text
artifacts/
├── api-server/                         # Express API
└── resume-analyzer/                    # React frontend
lib/
├── api-spec/                           # OpenAPI source of truth
├── api-client-react/                   # Generated React API client
├── api-zod/                            # Generated validation schemas
└── integrations-openai-ai-server/     # OpenAI integration

package.json
pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- OpenAI API key

### 1. Clone

```bash
git clone https://github.com/hack2ai/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

Create `artifacts/api-server/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

Never commit the real API key.

### 4. Start the API

```bash
pnpm --filter @workspace/api-server run dev
```

### 5. Start the frontend

In a second terminal:

```bash
pnpm --filter @workspace/resume-analyzer run dev
```

Default local endpoints:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

## API Contract

### Analyze a resume

```http
POST /api/analyze
Content-Type: multipart/form-data
```

Form fields:

| Field | Type | Description |
|---|---|---|
| `resume` | PDF file | Resume document to analyze |
| `jobDescription` | string | Target job description |

The API returns structured analysis data including the estimated ATS score, match percentage, missing keywords, strengths, improvements, and summary.

## Security & Privacy

Resume documents can contain sensitive personal and professional information. For any public deployment:

- Keep API credentials server-side and in environment variables.
- Never commit `.env` files or secrets.
- Validate uploaded files and enforce size/type limits.
- Avoid retaining uploaded resumes longer than necessary.
- Use HTTPS in production.
- Apply authentication and authorization if the application stores user documents.
- Add rate limiting before exposing the API publicly.
- Review third-party AI-provider data handling before processing real resumes.

## Engineering Notes

The project separates the frontend, API contract, validation schemas, and AI integration so the system can evolve without coupling the UI directly to model responses.

The LLM output should be treated as **untrusted application data**: validate the returned structure before rendering or persisting it.

## Future Improvements

- Resume version history
- Job-description comparison history
- Explainable scoring breakdown
- Streaming analysis progress
- Authentication and private workspaces
- Automated resume tailoring with user approval
- Evaluation dataset for measuring analysis quality
- Observability and API usage metrics

## Author

**Pankaj (Tony) Kumar**  
AI Engineer • Full Stack Developer • Generative AI & RAG Specialist

[GitHub](https://github.com/hack2ai) • [LinkedIn](https://www.linkedin.com/in/pankaj-kumar-ab591a216)

## License

MIT
