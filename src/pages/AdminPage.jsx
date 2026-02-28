import { useState } from 'react';
import { Ic, icons, age } from '../utils';
import { SEASON, HATS, JERSEYS, REGS, ADMIN_COLS } from '../data';

export default function AdminPage(){
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
