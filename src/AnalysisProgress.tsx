import { useEffect, useState } from "react";
import { CheckCircle2, Circle, FileText, Search, Target, Tags, Sparkles, LoaderCircle } from "lucide-react";

type Props={active:boolean;dark?:boolean};
const steps=[
  ["Uploading resume",FileText],
  ["Extracting PDF content",Search],
  ["Checking ATS compatibility",Target],
  ["Finding missing keywords",Tags],
  ["Generating AI recommendations",Sparkles],
] as const;

export default function AnalysisProgress({active,dark=false}:Props){
  const [current,setCurrent]=useState(0);
  useEffect(()=>{
    if(!active){setCurrent(0);return;}
    setCurrent(0);
    const timer=window.setInterval(()=>setCurrent(prev=>prev<steps.length-1?prev+1:prev),1150);
    return()=>window.clearInterval(timer);
  },[active]);
  const progress=active?Math.min(92,18+(current+1)*(74/steps.length)):0;
  const background=dark?"rgba(15,23,42,.9)":"rgba(255,255,255,.95)";
  return <section aria-live="polite" style={{background,border:`1px solid ${dark?"#334155":"#e2e8f0"}`,borderRadius:24,padding:24,boxShadow:"0 18px 50px rgba(15,23,42,.08)"}}>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
      <div style={{width:42,height:42,borderRadius:14,display:"grid",placeItems:"center",background:"linear-gradient(135deg,#7c3aed,#2563eb)",color:"white"}}>{active?<LoaderCircle className="spin" size={21}/>:<Sparkles size={21}/>}</div>
      <div><strong style={{fontSize:17}}>AI analysis in progress</strong><div style={{fontSize:13,opacity:.62}}>{active?`${steps[current][0]}...`:"Ready to analyze your resume."}</div></div>
    </div>
    <div style={{display:"grid",gap:8}}>{steps.map(([label,Icon],index)=>{
      const complete=active&&index<current;const processing=active&&index===current;
      return <div key={label} style={{display:"flex",alignItems:"center",gap:11,padding:"12px 13px",borderRadius:14,background:processing?"rgba(124,58,237,.09)":"transparent",transition:"all .35s ease",opacity:active&&index>current?.48:1}}>
        {complete?<CheckCircle2 size={19} color="#22c55e"/>:processing?<LoaderCircle className="spin" size={19} color="#7c3aed"/>:<Circle size={19} color="#94a3b8"/>}
        <Icon size={17} color={complete?"#22c55e":processing?"#7c3aed":"#94a3b8"}/>
        <span style={{fontSize:14,fontWeight:processing?750:complete?650:500}}>{label}</span>
        {complete&&<span style={{marginLeft:"auto",fontSize:12,color:"#16a34a",fontWeight:700}}>Complete</span>}
        {processing&&<span style={{marginLeft:"auto",fontSize:12,color:"#7c3aed",fontWeight:700}}>Processing</span>}
      </div>;
    })}</div>
    <div style={{marginTop:18,height:8,borderRadius:999,overflow:"hidden",background:dark?"#1e293b":"#e2e8f0"}}><div style={{height:"100%",width:`${progress}%`,borderRadius:999,background:"linear-gradient(90deg,#7c3aed,#2563eb)",transition:"width .7s ease"}}/></div>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12,opacity:.55}}><span>Secure AI processing</span><span>{Math.round(progress)}%</span></div>
  </section>;
}
