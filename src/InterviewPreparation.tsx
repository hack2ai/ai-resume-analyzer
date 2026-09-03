import { ChevronDown, Clipboard, MessageSquareText, Sparkles, Target } from "lucide-react";
import { useMemo, useState } from "react";

type Analysis={atsScore:number;matchPercentage:number;missingKeywords:string[];strengths:string[];improvements:string[];jobTitle?:string|null};
type Props={analysis:Analysis|null;dark?:boolean};
type Question={type:"Technical"|"Behavioral"|"Resume-based"|"Gap-focused";question:string;why:string;focus:string};

export default function InterviewPreparation({analysis,dark=false}:Props){
 const [open,setOpen]=useState(0);
 const [copied,setCopied]=useState(false);
 const questions=useMemo<Question[]>(()=>{
  if(!analysis)return [];
  const missing=analysis.missingKeywords.slice(0,3);
  const strengths=analysis.strengths.slice(0,2);
  const improvements=analysis.improvements.slice(0,2);
  const out:Question[]=[
   {type:"Behavioral",question:"Tell me about a project where you solved a difficult problem.",why:"Tests ownership, problem solving, and communication.",focus:"Use STAR: situation, task, action, result."},
   {type:"Resume-based",question:"Walk me through the experience or project you are most proud of.",why:"Interviewers often verify the strongest claims on a resume.",focus:strengths[0]||"Be specific about your contribution and measurable outcome."},
   {type:"Technical",question:`Explain how you would demonstrate the skills required for ${analysis.jobTitle||"this role"}.`,why:"Connects your practical knowledge to the target position.",focus:"Explain your approach, trade-offs, testing, and real-world use."},
  ];
  missing.forEach(skill=>out.push({type:"Gap-focused",question:`What is your current level with ${skill}, and how have you used or learned it?`,why:"Targets a skill gap identified by the resume analysis.",focus:"Be honest about your level and describe concrete learning or project evidence."}));
  improvements.forEach(item=>out.push({type:"Resume-based",question:`How would you strengthen this area of your resume: ${item}?`,why:"Turns a resume weakness into an interview preparation topic.",focus:"Prepare one concrete example, metric, or improvement."}));
  return out.slice(0,8);
 },[analysis]);
 if(!analysis||!questions.length)return null;
 const text=dark?"#e5e7eb":"#0f172a",muted=dark?"#94a3b8":"#64748b",border=dark?"#334155":"#e2e8f0",bg=dark?"rgba(15,23,42,.86)":"#fff";
 const copy=()=>{navigator.clipboard?.writeText(questions.map((q,i)=>`${i+1}. [${q.type}] ${q.question}\nFocus: ${q.focus}`).join("\n\n"));setCopied(true);window.setTimeout(()=>setCopied(false),1400);};
 return <section style={{padding:24,borderRadius:24,border:`1px solid ${border}`,background:bg,boxShadow:"0 18px 50px rgba(15,23,42,.06)"}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"center",flexWrap:"wrap"}}><div><div style={{display:"flex",alignItems:"center",gap:8,color:"#7c3aed"}}><MessageSquareText size={20}/><strong>Interview preparation</strong></div><p style={{margin:"7px 0 0",color:muted}}>Practice questions based on your target role and current resume analysis.</p></div><button onClick={copy} style={{border:`1px solid ${border}`,borderRadius:11,background:bg,color:text,padding:"9px 12px",cursor:"pointer",display:"inline-flex",gap:7,alignItems:"center"}}><Clipboard size={15}/>{copied?"Copied":"Copy questions"}</button></div>
  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:16}}><span style={{padding:"7px 10px",borderRadius:999,background:"rgba(124,58,237,.1)",color:"#7c3aed",fontSize:12,fontWeight:800}}><Target size={13}/> {analysis.jobTitle||"Target role"}</span><span style={{padding:"7px 10px",borderRadius:999,background:"rgba(34,197,94,.1)",color:"#15803d",fontSize:12,fontWeight:800}}><Sparkles size={13}/> {questions.length} practice questions</span></div>
  <div style={{display:"grid",gap:10,marginTop:18}}>{questions.map((q,i)=>{const isOpen=open===i;return <div key={`${q.type}-${q.question}`} style={{border:`1px solid ${border}`,borderRadius:16,overflow:"hidden"}}><button onClick={()=>setOpen(isOpen?-1:i)} style={{width:"100%",border:0,background:dark?"rgba(30,41,59,.55)":"#f8fafc",color:text,padding:"15px 16px",display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",cursor:"pointer",textAlign:"left"}}><div><div style={{fontSize:11,fontWeight:800,color:"#7c3aed",textTransform:"uppercase",letterSpacing:".06em"}}>{q.type}</div><strong style={{display:"block",marginTop:4,lineHeight:1.45}}>{i+1}. {q.question}</strong></div><ChevronDown size={18} style={{transform:isOpen?"rotate(180deg)":"none",flexShrink:0}}/></button>{isOpen&&<div style={{padding:"14px 16px",display:"grid",gap:10}}><div><strong style={{fontSize:12,color:muted}}>Why they may ask</strong><p style={{margin:"4px 0 0",color:text,lineHeight:1.55}}>{q.why}</p></div><div><strong style={{fontSize:12,color:muted}}>Preparation focus</strong><p style={{margin:"4px 0 0",color:text,lineHeight:1.55}}>{q.focus}</p></div></div>}</div>})}</div>
 </section>;
}
