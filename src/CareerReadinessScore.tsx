import { BriefcaseBusiness, CheckCircle2, ShieldCheck, Sparkles, Target, TrendingUp } from "lucide-react";

type Analysis={atsScore:number;matchPercentage:number;missingKeywords:string[];strengths:string[];improvements:string[];jobTitle?:string|null};
type Props={analysis:Analysis|null;dark?:boolean};

function clamp(value:number,min=0,max=100){return Math.max(min,Math.min(max,value));}
function getReadiness(analysis:Analysis){
 const keywordCoverage=analysis.missingKeywords.length===0
   ? 100
   : clamp(100-analysis.missingKeywords.length*7);
 const improvementReadiness=analysis.improvements.length===0
   ? 100
   : clamp(100-analysis.improvements.length*5);
 const score=Math.round(
   analysis.atsScore*0.4+
   analysis.matchPercentage*0.35+
   keywordCoverage*0.15+
   improvementReadiness*0.10
 );
 return {score,keywordCoverage,improvementReadiness};
}
function label(score:number){return score>=85?"Excellent":score>=70?"Strong":score>=55?"Developing":"Needs work";}

export default function CareerReadinessScore({analysis,dark=false}:Props){
 if(!analysis)return null;
 const {score,keywordCoverage,improvementReadiness}=getReadiness(analysis);
 const text=dark?"#e5e7eb":"#0f172a";
 const muted=dark?"#94a3b8":"#64748b";
 const border=dark?"#334155":"#e2e8f0";
 const bg=dark?"rgba(15,23,42,.86)":"#fff";
 const readinessLabel=label(score);
 const meterColor=score>=85?"#16a34a":score>=70?"#2563eb":score>=55?"#d97706":"#dc2626";
 const factors=[
  {icon:<ShieldCheck size={17}/>,label:"ATS compatibility",value:analysis.atsScore,weight:"40%"},
  {icon:<Target size={17}/>,label:"Job match",value:analysis.matchPercentage,weight:"35%"},
  {icon:<Sparkles size={17}/>,label:"Keyword coverage",value:keywordCoverage,weight:"15%"},
  {icon:<TrendingUp size={17}/>,label:"Improvement readiness",value:improvementReadiness,weight:"10%"},
 ];
 return <section style={{padding:24,borderRadius:24,border:`1px solid ${border}`,background:bg,boxShadow:"0 18px 50px rgba(15,23,42,.06)"}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap"}}>
   <div><div style={{display:"flex",alignItems:"center",gap:8,color:"#7c3aed"}}><BriefcaseBusiness size={20}/><strong>Career readiness score</strong></div><p style={{margin:"7px 0 0",color:muted}}>A practical composite indicator for this resume and target role.</p></div>
   <div style={{padding:"8px 12px",borderRadius:999,background:`${meterColor}18`,color:meterColor,fontWeight:800}}>{readinessLabel}</div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"minmax(170px,240px) 1fr",gap:24,alignItems:"center",marginTop:22}}>
   <div style={{textAlign:"center",padding:18,borderRadius:20,background:dark?"rgba(30,41,59,.65)":"#f8fafc"}}>
    <div style={{fontSize:13,color:muted}}>Readiness index</div><div style={{fontSize:58,lineHeight:1,fontWeight:900,color:meterColor,marginTop:10}}>{score}</div><div style={{fontSize:13,color:muted,marginTop:6}}>/ 100</div>
    <div style={{height:10,borderRadius:99,background:dark?"#1e293b":"#e2e8f0",marginTop:18,overflow:"hidden"}}><div style={{width:`${score}%`,height:"100%",borderRadius:99,background:meterColor,transition:"width .3s ease"}}/></div>
   </div>
   <div style={{display:"grid",gap:12}}>{factors.map((factor)=><div key={factor.label} style={{padding:14,border:`1px solid ${border}`,borderRadius:16}}><div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:8,color:text,fontWeight:700}}>{factor.icon}{factor.label}</div><strong style={{color:text}}>{factor.value}% <span style={{fontSize:11,color:muted,fontWeight:600}}>({factor.weight})</span></strong></div><div style={{height:7,borderRadius:99,background:dark?"#1e293b":"#eef2f7",marginTop:9,overflow:"hidden"}}><div style={{width:`${factor.value}%`,height:"100%",borderRadius:99,background:meterColor}}/></div></div>)}</div>
  </div>
  <div style={{display:"flex",gap:8,alignItems:"center",marginTop:16,padding:"12px 14px",borderRadius:14,background:"rgba(124,58,237,.08)",color:muted,fontSize:13,lineHeight:1.5}}><CheckCircle2 size={16} color="#7c3aed"/>This score is a heuristic summary of the current analysis, not a hiring decision.</div>
 </section>;
}
