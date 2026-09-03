import { ArrowDownRight, ArrowUpRight, CalendarDays, GitCompareArrows } from "lucide-react";
import { useMemo, useState } from "react";

type Analysis={id?:string;analysisId?:string;atsScore:number;matchPercentage:number;missingKeywords:string[];strengths:string[];improvements:string[];resumeFileName?:string;jobTitle?:string|null;createdAt?:string};
type Props={analyses:Analysis[];dark?:boolean};

function delta(newValue:number,oldValue:number){return newValue-oldValue;}
function Delta({value}:{value:number}){if(value===0)return <span style={{fontSize:12,opacity:.6}}>No change</span>;const positive=value>0;return <span style={{display:"inline-flex",alignItems:"center",gap:3,color:positive?"#15803d":"#dc2626",fontWeight:800,fontSize:13}}>{positive?<ArrowUpRight size={14}/>:<ArrowDownRight size={14}/>} {positive?"+":""}{value}%</span>}
function fmt(date?:string){return date?new Date(date).toLocaleDateString():"Unknown date";}

export default function ResumeVersionComparison({analyses,dark=false}:Props){
 const ordered=useMemo(()=>[...analyses].filter(x=>x.createdAt).sort((a,b)=>new Date(a.createdAt!).getTime()-new Date(b.createdAt!).getTime()),[analyses]);
 const [olderId,setOlderId]=useState(ordered.length>1?(ordered[ordered.length-2].id||ordered[ordered.length-2].analysisId||""):"");
 const [newerId,setNewerId]=useState(ordered.length?ordered[ordered.length-1].id||ordered[ordered.length-1].analysisId||"":"");
 const older=ordered.find(x=>(x.id||x.analysisId)===olderId)||ordered[ordered.length-2];
 const newer=ordered.find(x=>(x.id||x.analysisId)===newerId)||ordered[ordered.length-1];
 if(ordered.length<2||!older||!newer)return null;
 const text=dark?"#e5e7eb":"#0f172a",muted=dark?"#94a3b8":"#64748b",border=dark?"#334155":"#e2e8f0",bg=dark?"rgba(15,23,42,.86)":"#fff";
 const rows=[
  ["ATS score",older.atsScore,newer.atsScore],
  ["Job match",older.matchPercentage,newer.matchPercentage],
  ["Missing keywords",older.missingKeywords.length,newer.missingKeywords.length],
  ["Strengths",older.strengths.length,newer.strengths.length],
  ["Priority improvements",older.improvements.length,newer.improvements.length],
 ] as const;
 const addedKeywords=newer.missingKeywords.filter(x=>!older.missingKeywords.some(y=>y.toLowerCase()===x.toLowerCase()));
 const resolvedKeywords=older.missingKeywords.filter(x=>!newer.missingKeywords.some(y=>y.toLowerCase()===x.toLowerCase()));
 return <section style={{padding:24,borderRadius:24,border:`1px solid ${border}`,background:bg,boxShadow:"0 18px 50px rgba(15,23,42,.06)"}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap"}}><div><div style={{display:"flex",alignItems:"center",gap:8,color:"#7c3aed"}}><GitCompareArrows size={20}/><strong>Resume version comparison</strong></div><p style={{margin:"7px 0 0",color:muted}}>Compare two saved analyses and see measurable progress.</p></div><span style={{padding:"7px 11px",borderRadius:999,background:"rgba(124,58,237,.1)",color:"#7c3aed",fontSize:12,fontWeight:800}}>Side by side</span></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,marginTop:18}}><VersionSelect label="Older version" value={older.id||older.analysisId||""} options={ordered} onChange={setOlderId} dark={dark}/><VersionSelect label="Newer version" value={newer.id||newer.analysisId||""} options={ordered} onChange={setNewerId} dark={dark}/></div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 110px",gap:0,marginTop:18,border:`1px solid ${border}`,borderRadius:18,overflow:"hidden"}}><Header text="Metric" muted={muted} border={border}/><Header text="Versions" muted={muted} border={border}/><Header text="Change" muted={muted} border={border}/>{rows.map(([label,oldValue,newValue])=><div key={label} style={{display:"contents"}}><Cell label={label} value={String(oldValue)} border={border} text={muted}/><Cell label="" value={`${oldValue} → ${newValue}`} border={border} text={text}/><div style={{padding:14,borderTop:`1px solid ${border}`,borderLeft:`1px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Delta value={delta(newValue,oldValue)}/></div></div>)}</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}><KeywordBox title="Resolved gaps" items={resolvedKeywords} color="#15803d" dark={dark} empty="No missing keywords were resolved."/><KeywordBox title="New gaps" items={addedKeywords} color="#dc2626" dark={dark} empty="No new missing keywords appeared."/></div>
  <div style={{display:"flex",gap:8,alignItems:"center",marginTop:14,fontSize:12,color:muted}}><CalendarDays size={15}/> Comparing {fmt(older.createdAt)} with {fmt(newer.createdAt)}.</div>
 </section>;
}
function VersionSelect({label,value,options,onChange,dark}:{label:string;value:string;options:Analysis[];onChange:(v:string)=>void;dark:boolean}){return <label style={{display:"grid",gap:7,fontSize:12,fontWeight:700,color:dark?"#cbd5e1":"#475569"}}>{label}<select value={value} onChange={e=>onChange(e.target.value)} style={{padding:11,borderRadius:12,border:`1px solid ${dark?"#475569":"#d8dee9"}`,background:dark?"#020617":"#fff",color:dark?"#e5e7eb":"#0f172a",font:"inherit"}}>{options.map(x=><option key={x.id||x.analysisId} value={x.id||x.analysisId||""}>{x.jobTitle||x.resumeFileName||"Resume analysis"} · {fmt(x.createdAt)}</option>)}</select></label>}
function Header({text,muted,border}:{text:string;muted:string;border:string}){return <div style={{padding:13,fontSize:12,fontWeight:800,color:muted,borderBottom:`1px solid ${border}`}}>{text}</div>}
function Cell({label,value,border,text}:{label:string;value:string;border:string;text:string}){return <div style={{padding:14,borderTop:`1px solid ${border}`,color:text,fontSize:14}}>{label&&<div style={{fontSize:12,opacity:.7,marginBottom:4}}>{label}</div>}<strong>{value}</strong></div>}
function KeywordBox({title,items,color,dark,empty}:{title:string;items:string[];color:string;dark:boolean;empty:string}){return <div style={{padding:16,borderRadius:16,background:dark?"rgba(30,41,59,.55)":"#f8fafc"}}><strong style={{color}}>{title}</strong>{items.length?<div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:10}}>{items.slice(0,10).map((x,i)=><span key={`${x}-${i}`} style={{padding:"6px 9px",borderRadius:999,background:"rgba(255,255,255,.5)",fontSize:12}}>{x}</span>)}</div>:<p style={{fontSize:13,opacity:.65,marginBottom:0}}>{empty}</p>}</div>}
