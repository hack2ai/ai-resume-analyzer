# AI Resume Analyzer

An AI-powered resume analysis tool that compares your resume against a job description and gives you an ATS score, match percentage, missing keywords, strengths, and improvement suggestions.

## Features

- Upload a PDF resume (drag & drop or click to browse)
- Paste any job description
- Get instant AI analysis powered by GPT-5:
  - **ATS Score** — how well your resume passes Applicant Tracking Systems
  - **Match Percentage** — how closely your resume aligns with the job
  - **Missing Keywords** — important terms from the job description not in your resume
  - **Strengths** — what your resume does well for this role
  - **Improvements** — specific, actionable suggestions

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS (shadcn/ui)
- **Backend**: Node.js + Express 5 + TypeScript
- **PDF Parsing**: pdf-parse
- **File Upload**: Multer
- **AI**: OpenAI GPT-5.2
- **Monorepo**: pnpm workspaces

## Project Structure

```
├── artifacts/
│   ├── api-server/          # Express backend (POST /api/analyze)
│   └── resume-analyzer/     # React frontend
├── lib/
│   ├── api-spec/            # OpenAPI spec (source of truth)
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod schemas
│   └── integrations-openai-ai-server/  # OpenAI client
├── package.json
└── pnpm-workspace.yaml
```

## Setup

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- An OpenAI API key

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in `artifacts/api-server/`:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

Then update `lib/integrations-openai-ai-server/src/client.ts`:

```typescript
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### Running Locally

```bash
# Start the API server (in one terminal)
pnpm --filter @workspace/api-server run dev

# Start the frontend (in another terminal)
pnpm --filter @workspace/resume-analyzer run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:3001`

## API

### POST /api/analyze

Accepts multipart form data:
- `resume` — PDF file (max 10MB)
- `jobDescription` — job description text

Returns JSON:

```json
{
  "atsScore": 78,
  "matchPercentage": 65,
  "missingKeywords": ["React", "TypeScript", "CI/CD"],
  "strengths": [
    "Strong backend experience with Node.js",
    "Demonstrated leadership in project delivery"
  ],
  "improvements": [
    "Add quantified achievements to work history",
    "Include missing keywords naturally in your skills section"
  ],
  "summary": "Your resume is well-structured but missing several key terms..."
}
```

## License

MIT
