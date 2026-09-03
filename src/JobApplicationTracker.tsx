import { useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarDays, CheckCircle2, CirclePlus, Trash2 } from "lucide-react";

type Status="Applied"|"Interview"|"Offer"|"Rejected";
type Application={id:string;company:string;role:string;status:Status;date:string;notes:string};
const KEY="resumeiq_job_applications";
const STATUSES:Status[]=["Applied","Interview","Offer","Rejected"];
function load():Application[]{try{const value=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(value)?value:[]}catch{return []}}

export default function JobApplicationTracker({dark=false}:{dark?:boolean}){
 const [applications,setApplications]=useState<Application[]>(load);
 const [company,setCompany]=useState("");const [role,setRole]=useState("");const [status,setStatus]=useState<Status>("Applied");const [date,setDate]=useState(new Date().toISOString().slice(0,10));const [notes,setNotes]=useState("");
 const text=dark?"#e5e7eb":"#0f172a",muted=dark?"#94a3b8":"#64748b",border=dark?"#334155":"#e2e8f0",bg=dark?"rgba(15,23,42,.86)":"#fff";
 const save=(items:Application[])=>{setApplications(items);localStorage.setItem(KEY,JSON.stringify(items));};
 const add=()=>{if(!company.trim()||!role.trim())return;const item:Application={id:crypto.randomUUID(),company:company.trim(),role:role.trim(),status,date,notes:notes.trim()};save([item,...applications]);setCompany("");setRole("");setStatus("Applied");setDate(new Date().toISOString().slice(0,10));setNotes("");};
 const stats=useMemo(()=>STATUSES.map(s=>({status:s,count:applications.filter(a=>a.status===s).length})),[applications]);
 return <section style={{padding:24,borderRadius:24,border:`1px solid ${border}`,background:bg,boxShadow:"0 18px 50px rgba(15,23,42,.06)"}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"center",flexWrap:"wrap"}}><div><div style={{display:"flex",alignItems:"center",gap:8,color:"#7c3aed"}}><BriefcaseBusiness size={20}/><strong>Job application tracker</strong></div><p style={{margin:"7px 0 0",color:muted}}>Keep your applications, interviews, offers, and follow-ups organized.</p></div></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginTop:16}}>{stats.map(x=><div key={x.status} style={{padding:13,borderRadius:15,background:dark?"rgba(30,41,59,.55)":"#f8fafc"}}><div style={{fontSize:12,color:muted}}>{x.status}</div><strong style={{fontSize:24,color:text}}>{x.count}</strong></div>)}</div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,marginTop:16}}><Field placeholder="Company" value={company} onChange={setCompany} dark={dark}/><Field placeholder="Role" value={role} onChange={setRole} dark={dark}/><select value={status} onChange={e=>setStatus(e.target.value as Status)} style={input(dark)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={input(dark)}/><input placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} style={{...input(dark),gridColumn:"1/-1"}}/></div>
  <button onClick={add} style={{marginTop:11,border:0,borderRadius:11,background:"linear-gradient(135deg,#7c3aed,#2563eb)",color:"white",padding:"11px 15px",cursor:"pointer",fontWeight:800,display:"inline-flex",alignItems:"center",gap:7}}><CirclePlus size={16}/>Add application</button>
  <div style={{display:"grid",gap:9,marginTop:18}}>{applications.length?applications.map(a=><article key={a.id} style={{padding:15,border:`1px solid ${border}`,borderRadius:16,display:"grid",gridTemplateColumns:"1fr auto",gap:10}}><div><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><strong style={{color:text}}>{a.role}</strong><span style={{padding:"4px 8px",borderRadius:999,background:"rgba(124,58,237,.1)",color:"#7c3aed",fontSize:11,fontWeight:800}}>{a.status}</span></div><div style={{fontSize:13,color:muted,marginTop:3}}>{a.company} · {a.date}</div>{a.notes&&<p style={{fontSize:13,color:text,lineHeight:1.5,marginBottom:0}}>{a.notes}</p>}</div><button aria-label={`Delete ${a.company} ${a.role}`} onClick={()=>save(applications.filter(x=>x.id!==a.id))} style={{alignSelf:"start",border:`1px solid ${border}`,borderRadius:10,background:bg,color:muted,padding:8,cursor:"pointer"}}><Trash2 size={15}/></button></article>):<div style={{padding:24,textAlign:"center",color:muted}}>No applications yet. Add your first opportunity above.</div>}</div>
  <div style={{display:"flex",alignItems:"center",gap:7,marginTop:12,fontSize:12,color:muted}}><CalendarDays size={14}/>Stored locally in this browser.</div>
 </section>;
}
function Field({placeholder,value,onChange,dark}:{placeholder:string;value:string;onChange:(v:string)=>void;dark:boolean}){return <input placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} style={input(dark)}/>}
const input=(dark:boolean):React.CSSProperties=>({width:"100%",boxSizing:"border-box",padding:11,border:`1px solid ${dark?"#475569":"#cbd5e1"}`,borderRadius:11,background:dark?"#020617":"#fff",color:dark?"#e5e7eb":"#0f172a",font:"inherit"});
