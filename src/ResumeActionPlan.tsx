import { AlertTriangle, ArrowRight, CheckCircle2, CircleDot, Sparkles } from "lucide-react";

type Analysis={atsScore:number;matchPercentage:number;missingKeywords:string[];strengths:string[];improvements:string[]};
type Props={analysis:Analysis|null;dark?:boolean};
type Action={title:string;reason:string;items:string[];level:"urgent"|"next"|"optional"};

export default function ResumeActionPlan({analysis,dark=false}:Props){
 if(!analysis)return null;
 const actions:Action[]=[];
 if(analysis.missingKeywords.length) actions.push({title:"Fix now",reason:"Close the largest job-match gaps first.",items:analysis.missingKeywords.slice(0,5),level:"urgent"});
 if(analysis.improvements.length) actions.push({title:"Improve next",reason:"Strengthen the areas that are already identified by the analysis.",items:analysis.improvements.slice(0,5),level:"next"});
 if(analysis.strengths.length) actions.push({title:"Keep and highlight",reason:"Preserve the strongest evidence already present in your resume.",items:analysis.strengths.slice(0,4),level:"optional"});
 if(!actions.length)return null;
 const text=dark?"#e5e7eb":"#0f172a", muted=dark?"#94a3b8":"#64748b", border=dark?"#334155":"#e2e8f0", bg=dark?"rgba(15,23,42,.86)":"#fff";
 const tone={urgent:{icon:<AlertTriangle size={18}/>,color:"#dc2626",background:"rgba(239,68,68,.08)"},next:{icon:<ArrowRight size={18}/>,color:"#d97706",background:"rgba(245,158,11,.09)"},optional:{icon:<CheckCircle2 size={18}/>,color:"#15803d",background:"rgba(34,197,94,.08)"}} as const;
 return <section style={{padding:24,borderRadius:24,border:`1px solid ${border}`,background:bg,boxShadow:"0 18px 50px rgba(15,23,42,.06)"}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"center",flexWrap:"wrap"}}><div><div style={{display:"flex",alignItems:"center",gap:8,color:"#7c3aed"}}><Sparkles size={20}/><strong>Resume action plan</strong></div><p style={{margin:"7px 0 0",color:muted}}>Turn the analysis into a practical sequence of edits.</p></div><div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 11px",borderRadius:999,background:"rgba(124,58,237,.1)",color:"#7c3aed",fontSize:13,fontWeight:800}}><CircleDot size={15}/>Prioritized actions</div></div>
  <div style={{display:"grid",gap:12,marginTop:18}}>{actions.map((action,index)=>{const t=tone[action.level];return <div key={action.title} style={{border:`1px solid ${border}`,borderRadius:18,overflow:"hidden"}}><div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",background:t.background,color:text}}><div style={{color:t.color}}>{t.icon}</div><div><strong>{index+1}. {action.title}</strong><div style={{fontSize:12,color:muted,marginTop:3}}>{action.reason}</div></div></div><div style={{padding:"12px 16px",display:"grid",gap:8}}>{action.items.map((item,i)=><div key={`${item}-${i}`} style={{display:"flex",gap:9,alignItems:"flex-start",color:text,fontSize:14,lineHeight:1.5}}><span style={{color:t.color,fontWeight:900}}>•</span><span>{item}</span></div>)}</div></div>})}</div>
  <div style={{marginTop:14,fontSize:12,color:muted}}>Prioritize evidence-based edits and avoid adding skills or experience you do not actually have.</div>
 </section>;
}
