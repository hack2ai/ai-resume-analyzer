# AI Resume Analyzer

> AI-powered resume-to-job matching with ATS scoring, keyword analysis, strengths, and actionable improvement suggestions.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5.2-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

## Overview

AI Resume Analyzer compares a PDF resume against a target job description and produces a structured analysis designed to help improve resume relevance.

### Analysis output

- **ATS score** — estimated resume compatibility
- **Match percentage** — alignment with the job description
- **Missing keywords** — important terms not represented in the resume
- **Strengths** — areas that already align well
- **Improvements** — actionable suggestions
- **Summary** — concise overall assessment

## Architecture

```text
PDF Resume + Job Description
            ↓
      Express API
            ↓
       PDF Parsing
            ↓
       OpenAI Analysis
            ↓
    Structured JSON Result
            ↓
       React Dashboard
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React • Vite • TypeScript • Tailwind CSS • shadcn/ui |
| Backend | Node.js • Express 5 • TypeScript |
| AI | OpenAI GPT-5.2 |
| PDF processing | pdf-parse |
| Uploads | Multer |
| API contract | OpenAPI • Zod |
| Workspace | pnpm monorepo |

## Project Structure

```text
artifacts/
├── api-server/          # Express backend
└── resume-analyzer/     # React frontend
lib/
├── api-spec/            # OpenAPI source of truth
├── api-client-react/    # Generated React Query hooks
├── api-zod/             # Generated validation schemas
└── integrations-openai-ai-server/

package.json
pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- OpenAI API key

### Install

```bash
pnpm install
```

Create `artifacts/api-server/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

### Run

```bash
pnpm --filter @workspace/api-server run dev
```

In another terminal:

```bash
pnpm --filter @workspace/resume-analyzer run dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:3001`

## API

`POST /api/analyze`

Accepts multipart form data:

- `resume` — PDF resume
- `jobDescription` — target job description

Returns a structured analysis containing ATS score, match percentage, missing keywords, strengths, improvements, and summary.

## Security & Privacy

- Keep API keys in environment variables.
- Never commit `.env` files or credentials.
- Treat uploaded resumes as sensitive documents.
- Use appropriate access controls and secure storage when deploying publicly.

## Author

**Pankaj (Tony) Kumar**  
AI Engineer • Full Stack Developer • Generative AI & RAG Specialist

[GitHub](https://github.com/hack2ai) • [LinkedIn](https://www.linkedin.com/in/pankaj-kumar-ab591a216)

## License

MIT
