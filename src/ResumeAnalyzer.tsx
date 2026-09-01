import { useRef, useState } from "react";
import { FileText, Upload, Sparkles, Target, CheckCircle2, AlertTriangle, X } from "lucide-react";

type AnalysisResult = {
  atsScore: number;
  matchPercentage: number;
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
};

const scoreColor = (score: number) => score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectFile = (selected?: File | null) => {
    if (!selected) return;
    if (selected.type !== "application/pdf") return setError("Please upload a PDF resume.");
    if (selected.size > 10 * 1024 * 1024) return setError("Resume must be smaller than 10 MB.");
    setFile(selected); setError(""); setResult(null);
  };

  const analyze = async () => {
    if (!file || !jobDescription.trim()) return setError("Upload a resume and add a job description first.");
    setLoading(true); setError(""); setResult(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription.trim());
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? ""}/api/analyze`, { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to analyze the resume.");
    } finally { setLoading(false); }
  };

  return <main style={{maxWidth:1120,margin:"0 auto",padding:"32px 20px 72px"}}>
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:48}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{padding:10,borderRadius:12,background:"#0f172a",color:"white"}}><FileText size={22}/></div><div><strong style={{fontSize:20}}>ResumeIQ AI</strong><div style={{fontSize:13,color:"#64748b"}}>Professional resume intelligence platform</div></div></div>
      <span style={{fontSize:13,padding:"7px 12px",borderRadius:999,background:"#e0f2fe",color:"#0369a1"}}>ATS Analysis</span>
    </header>
    <section style={{textAlign:"center",maxWidth:760,margin:"0 auto 42px"}}>
      <div style={{display:"inline-flex",gap:8,alignItems:"center",padding:"8px 14px",borderRadius:999,background:"#f1f5f9",fontSize:14}}><Sparkles size={16}/> AI-powered career intelligence</div>
      <h1 style={{fontSize:"clamp(2.3rem,6vw,4.5rem)",lineHeight:1.05,letterSpacing:"-0.04em",margin:"20px 0 16px"}}>Turn your resume into a stronger application.</h1>
      <p style={{fontSize:18,lineHeight:1.7,color:"#64748b"}}>Compare your resume against a target job description and discover ATS gaps, missing keywords, strengths, and practical improvements.</p>
    </section>
    <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
      <div style={cardStyle} onClick={()=>inputRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();selectFile(e.dataTransfer.files[0]);}}>
        <Upload size={28} color="#2563eb"/><h2>Upload your resume</h2><p>PDF format, maximum 10 MB. Your file is processed only for this analysis.</p>
        <input ref={inputRef} hidden type="file" accept="application/pdf,.pdf" onChange={e=>selectFile(e.target.files?.[0])}/>
        {file ? <div style={{marginTop:16,padding:12,background:"#ecfdf5",borderRadius:10,display:"flex",justifyContent:"space-between",gap:10}}><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{file.name}</span><button onClick={e=>{e.stopPropagation();setFile(null)}} style={iconButton}><X size={16}/></button></div> : <button style={primaryButton}>Choose PDF</button>}
      </div>
      <div style={cardStyle}><Target size={28} color="#7c3aed"/><h2>Target job description</h2><p>Paste the role requirements for a more relevant analysis.</p><textarea value={jobDescription} onChange={e=>setJobDescription(e.target.value)} placeholder="Paste the complete job description, responsibilities, skills and requirements..." style={{width:"100%",minHeight:220,marginTop:12,padding:14,border:"1px solid #cbd5e1",borderRadius:12,resize:"vertical"}}/><small style={{color:"#64748b"}}>{jobDescription.length} characters</small></div>
    </section>
    <div style={{textAlign:"center",margin:"28px 0"}}><button disabled={loading} onClick={analyze} style={{...primaryButton,padding:"14px 28px",opacity:loading?.7:1}}>{loading ? "Analyzing your resume..." : "Analyze Resume"}</button></div>
    {error && <div style={{...cardStyle,borderColor:"#fecaca",background:"#fef2f2",color:"#991b1b",marginBottom:24}}>{error}</div>}
    {result && <section style={{display:"grid",gap:20}}>
      <div style={cardStyle}><h2 style={{marginTop:0}}>Analysis overview</h2><div style={{display:"flex",gap:18,flexWrap:"wrap"}}>{[["ATS Score",result.atsScore],["Job Match",result.matchPercentage]].map(([label,score])=><div key={String(label)} style={{flex:"1 1 180px",padding:18,borderRadius:14,background:"#f8fafc"}}><div style={{fontSize:13,color:"#64748b"}}>{label}</div><div style={{fontSize:42,fontWeight:800,color:scoreColor(Number(score))}}>{score}%</div></div>)}</div><p style={{lineHeight:1.7,color:"#475569"}}>{result.summary}</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}><ListCard title="Strengths" icon={<CheckCircle2 color="#16a34a"/>} items={result.strengths}/><ListCard title="Missing Keywords" icon={<AlertTriangle color="#d97706"/>} items={result.missingKeywords}/><ListCard title="Priority Improvements" icon={<Sparkles color="#2563eb"/>} items={result.improvements}/></div>
    </section>}
  </main>;
}

function ListCard({title,icon,items}:{title:string;icon:React.ReactNode;items:string[]}) { return <div style={cardStyle}><div style={{display:"flex",gap:10,alignItems:"center"}}>{icon}<h2 style={{margin:0,fontSize:18}}>{title}</h2></div><ul style={{paddingLeft:20,lineHeight:1.7,color:"#475569"}}>{items.length ? items.map((item,i)=><li key={i}>{item}</li>) : <li>No major issues detected.</li>}</ul></div>; }
const cardStyle: React.CSSProperties = {background:"white",border:"1px solid #e2e8f0",borderRadius:18,padding:24,boxShadow:"0 8px 30px rgba(15,23,42,.04)"};
const primaryButton: React.CSSProperties = {marginTop:18,border:0,borderRadius:10,background:"#0f172a",color:"white",padding:"11px 18px",cursor:"pointer",fontWeight:700};
const iconButton: React.CSSProperties = {border:0,background:"transparent",cursor:"pointer"};
