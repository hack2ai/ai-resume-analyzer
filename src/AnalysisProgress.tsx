import { CheckCircle2, Circle, FileText, Search, Target, Tags, Sparkles, LoaderCircle } from "lucide-react";

type Props={active:boolean;dark?:boolean};
const steps=[
  ["Uploading resume",FileText],
  ["Extracting PDF content",Search],
  ["Checking ATS compatibility",Target],
  ["Finding missing keywords",Tags],
  ["Generating AI recommendations",Sparkles],
];
export default function AnalysisProgress({active,dark=false}:Props){
  const background=dark?"rgba(15,23,42,.9)":"rgba(255,255,255,.95)";
  return <section style={{background,border:`1px solid ${dark?"#334155":"#e2e8f0"}`,borderRadius:24,padding:24,boxShadow:"0 18px 50px rgba(15,23,42,.08)"}}>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
      <div style={{width:42,height:42,borderRadius:14,display:"grid",placeItems:"center",background:"linear-gradient(135deg,#7c3aed,#2563eb)",color:"white"}}>{active?<LoaderCircle className="spin" size={21}/>:<Sparkles size={21}/>}</div>
      <div><strong style={{fontSize:17}}>AI analysis in progress</strong><div style={{fontSize:13,opacity:.62}}>ResumeIQ is processing your resume securely.</div></div>
    </div>
    <div style={{display:"grid",gap:10}}>{steps.map(([label,Icon]:any,index)=><div key={label} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 12px",borderRadius:14,background:active?"rgba(124,58,237,.06)":"transparent"}}>
      {active&&index===0?<LoaderCircle className="spin" size={18} color="#7c3aed"/>:<Circle size={18} color="#94a3b8"/>}
      <Icon size={17} color="#7c3aed"/>
      <span style={{fontSize:14,fontWeight:index===0&&active?700:500}}>{label}</span>
      {active&&index===0&&<span style={{marginLeft:"auto",fontSize:12,color:"#7c3aed",fontWeight:700}}>Processing</span>}
    </div>)}</div>
    <div style={{marginTop:16,height:8,borderRadius:999,overflow:"hidden",background:dark?"#1e293b":"#e2e8f0"}}><div style={{height:"100%",width:active?"72%":"0%",borderRadius:999,background:"linear-gradient(90deg,#7c3aed,#2563eb)",transition:"width .6s ease"}}/></div>
  </section>
}
