import AnalysisHistory from "./AnalysisHistory";
import ScoreProgress from "./ScoreProgress";
import CareerRecommendations from "./CareerRecommendations";
import ImprovementRoadmap from "./ImprovementRoadmap";
import SkillGapAnalyzer from "./SkillGapAnalyzer";

type Analysis={id?:string;analysisId?:string;atsScore:number;matchPercentage:number;missingKeywords:string[];strengths:string[];improvements:string[];summary:string;resumeFileName?:string;resumeText?:string;jobDescription?:string;jobTitle?:string|null;createdAt?:string};
type Props={analyses:Analysis[];currentAnalysis?:Analysis|null;jobDescription:string;resumeText?:string;dark?:boolean;onView:(analysis:any)=>void;onDownload:(analysis:any)=>void};

export default function ResumeInsightsSuite({analyses,currentAnalysis,jobDescription,resumeText="",dark=false,onView,onDownload}:Props){
 const analysis=currentAnalysis||analyses[0]||null;
 const effectiveJobDescription=currentAnalysis?.jobDescription||analysis?.jobDescription||jobDescription;
 const effectiveResumeText=currentAnalysis?.resumeText||analysis?.resumeText||resumeText;
 return <section style={{marginTop:30,display:"grid",gap:22}}>
  <ScoreProgress analyses={analyses} dark={dark}/>
  <CareerRecommendations analysis={analysis} dark={dark}/>
  <ImprovementRoadmap analysis={analysis} dark={dark}/>
  <SkillGapAnalyzer jobDescription={effectiveJobDescription||""} resumeText={effectiveResumeText||""} dark={dark}/>
  <AnalysisHistory analyses={analyses} dark={dark} onView={onView} onDownload={onDownload}/>
 </section>;
}
