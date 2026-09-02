import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, Award, BarChart3, Target, TrendingUp } from "lucide-react";

type Analysis={id?:string;analysisId?:string;atsScore:number;matchPercentage:number;jobTitle?:string|null;resumeFileName?:string;createdAt?:string};
type Props={analyses:Analysis[];dark?:boolean};

export default function ScoreProgress({analyses,dark=false}:Props){
 const items=useMemo(()=>[...analyses].slice(-8),[analyses]);
 if(!items.length)return null;
 const latest=items[items.length-1]; const first=items[0]; const best=Math.max(...items.map(x=>x.atsScore)); const change=latest.atsScore-first.atsScore;
 const max=Math.max(100,...items.map(x=>x.atsScore)); const bg=dark?"#0f172a":"#fff"; const border=dark?"#334155":"#e2e8f0"; const muted=dark?"#94a3b8":"#64748b";
 return <section style={{marginTop:24,padding:22,borderRadius:24,border:`1px solid ${border}`,background:bg,boxShadow:"0 18px 50px rgba(15,23,42,.06)"}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}><div><div style={{display:"flex",alignItems:"center",gap:8,color:"#7c3aed"}}><TrendingUp size={20}/><strong>Score progress</strong></div><p style={{margin:"7px 0 0",color:muted}}>Track how your resume performance changes across analyses.</p></div><div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 11px",borderRadius:999,background:change>=0?"rgba(34,197,94,.12)":"rgba(239,68,68,.1)",color:change>=0?"#15803d":"#dc2626",fontWeight:800}}>{change>=0?<ArrowUpRight size={16}/>:<ArrowDownRight size={16}/>}{change>=0?"+":""}{change}% since first scan</div></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginTop:18}}><Metric icon={<Target size={18}/>} label="Latest ATS" value={`${latest.atsScore}%`}/><Metric icon={<Award size={18}/>} label="Best ATS" value={`${best}%`}/><Metric icon={<BarChart3 size={18}/>} label="Latest match" value={`${latest.matchPercentage}%`}/></div>
  <div style={{marginTop:24,padding:18,borderRadius:18,background:dark?"rgba(30,41,59,.6)":"#f8fafc"}}><div style={{display:"flex",height:190,alignItems:"end",gap:10}}>{items.map((item,i)=><div key={item.id||item.analysisId||i} style={{flex:1,minWidth:24,height:"100%",display:"flex",alignItems:"end",gap:4}}><div title={`${item.atsScore}% ATS`} style={{height:`${Math.max(8,(item.atsScore/max)*100)}%`,flex:1,borderRadius:"10px 10px 3px 3px",background:"linear-gradient(180deg,#7c3aed,#2563eb)",transition:"height .25s ease"}}/><div title={`${item.matchPercentage}% Match`} style={{height:`${Math.max(8,(item.matchPercentage/max)*100)}%`,flex:1,borderRadius:"10px 10px 3px 3px",background:"rgba(34,197,94,.65)"}}/></div>)}</div><div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12,color:muted}}><span>Older</span><span>ATS <span style={{opacity:.65}}>and</span> Job Match</span><span>Latest</span></div></div>
 </section>;
}
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div style={{padding:15,borderRadius:17,background:"rgba(124,58,237,.08)"}}><div style={{display:"flex",gap:7,alignItems:"center",color:"#7c3aed",fontSize:13,fontWeight:700}}>{icon}{label}</div><strong style={{fontSize:27,display:"block",marginTop:7}}>{value}</strong></div>}
