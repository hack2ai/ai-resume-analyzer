import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Search, Tags, XCircle } from "lucide-react";

type Props={missingKeywords:string[];matchedKeywords?:string[];dark?:boolean};
const normalize=(value:string)=>value.trim().toLowerCase();
const priority=(keyword:string)=>keyword.length>=12?"High":keyword.length>=7?"Medium":"Standard";

export default function KeywordInsights({missingKeywords,matchedKeywords=[],dark=false}:Props){
 const[query,setQuery]=useState("");const[copied,setCopied]=useState(false);
 const missing=useMemo(()=>Array.from(new Set(missingKeywords.map(x=>x.trim()).filter(Boolean))),[missingKeywords]);
 const matched=useMemo(()=>Array.from(new Set(matchedKeywords.map(x=>x.trim()).filter(Boolean))),[matchedKeywords]);
 const filtered=missing.filter(k=>normalize(k).includes(normalize(query)));
 const copy=async()=>{await navigator.clipboard?.writeText(missing.join(", "));setCopied(true);setTimeout(()=>setCopied(false),1800)};
 const bg=dark?"#0f172a":"#fff";const border=dark?"#334155":"#e2e8f0";const muted=dark?"#94a3b8":"#64748b";
 return <section style={{background:bg,border:`1px solid ${border}`,borderRadius:24,padding:22,boxShadow:"0 18px 50px rgba(15,23,42,.06)",marginTop:18}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>
   <div><div style={{display:"flex",alignItems:"center",gap:8,color:"#7c3aed"}}><Tags size={20}/><strong>Keyword Insights</strong></div><p style={{margin:"7px 0 0",color:muted}}>Prioritize the terms most likely to improve resume alignment.</p></div>
   <button onClick={copy} disabled={!missing.length} style={{border:0,borderRadius:12,padding:"10px 13px",cursor:missing.length?"pointer":"not-allowed",background:"#7c3aed",color:"white",fontWeight:700,display:"inline-flex",alignItems:"center",gap:7}}><Copy size={16}/>{copied?"Copied":"Copy missing keywords"}</button>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginTop:18}}>
   <Stat label="Missing" value={missing.length} icon={<XCircle size={17}/>}/><Stat label="Matched" value={matched.length} icon={<CheckCircle2 size={17}/>}/><Stat label="Coverage" value={`${Math.round((matched.length/(matched.length+missing.length||1))*100)}%`} icon={<Tags size={17}/>}/>
  </div>
  <div style={{position:"relative",marginTop:18}}><Search size={17} style={{position:"absolute",left:13,top:13,color:muted}}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search missing keywords..." style={{width:"100%",boxSizing:"border-box",padding:"12px 12px 12px 39px",borderRadius:12,border:`1px solid ${border}`,background:dark?"#020617":"#f8fafc",color:dark?"#e5e7eb":"#0f172a",font:"inherit"}}/></div>
  <div style={{display:"grid",gap:9,marginTop:14}}>{filtered.map(keyword=><div key={keyword} style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",padding:"12px 13px",borderRadius:14,border:`1px solid ${border}`,background:dark?"rgba(30,41,59,.55)":"#fff"}}><div><strong>{keyword}</strong><div style={{fontSize:12,color:muted,marginTop:3}}>Add naturally to relevant skills, projects, or experience.</div></div><span style={{fontSize:12,fontWeight:800,padding:"5px 9px",borderRadius:999,background:priority(keyword)==="High"?"rgba(239,68,68,.12)":"rgba(245,158,11,.12)",color:priority(keyword)==="High"?"#dc2626":"#d97706"}}>{priority(keyword)} priority</span></div>)}{!filtered.length&&<div style={{textAlign:"center",padding:24,color:muted}}>No matching keyword gaps found.</div>}</div>
 </section>;
}
function Stat({label,value,icon}:{label:string;value:string|number;icon:React.ReactNode}){return <div style={{padding:14,borderRadius:16,background:"rgba(124,58,237,.08)"}}><div style={{display:"flex",alignItems:"center",gap:6,color:"#7c3aed",fontSize:13}}>{icon}{label}</div><strong style={{fontSize:26,display:"block",marginTop:7}}>{value}</strong></div>}
