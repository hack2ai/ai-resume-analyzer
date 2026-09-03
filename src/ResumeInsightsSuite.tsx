import { useState } from "react";
import AnalysisHistory from "./AnalysisHistory";
import ScoreProgress from "./ScoreProgress";
import CareerRecommendations from "./CareerRecommendations";
import ImprovementRoadmap from "./ImprovementRoadmap";
import SkillGapAnalyzer from "./SkillGapAnalyzer";
import CareerReadinessScore from "./CareerReadinessScore";
import ResumeActionPlan from "./ResumeActionPlan";

type Analysis={id?:string;analysisId?:string;atsScore:number;matchPercentage:number;missingKeywords:string[];strengths:string[];improvements:string[];summary:string;resumeFileName?:string;resumeText?:string;jobDescription?:string;jobTitle?:string|null;createdAt?:string};
type Props={analyses:Analysis[];currentAnalysis?:Analysis|null;jobDescription:string;resumeText?:string;dark?:boolean;onView:(analysis:any)=>void;onDownload:(analysis:any)=>void};

function AnalysisDetails({analysis,dark=false}:{analysis:Analysis|null;dark?:boolean}){
 const [tab,setTab]=useState<"overview"|"keywords"|"strengths"|"improvements">("overview");
 if(!analysis)return null;
 const tabs=[["overview","Overview"],["keywords",`Missing keywords (${analysis.missingKeywords.length})`],["strengths",`Strengths (${analysis.strengths.length})`],["improvements",`Priorities (${analysis.improvements.length})`]] as const;
 const bg=dark?"rgba(15,23,42,.86)":"rgba(255,255,255,.88)", border=dark?"rgba(71,85,105,.6)":"rgba(226,232,240,.95)", text=dark?"#e5e7eb":"#0f172a", muted=dark?"#94a3b8":"#64748b";
 const items=tab==="keywords"?analysis.missingKeywords:tab==="strengths"?analysis.strengths:analysis.improvements;
 return <section style={{background:bg,border:`1px solid ${border}`,borderRadius:24,padding:24}}><div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}><div><div style={{color:"#7c3aed",fontWeight:800,fontSize:13,letterSpacing:".08em"}}>ANALYSIS DETAILS</div><h2 style={{margin:"8px 0 4px",color:text}}>{analysis.jobTitle||"Resume analysis"}</h2><p style={{margin:0,color:muted}}>{analysis.resumeFileName||"Current resume"}</p></div><span style={{padding:"7px 12px",borderRadius:999,background:"rgba(124,58,237,.12)",color:"#7c3aed",fontWeight:700}}>Detailed breakdown</span></div><div style={{display:"flex",gap:8,overflowX:"auto",paddingTop:20}}>{tabs.map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={{whiteSpace:"nowrap",border:tab===id?"1px solid #7c3aed":`1px solid ${border}`,background:tab===id?"linear-gradient(135deg,#7c3aed,#2563eb)":bg,color:tab===id?"white":text,borderRadius:12,padding:"10px 14px",cursor:"pointer",fontWeight:700}}>{label}</button>)}</div>{tab==="overview"?<div style={{paddingTop:18}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}><div style={{padding:18,border:`1px solid ${border}`,borderRadius:18}}><div style={{fontSize:13,color:muted}}>ATS score</div><strong style={{fontSize:30,color:text}}>{analysis.atsScore}%</strong></div><div style={{padding:18,border:`1px solid ${border}`,borderRadius:18}}><div style={{fontSize:13,color:muted}}>Job match</div><strong style={{fontSize:30,color:text}}>{analysis.matchPercentage}%</strong></div></div><div style={{marginTop:16,padding:18,borderRadius:18,background:dark?"rgba(30,41,59,.5)":"#f8fafc",color:text,lineHeight:1.7}}><strong>AI summary</strong><p style={{marginBottom:0,color:muted}}>{analysis.summary}</p></div></div>:<div style={{paddingTop:18,display:"grid",gap:10}}>{items.length?items.map((item,index)=><div key={`${item}-${index}`} style={{padding:"14px 16px",border:`1px solid ${border}`,borderRadius:14,color:text,lineHeight:1.55}}>{item}</div>):<p style={{color:muted}}>No items available for this section.</p>}</div>}</section>;
}

export default function ResumeInsightsSuite({analyses,currentAnalysis,jobDescription,resumeText="",dark=false,onView,onDownload}:Props){
 const analysis=currentAnalysis||analyses[0]||null;
 const effectiveJobDescription=currentAnalysis?.jobDescription||analysis?.jobDescription||jobDescription;
 const effectiveResumeText=currentAnalysis?.resumeText||analysis?.resumeText||resumeText;
 return <section style={{marginTop:30,display:"grid",gap:22}}>
  <ScoreProgress analyses={analyses} dark={dark}/>
  <CareerReadinessScore analysis={analysis} dark={dark}/>
  <ResumeActionPlan analysis={analysis} dark={dark}/>
  <AnalysisDetails analysis={analysis} dark={dark}/>
  <CareerRecommendations analysis={analysis} dark={dark}/>
  <ImprovementRoadmap analysis={analysis} dark={dark}/>
  <SkillGapAnalyzer jobDescription={effectiveJobDescription||""} resumeText={effectiveResumeText||""} dark={dark}/>
  <AnalysisHistory analyses={analyses} dark={dark} onView={onView} onDownload={onDownload}/>
 </section>;
}
