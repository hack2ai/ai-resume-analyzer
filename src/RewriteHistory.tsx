import { Clock3, Copy, CheckCircle2, History, Trash2 } from "lucide-react";

type RewriteItem={id:string;section:string;targetRole:string;originalText:string;rewrittenText:string;createdAt?:string};
type Props={items:RewriteItem[];onRestore:(item:RewriteItem)=>void;onClear?:()=>void};

export default function RewriteHistory({items,onRestore,onClear}:Props){
 const copy=async(text:string)=>{await navigator.clipboard?.writeText(text)};
 if(!items.length)return null;
 return <section style={{marginTop:18,border:"1px solid #e2e8f0",borderRadius:24,padding:22,background:"white",boxShadow:"0 16px 42px rgba(15,23,42,.05)"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:38,height:38,borderRadius:12,display:"grid",placeItems:"center",background:"#f3e8ff",color:"#7c3aed"}}><History size={19}/></div><div><strong>Rewrite history</strong><div style={{fontSize:13,opacity:.55}}>Restore or reuse recent AI improvements.</div></div></div>{onClear&&<button onClick={onClear} style={{border:"1px solid #fecaca",background:"#fff",color:"#dc2626",padding:"8px 10px",borderRadius:10,cursor:"pointer",display:"inline-flex",gap:6,alignItems:"center"}}><Trash2 size={15}/>Clear history</button>}</div>
  <div style={{display:"grid",gap:10,marginTop:16}}>{items.slice(0,6).map(item=><div key={item.id} style={{padding:14,border:"1px solid #e2e8f0",borderRadius:16,display:"flex",justifyContent:"space-between",gap:14,alignItems:"center",flexWrap:"wrap"}}><div style={{minWidth:0}}><strong style={{textTransform:"capitalize"}}>{item.section} · {item.targetRole}</strong><div style={{fontSize:12,opacity:.55,display:"flex",gap:5,alignItems:"center",marginTop:4}}><Clock3 size={13}/>{item.createdAt?new Date(item.createdAt).toLocaleString():"Just now"}</div><div style={{fontSize:13,opacity:.65,marginTop:7,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:520}}>{item.rewrittenText}</div></div><div style={{display:"flex",gap:8}}><button onClick={()=>copy(item.rewrittenText)} style={button}><Copy size={15}/>Copy</button><button onClick={()=>onRestore(item)} style={{...button,borderColor:"#c4b5fd",color:"#6d28d9"}}><CheckCircle2 size={15}/>Restore</button></div></div>)}</div>
 </section>;
}
const button:React.CSSProperties={border:"1px solid #d8dee9",background:"white",padding:"8px 10px",borderRadius:10,cursor:"pointer",display:"inline-flex",gap:6,alignItems:"center",fontWeight:700};
