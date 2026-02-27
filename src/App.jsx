import { useState } from "react";
import './app.css';
import { RegPage, CartPage } from './Registration';
import { SEASON, HATS, JERSEYS, INIT_PLAYERS, REGS, ADMIN_COLS } from './data';

export const B_URL = import.meta.env.BASE_URL;

function ld(s){const[y,m,d]=s.split('-');return new Date(y,m-1,d)}
export function age(dob,asOf){const d=ld(dob);const c=asOf?ld(asOf):new Date();let a=c.getFullYear()-d.getFullYear();if(d.getMonth()>c.getMonth()||(d.getMonth()===c.getMonth()&&d.getDate()>c.getDate()))a--;return a}
export function fmtDate(s){return ld(s).toLocaleDateString()}
export function recommended(p,progs){return progs.filter(pr=>{const a2=age(p.dob,pr.ageAsOfDate);return a2>=pr.min&&a2<=pr.max&&(pr.gender==="Coed"||pr.gender===p.gender)})}
export function otherPrograms(p,progs){const rec=recommended(p,progs);return progs.filter(pr=>!rec.find(r=>r.id===pr.id))}
export function fullName(p){return[p.firstName,p.middleName,p.lastName].filter(Boolean).join(' ')}
export function calcTotal(pr,digitalPic,extraHat){let total=pr.fee;if(digitalPic)total+=10;if(extraHat)total+=30;return total}

export const Ic=({d,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:d}}/>;
export const icons={
  ball:'<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93c4.08 2.38 6.2 6.76 6.2 6.76s.86 4.56-1.14 8.38"/><path d="M19.07 4.93c-4.08 2.38-6.2 6.76-6.2 6.76s-.86 4.56 1.14 8.38"/>',
  home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  clip:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>',
  cart:'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  chk:'<polyline points="20 6 9 17 4 12"/>',
  chev:'<polyline points="9 18 15 12 9 6"/>',
  dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  map:'<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  fb:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  mail:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.35 1.61.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.2.35 2 .57 2.81.7A2 2 0 0 1 22 16.92z"/>',
};

// ─── Pages ───
function HomePage({go}){return(<div><div className="hero" style={{backgroundImage:`linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${B_URL}static/field-1.jpg')`}}><h1><span className="g">M</span>eadow <span className="g">A</span>thletic <span className="g">A</span>ssociation</h1><p>Youth recreational sports for the Meadow community. Building character, teamwork, and lifelong memories.</p></div><div className="pg"><div className="sb"><div><h3>{SEASON.name}</h3><p>Registration open Jan 20 – Feb 28, 2026</p></div><button className="hcta" onClick={()=>go("register")}>Register Now <Ic d={icons.chev} s={15}/></button></div><div className="sh"><h3>Available Programs</h3><p>{SEASON.programs.length} programs for ages 3–12</p></div><div className="pgrid">{[["Coed","Coed"],["Boys","Male"],["Girls","Female"]].map(([label,key])=>(<div key={label} className="pcol"><div className="pcol-h">{label}</div>{SEASON.programs.filter(p=>p.gender===key).map(p=>(<div className="pcard" key={p.id}><h4>{p.name}</h4><div className="pcard-m"><span className="pcard-a">Ages {p.min}–{p.max}</span><span className="pcard-f">${p.fee}</span></div></div>))}</div>))}</div></div></div>)}

function AboutPage(){const board=[{n:"Karla Parnell",r:"President"},{n:"Justin Massengill",r:"Vice President"},{n:"Parker Johnson",r:"Secretary"},{n:"Tiffany Adams",r:"Treasurer"}];const members=["Blake Adams","David Allen","Johnathan Barefoot","Waylon Dale Barefoot","Drew Boyd","Alex Dunn","Craig Hardin","Anthony Harrington","Chris Hudson","Chris Johnson","Thomas Johnson","Justin Knight","Johnathan Lee","Michael Poe","Samantha Poe","Josh Smith","Keith Wall","Brandon Williams"];return(<div className="pg cp"><h1>About the Meadow Athletic Association</h1><div className="gl"/><p>We are a multiple sport athletic association, serving the Meadow community. We are a non-profit organization and a part of our area since 1976. We are run by all volunteers, currently consisting of 21 members and a Treasurer.</p><h2>Our Board</h2><p>MAA is governed by a volunteer board of directors elected by the membership.</p><div className="bgrd">{board.map(b=>(<div className="bcrd" key={b.n}><div className="bcrd-av"><Ic d={icons.user} s={22}/></div><h4>{b.n}</h4><p>{b.r}</p></div>))}</div><h2>Members</h2><div className="mem-list">{members.map(m=>(<span key={m} className="mem">{m}</span>))}</div><h2>Contact</h2><div className="ic-grid"><div className="ic" style={{margin:0}}><h3>Get in Touch</h3><p style={{display:"flex",alignItems:"center",gap:6}}><Ic d={icons.mail} s={14}/>meadowathleticassociation@gmail.com</p></div><div className="ic" style={{margin:0}}><h3>Follow Us</h3><a href="https://www.facebook.com/groups/169287900378142" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,color:"#1877F2",fontWeight:600,fontSize:14,textDecoration:"none"}}><Ic d={icons.fb} s={16}/>Join us on Facebook</a></div></div></div>)}

function FieldsPage(){return(<div className="pg cp"><h1>Field Rentals</h1><div className="gl"/><p>MAA has two fields available for rental when not in use for games or practices.</p><div style={{borderRadius:10,overflow:"hidden",margin:"16px 0",border:'1px solid var(--bdr-lt)',position:"relative"}}><img src={B_URL+"static/fields-aerial.jpg"} alt="Aerial view of MAA fields" style={{width:"100%",display:"block",maxHeight:420,objectFit:"cover",objectPosition:"center"}}/><div style={{position:"absolute",left:"38%",top:"49%",transform:"translate(-50%,-50%)",background:"rgba(0,0,0,.68)",color:"#fff",padding:"5px 14px",borderRadius:6,fontFamily:'var(--font-body)',fontWeight:700,fontSize:13,letterSpacing:".5px",border:'1px solid var(--gold)',pointerEvents:"none"}}>Field 1</div><div style={{position:"absolute",left:"61%",top:"76%",transform:"translate(-50%,-50%)",background:"rgba(0,0,0,.68)",color:"#fff",padding:"5px 14px",borderRadius:6,fontFamily:'var(--font-body)',fontWeight:700,fontSize:13,letterSpacing:".5px",border:'1px solid var(--gold)',pointerEvents:"none"}}>Field 2</div></div><div className="ic-grid"><div className="ic" style={{margin:0}}><h3>MAA Field 1</h3><p>Supports T-Ball, T-Shirt, 8U, 10U, and 12U baseball and softball.</p></div><div className="ic" style={{margin:0}}><h3>MAA Field 2</h3><p>Supports T-Ball, T-Shirt, 8U and 10U baseball, and 8U, 10U, and 12U softball.</p></div></div><h2>Rental Rates</h2><div className="rate-grid"><div style={{background:"#fff",border:'1px solid var(--bdr-lt)',borderRadius:8,padding:16,textAlign:"center"}}><div style={{fontSize:12,color:'var(--gray)',fontWeight:600,marginBottom:4}}>Without Lights</div><div style={{fontFamily:'var(--font-display)',fontSize:26,color:'var(--gold-dk)'}}>$15<span style={{fontSize:14,fontWeight:400}}>/hr</span></div></div><div style={{background:"#fff",border:'1px solid var(--bdr-lt)',borderRadius:8,padding:16,textAlign:"center"}}><div style={{fontSize:12,color:'var(--gray)',fontWeight:600,marginBottom:4}}>With Lights</div><div style={{fontFamily:'var(--font-display)',fontSize:26,color:'var(--gold-dk)'}}>$35<span style={{fontSize:14,fontWeight:400}}>/hr</span></div><div style={{fontSize:11,color:'var(--gray-lt)',marginTop:2}}>+$20/hr for lights</div></div></div><p style={{marginTop:12,fontSize:13,color:'var(--gray)'}}>Example: 1 hr without lights + 1 hr with lights = $15 + $35 = $50</p><p style={{marginTop:16,fontSize:13,color:'var(--gray)'}}>To reserve, contact meadowathleticassociation@gmail.com.</p></div>)}

function SponsorsPage(){return(<div className="pg cp"><h1>Become a Sponsor</h1><div className="gl"/><p>MAA relies on local businesses and families to keep registration fees affordable and our fields well-maintained. There are several ways to get involved.</p><div className="spt"><div className="spc" style={{borderColor:'var(--gold)'}}><Ic d={icons.star} s={24} style={{color:'var(--gold)',margin:"0 auto 6px",display:"block"}}/><h3>Field Banner</h3><div style={{display:"flex",gap:16,justifyContent:"center",alignItems:"flex-end",margin:"8px 0 4px"}}><div style={{textAlign:"center"}}><div className="pr" style={{margin:0}}>$175<span style={{fontSize:16,fontWeight:600}}>/yr</span></div><div style={{fontSize:11,color:'var(--gray)',marginTop:2}}>for 3 years</div></div><div style={{color:'var(--gray-lt)',fontSize:13,paddingBottom:18}}>or</div><div style={{textAlign:"center"}}><div className="pr" style={{margin:0}}>$500</div><div style={{fontSize:11,color:'var(--gray)',marginTop:2}}>one-time</div></div></div><ul style={{marginTop:10,marginBottom:0}}><li>Two banners — one on an MAA field, one on a school field</li><li>Seen by players, families &amp; fans all season</li><li>Covers three full seasons</li></ul><a href={B_URL+"static/sponsorship-form.pdf"} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:14,color:'var(--gold-dk)',fontWeight:600,fontSize:13,textDecoration:"none"}}><Ic d={icons.dl} s={13}/> Download Sponsorship Form</a></div><div className="spc" style={{borderColor:'var(--gold)'}}><Ic d={icons.heart} s={24} style={{color:'var(--gold)',margin:"0 auto 6px",display:"block"}}/><h3>Team Sponsor</h3><div className="pr">$250</div><div style={{fontSize:12,color:'var(--gray)',marginBottom:10}}>per team · per season</div><ul><li>Sponsor a specific team for one season</li><li>Sponsor name on team jersey</li><li>Available for any sport or age group</li></ul><div style={{fontSize:14,color:'var(--gray)',marginTop:20,lineHeight:1.5}}>Let us know during player registration.</div></div><div className="spc" style={{borderColor:'var(--gold)'}}><Ic d={icons.mail} s={24} style={{color:'var(--gold)',margin:"0 auto 6px",display:"block"}}/><h3>Custom Opportunity</h3><div className="pr">Let's Talk</div><div style={{fontSize:12,color:'var(--gray)',marginBottom:10}}>we'll work with you</div><ul><li>Event sponsorship</li><li>Equipment donation</li><li>Other creative partnerships</li></ul><div style={{fontSize:14,color:'var(--gray)',marginTop:20,lineHeight:1.5}}>Have another idea? We'd love to hear it.</div><a href="mailto:meadowathleticassociation@gmail.com" style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:14,color:'var(--gold-dk)',fontWeight:600,fontSize:13,textDecoration:"none"}}><Ic d={icons.mail} s={13}/> Contact Us</a></div></div><p style={{marginTop:20,fontSize:13,color:'var(--gray)'}}>To get started, contact us at meadowathleticassociation@gmail.com.</p></div>)}

function FaqPage({go}){
  const Sh=({l,first})=><div style={{fontWeight:700,color:'var(--gold-dk)',fontSize:18,textTransform:"uppercase",letterSpacing:".7px",marginTop:first?0:10,marginBottom:3}}>{l}</div>;
  const faqs=[
    {q:"What sports does MAA typically offer?",a:<><Sh l="Spring" first/><ul style={{paddingLeft:16,marginTop:3,lineHeight:1.9}}><li>T-Ball (Coed, ages 3–4)</li><li>T-Shirt (Coed, ages 5–6)</li><li>Baseball (8U, 10U, 12U — boys)</li><li>Softball (8U, 10U, 12U — girls)</li></ul><Sh l="Fall"/><ul style={{paddingLeft:16,marginTop:3,lineHeight:1.9}}><li>Soccer (6U Coed, 8U Boys, 8U Girls)</li><li>Baseball (8U, 10U, 12U — boys)</li><li>Softball (8U, 10U, 12U — girls)</li></ul><Sh l="Winter"/><ul style={{paddingLeft:16,marginTop:3,lineHeight:1.9}}><li>Basketball (6U Coed, 8U/10U/12U/15U boys, 8U/10U/12U girls)</li><li>Volleyball (8U, 10U, 12U)</li></ul></>},
    {q:"When does registration open?",a:<><Sh l="Spring" first/>Typically opens mid-January and runs through February.<Sh l="Fall"/>Opens early July through early August.<Sh l="Winter"/>Opens early October through early November.<div style={{marginTop:6,fontSize:11,color:'var(--gray)'}}>Deadlines may close earlier if an age group fills.</div></>},
    {q:"When does each season start?",a:<><Sh l="Spring" first/>Practices begin in March; games start in April.<Sh l="Fall"/>Practices begin in late August; games start mid-September.<Sh l="Winter"/>Practices begin in early December; games start in early January.</>},
    {q:"When do practices start?",a:<><Sh l="Spring" first/>Baseball, softball, T-Ball, and T-Shirt practices begin in March.<Sh l="Fall"/>Soccer practices begin in late August.<Sh l="Winter"/>Volleyball practices begin in early December.</>},
    {q:"When are games scheduled?",a:<><Sh l="Spring" first/>Baseball and softball games are mostly Monday, Tuesday, and Thursday evenings. T-Ball games start at 6:30 PM; T-Shirt games start at 7:15–7:30 PM.<Sh l="Fall"/>Soccer games are mostly Monday, Tuesday, and Thursday.<Sh l="Winter"/>Volleyball games are mostly Saturday with some Tuesday and Thursday.</>},
    {q:"How do I volunteer to coach?",a:"Indicate your interest during registration. The board will follow up with details before the season starts."},
    {q:"How do coaches communicate with families?",a:"Coaches coordinate with families via group text message."},
    {q:"How do I become a sponsor?",a:"MAA offers field banner sponsorships and per-team seasonal sponsorships.",link:{l:"View sponsorship options",p:"sponsors"}},
    {q:"Is MAA a non-profit?",a:"Yes. MAA has been a volunteer-run, non-profit organization serving the Meadow community since 1976, governed by 21 members and a Treasurer.",link:{l:"Learn more about MAA",p:"about"}}
  ];
  const[open,setOpen]=useState(null);
  return(<div className="pg cp"><h1>Frequently Asked Questions</h1><div className="gl"/>{faqs.map((f,i)=>(<div className="wv" key={i}><div className="wv-hd" onClick={()=>setOpen(open===i?null:i)}><h4 style={{fontWeight:600,fontSize:18}}>{f.q}</h4><span className="wv-chev">{open===i?"▾":"▸"}</span></div>{open===i&&<div className="wv-b faq-a">{f.a}{f.link&&<button className="b bgh bsm" style={{marginTop:8,display:"inline-flex"}} onClick={()=>go(f.link.p)}>{f.link.l} →</button>}</div>}</div>))}</div>)}


function AdminPage(){
  const[tab,sTab]=useState("dash");const[sf,sSf]=useState("All");const[stf,sStf]=useState("All");const[q,sQ]=useState("");
  const[visCols,setVisCols]=useState(()=>ADMIN_COLS.filter(c=>c.default).map(c=>c.id));
  const[showColPicker,setShowColPicker]=useState(false);
  const[showEquipModal,setShowEquipModal]=useState(false);
  const filt=REGS.filter(r=>{if(sf!=="All"&&r.program!==sf)return false;if(stf!=="All"&&r.status!==stf)return false;if(q&&!r.player.toLowerCase().includes(q.toLowerCase())&&!r.parent.toLowerCase().includes(q.toLowerCase()))return false;return true});
  const totalRev=REGS.reduce((s,r)=>s+r.total,0);
  const progCounts={};SEASON.programs.forEach(p=>{progCounts[p.name]=REGS.filter(r=>r.program===p.name).length});
  const hatCounts={};REGS.forEach(r=>{hatCounts[r.hat]=(hatCounts[r.hat]||0)+1});
  const jerseyCounts={};REGS.forEach(r=>{jerseyCounts[r.jersey]=(jerseyCounts[r.jersey]||0)+1});
  const toggleCol=id=>setVisCols(v=>v.includes(id)?v.filter(c=>c!==id):[...v,id]);
  const vis=id=>visCols.includes(id);
  return(<div className="adm"><aside className="asd"><div className="asd-l">Management</div>
    {[{id:"dash",ic:icons.clip,l:"Registrations"},{id:"seasons",ic:icons.gear,l:"Seasons"},{id:"users",ic:icons.users,l:"Users"}].map(i=>(<button key={i.id} className={`asd-i ${tab===i.id?"on":""}`} onClick={()=>sTab(i.id)}><Ic d={i.ic} s={15}/>{i.l}</button>))}
  </aside><main className="am">
    {tab==="dash"&&<><div className="amh"><h1>Registration Dashboard</h1><button className="b bs bsm"><Ic d={icons.dl} s={13}/> Export CSV</button></div>
      <div className="sts">
        <div className="stt" style={{borderLeft:'3px solid var(--gold)'}}><div className="stt-l">Total</div><div className="stt-v gd">{REGS.length}</div><div className="stt-s">all programs</div></div>
        {SEASON.programs.map(p=>(<div className="stt" key={p.id}><div className="stt-l">{p.name}</div><div className="stt-v">{progCounts[p.name]}</div><div className="stt-s">registered</div></div>))}
        <div className="stt" style={{borderLeft:'3px solid var(--grn)'}}><div className="stt-l">Revenue</div><div className="stt-v gd">${totalRev.toLocaleString()}</div><div className="stt-s">collected</div></div>
      </div>
      <div style={{marginBottom:14}}><button className="b bs bsm" onClick={()=>setShowEquipModal(true)}>Equipment Summary</button></div>
      <div className="flt"><select className="fsl" value={sf} onChange={e=>sSf(e.target.value)}><option>All</option>{[...new Set(REGS.map(r=>r.program))].map(s=><option key={s}>{s}</option>)}</select>
      <select className="fsl" value={stf} onChange={e=>sStf(e.target.value)}><option>All</option><option>Completed</option><option>Pending</option></select>
      <input className="fin" placeholder="Search player or parent..." value={q} onChange={e=>sQ(e.target.value)}/>
      <div style={{position:"relative",marginLeft:"auto"}}><button className="b bs bsm" onClick={()=>setShowColPicker(!showColPicker)}>Columns</button>
        {showColPicker&&<div className="col-picker">{ADMIN_COLS.map(c=>(<label key={c.id} className="col-picker-item"><input type="checkbox" checked={visCols.includes(c.id)} onChange={()=>toggleCol(c.id)}/>{c.label}</label>))}</div>}
      </div></div>
      <table className="dt"><thead><tr>{vis("player")&&<th>Player</th>}{vis("gender")&&<th>Gender</th>}{vis("age")&&<th>Age</th>}{vis("program")&&<th>Program</th>}{vis("parent")&&<th>Parent/Guardian</th>}{vis("hat")&&<th>Hat</th>}{vis("jersey")&&<th>Jersey</th>}{vis("pic")&&<th>Pic</th>}{vis("extraHat")&&<th>Extra Hat</th>}{vis("coaching")&&<th>Coaching</th>}{vis("status")&&<th>Status</th>}{vis("primaryContact")&&<th>Primary Contact</th>}{vis("sponsorship")&&<th>Sponsorship</th>}{vis("total")&&<th>Total</th>}{vis("date")&&<th>Date</th>}</tr></thead>
      <tbody>{filt.map(r=>(<tr key={r.id}>{vis("player")&&<td style={{fontWeight:600}}>{r.player}</td>}{vis("gender")&&<td>{r.gender}</td>}{vis("age")&&<td>{age(r.dob,null)}</td>}{vis("program")&&<td><span className="btag">{r.program}</span></td>}{vis("parent")&&<td>{r.parent}</td>}{vis("hat")&&<td>{r.hat}</td>}{vis("jersey")&&<td>{r.jersey}</td>}{vis("pic")&&<td>{r.digitalPic?"✓":"—"}</td>}{vis("extraHat")&&<td>{r.extraHat||"—"}</td>}{vis("coaching")&&<td style={{fontSize:11}}>{r.coaching}</td>}{vis("status")&&<td><span className={`bdg ${r.status==="Completed"?"bdg-ok":"bdg-pn"}`}>{r.status}</span></td>}{vis("primaryContact")&&<td style={{fontSize:11}}>{r.primaryContact}</td>}{vis("sponsorship")&&<td>{r.sponsorship}</td>}{vis("total")&&<td style={{fontWeight:600,color:'var(--gold-dk)'}}>${r.total}</td>}{vis("date")&&<td style={{color:'var(--gray-lt)',fontSize:11}}>{r.date}</td>}</tr>))}</tbody></table>
      <p style={{fontSize:11,color:'var(--gray-lt)',marginTop:8,textAlign:"right"}}>{filt.length} of {REGS.length}</p>
      {showEquipModal&&<div className="mo" onClick={()=>setShowEquipModal(false)}><div className="md" onClick={e=>e.stopPropagation()} style={{width:480}}>
        <h3>Equipment Summary</h3>
        <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>Hat Sizes</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>{HATS.map(h=>(<div key={h} style={{background:'var(--off)',borderRadius:6,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:11,color:'var(--gray)',fontWeight:600}}>{h}</div><div style={{fontFamily:'var(--font-display)',fontSize:22,marginTop:2}}>{hatCounts[h]||0}</div></div>))}</div>
        <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>Jersey Sizes</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{JERSEYS.map(j=>(<div key={j} style={{background:'var(--off)',borderRadius:6,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:10,color:'var(--gray)',fontWeight:600}}>{j}</div><div style={{fontFamily:'var(--font-display)',fontSize:22,marginTop:2}}>{jerseyCounts[j]||0}</div></div>))}</div>
        <div className="br" style={{marginTop:18}}><button className="b bs" onClick={()=>setShowEquipModal(false)}>Close</button></div>
      </div></div>}
    </>}
    {tab==="seasons"&&<><div className="amh"><h1>Season Management</h1><button className="b bp bsm"><Ic d={icons.plus} s={13}/> New Season</button></div>
      <div className="cd"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h2 style={{marginBottom:0}}>{SEASON.name}</h2><p style={{fontSize:12,color:'var(--gray)',marginTop:2}}>Registration: Jan 20 – Feb 28, 2026</p></div><div style={{display:"flex",gap:6,alignItems:"center"}}><span className="sbb">Active</span><button className="b bs bsm">Edit</button><button className="b bs bsm">Clone</button></div></div><p style={{fontSize:13,marginTop:10}}><strong>{SEASON.programs.length}</strong> programs · <strong>{SEASON.waivers.length}</strong> waivers · <strong>{REGS.length}</strong> registrations</p></div></>}
    {tab==="users"&&<><div className="amh"><h1>User Management</h1></div><p style={{color:'var(--gray)'}}>Assign Admin and Registrar roles here. Coming soon.</p></>}
  </main></div>)}

// ─── App Shell ───
export default function App(){
  const[pg,sPg]=useState("home");const[cart,sCart]=useState([]);const[players,sPlayers]=useState(INIT_PLAYERS);const[menuOpen,setMenuOpen]=useState(false);
  const add=i=>sCart(p=>[...p,i]);const rm=id=>sCart(p=>p.filter(i=>i.id!==id));const clr=()=>sCart([]);const addP=p=>sPlayers(prev=>[...prev,p]);
  const nav=[{id:"about",ic:icons.info,l:"About"},{id:"faq",ic:icons.help,l:"FAQ"},{id:"fields",ic:icons.map,l:"Field Rentals"},{id:"sponsors",ic:icons.star,l:"Sponsorship"},{id:"register",ic:icons.clip,l:"Register"},...(cart.length?[{id:"cart",ic:icons.cart,l:"Cart",badge:cart.length}]:[]),{id:"admin",ic:icons.gear,l:"Admin"}];
  return(<div>
    <header className="H"><div className="H-logo" onClick={()=>sPg("home")}><img src={B_URL+"static/maa-large.jpg"} alt="MAA" style={{height:30,width:"auto",borderRadius:3}}/><span className="g">MAA</span><span className="H-full"> Meadow Athletic Association</span></div>
    <nav className="H-nav">{nav.map(n=>(<button key={n.id} className={pg===n.id?"on":""} onClick={()=>sPg(n.id)}><Ic d={n.ic} s={14}/>{n.l}{n.badge>0&&<span className="hbadge">{n.badge}</span>}</button>))}<button><Ic d={icons.user} s={14}/>Sarah C.</button></nav>
    <button className="H-ham" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menu"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button></header>
    {menuOpen&&<div className="H-mob-overlay" onClick={()=>setMenuOpen(false)}/>}
    <nav className={`H-mob${menuOpen?" open":""}`}>{nav.map(n=>(<button key={n.id} className={pg===n.id?"on":""} onClick={()=>{sPg(n.id);setMenuOpen(false)}}><Ic d={n.ic} s={16}/>{n.l}{n.badge>0&&<span className="hbadge">{n.badge}</span>}</button>))}<button onClick={()=>setMenuOpen(false)}><Ic d={icons.user} s={16}/>Sarah C.</button></nav>
    {pg==="home"&&<HomePage go={sPg}/>}
    {pg==="about"&&<AboutPage/>}
    {pg==="faq"&&<FaqPage go={sPg}/>}
    {pg==="fields"&&<FieldsPage/>}
    {pg==="sponsors"&&<SponsorsPage/>}
    {pg==="register"&&<RegPage players={players} addPlayer={addP} addToCart={add} go={sPg}/>}
    {pg==="cart"&&<CartPage cart={cart} remove={rm} clear={clr} go={sPg}/>}
    {pg==="admin"&&<AdminPage/>}
  </div>)}
