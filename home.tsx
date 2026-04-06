import { useState, useRef } from "react";
import { FileText, Upload, Briefcase, Zap, CheckCircle, AlertCircle, TrendingUp, Target, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  atsScore: number;
  matchPercentage: number;
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 75) return "hsl(142, 71%, 45%)";
  if (score >= 50) return "hsl(38, 92%, 50%)";
  return "hsl(0, 72%, 51%)";
}

function getScoreBadge(score: number): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  if (score >= 75) return { label: "Excellent", variant: "default" };
  if (score >= 50) return { label: "Good", variant: "secondary" };
  return { label: "Needs Work", variant: "destructive" };
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      toast({ title: "Invalid file type", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload a PDF under 10MB.", variant: "destructive" });
      return;
    }
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({ title: "No resume", description: "Please upload your resume PDF.", variant: "destructive" });
      return;
    }
    if (!jobDescription.trim()) {
      toast({ title: "No job description", description: "Please paste the job description.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription.trim());

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Analysis failed. Please try again.");
        return;
      }

      setResult(data as AnalysisResult);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-tight">ResumeIQ</h1>
            <p className="text-xs text-muted-foreground">AI-powered resume analysis</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Powered by GPT-5
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            Get your resume <span className="text-primary">ATS-ready</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Upload your resume and paste a job description to get an instant AI-powered analysis with actionable feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Upload Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                data-testid="file-drop-zone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                  ${isDragging ? "border-primary bg-accent/50 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-accent/20"}
                  ${file ? "bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-700" : ""}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  data-testid="input-file"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground truncate max-w-48">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="button-remove-file"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Drop your PDF here</p>
                      <p className="text-sm text-muted-foreground mt-0.5">or click to browse</p>
                    </div>
                    <p className="text-xs text-muted-foreground">PDF only, max 10MB</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                data-testid="textarea-job-description"
                placeholder="Paste the full job description here...&#10;&#10;Include requirements, responsibilities, and preferred qualifications for the most accurate analysis."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[180px] resize-none text-sm leading-relaxed"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {jobDescription.length} characters · More detail = better analysis
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-3 mb-10">
          <Button
            data-testid="button-analyze"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file || !jobDescription.trim()}
            className="w-full max-w-sm h-12 text-base font-semibold gap-2 shadow-md"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing resume...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze Resume
              </>
            )}
          </Button>
          {isAnalyzing && (
            <p className="text-sm text-muted-foreground animate-pulse">
              AI is reading your resume and matching it to the job... this takes ~10 seconds
            </p>
          )}
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/5 mb-8">
            <CardContent className="pt-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Analysis Failed</p>
                <p className="text-sm text-muted-foreground mt-0.5">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <div ref={resultsRef} className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium text-muted-foreground px-3">Analysis Results</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Card className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-around gap-8">
                  <ScoreRing
                    score={result.atsScore}
                    label="ATS Score"
                    color={getScoreColor(result.atsScore)}
                  />
                  <ScoreRing
                    score={result.matchPercentage}
                    label="Job Match"
                    color={getScoreColor(result.matchPercentage)}
                  />
                  <div className="flex flex-col items-center gap-3 max-w-xs text-center">
                    <div className="flex gap-2">
                      <Badge {...getScoreBadge(result.atsScore)}>
                        ATS: {getScoreBadge(result.atsScore).label}
                      </Badge>
                      <Badge {...getScoreBadge(result.matchPercentage)}>
                        Match: {getScoreBadge(result.matchPercentage).label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Strengths
                    <Badge variant="secondary" className="ml-auto text-xs">{result.strengths.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.strengths.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No specific strengths identified.</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5" data-testid={`text-strength-${i}`}>
                          <ChevronRight className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground leading-snug">{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    Improvements
                    <Badge variant="secondary" className="ml-auto text-xs">{result.improvements.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.improvements.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No improvements suggested.</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2.5" data-testid={`text-improvement-${i}`}>
                          <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground leading-snug">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {result.missingKeywords.length > 0 && (
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Missing Keywords
                    <Badge variant="secondary" className="ml-auto text-xs">{result.missingKeywords.length} found</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    These keywords appear in the job description but are missing from your resume. Adding them (where genuine) can improve your ATS score.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-accent/50 text-accent-foreground border-accent-border"
                        data-testid={`badge-keyword-${i}`}
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Keyword coverage</span>
                      <span>{result.matchPercentage}%</span>
                    </div>
                    <Progress value={result.matchPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-center pt-4">
              <Button
                variant="outline"
                data-testid="button-analyze-again"
                onClick={() => { setResult(null); setFile(null); setJobDescription(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Analyze Another Resume
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-6">
        <p className="text-center text-sm text-muted-foreground">
          ResumeIQ analyzes your resume in seconds — no data is stored
        </p>
      </footer>
    </div>
  );
}
