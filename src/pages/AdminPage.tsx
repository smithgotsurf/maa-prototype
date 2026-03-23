import { useState } from 'react';
import { Ic, icons, age } from '../utils';
import { HATS, JERSEYS, REGS, ADMIN_COLS, SPORT_TYPES } from '../data';
import { useAppContext } from '../context/AppContext';
import type { Season, Program, SportType } from '../types';

interface SeasonDetailProps {
  season: Season | null | undefined;
  sportTypes: SportType[];
  onSave: (data: Partial<Season>) => void;
  onCancel: () => void;
}

function SeasonDetail({ season, sportTypes, onSave, onCancel }: SeasonDetailProps) {
  const [name, setName] = useState(season?.name || "");
  const [desc, setDesc] = useState(season?.description || "");
  const [programs, setPrograms] = useState<Program[]>(season?.programs ? season.programs.map(p=>({...p})) : []);

  const addProgram = () => {
    setPrograms(prev => [...prev, {
      id: `pg-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      name: "", gender: "Coed", ageAsOfDate: null, min: 3, max: 4, fee: 65, closed: false
    }]);
  };

  const updateProgram = (id: string, field: string, value: string | number | boolean | null) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProgram = (id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const applyDefaults = (id: string, sportName: string) => {
    const type = sportTypes.find((t: SportType) => t.name === sportName);
    if (type) {
      setPrograms(prev => prev.map(p => p.id === id
        ? { ...p, name: sportName, gender: type.gender, min: type.min, max: type.max, fee: type.fee }
        : p
      ));
    } else {
      updateProgram(id, "name", sportName);
    }
  };

  const handleSave = () => {
    onSave({ name, description: desc, programs });
  };

  return (
    <>
      <button className="b bgh" onClick={onCancel} style={{marginBottom:14}}>
        ← Back to Seasons
      </button>
      <div className="amh">
        <h1>{season ? "Edit Season" : "New Season"}</h1>
      </div>
      <div className="cd" style={{marginBottom:16}}>
        <div className="fr"><label>Season Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 2026 Fall Sports"/>
        </div>
        <div className="fr"><label>Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
            placeholder="e.g. Registration open through Aug 15, 2026"/>
        </div>
      </div>
      <div className="cd">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px"}}>
            Programs ({programs.length})
          </div>
          <button className="b bs bsm" onClick={addProgram}><Ic d={icons.plus} s={11}/> Add Program</button>
        </div>
        {programs.length === 0 && (
          <p style={{color:'var(--gray)',fontSize:13,textAlign:"center",padding:16}}>
            No programs yet. Click "Add Program" to get started.
          </p>
        )}
        {programs.length > 0 && (
          <table className="dt">
            <thead><tr>
              <th>Sport</th><th>Gender</th><th>Ages</th><th>Age As Of</th><th>Fee</th><th>Closed</th><th></th>
            </tr></thead>
            <tbody>{programs.map(p => (
              <tr key={p.id}>
                <td>
                  <select className="fsl" value={p.name} onChange={e => applyDefaults(p.id, e.target.value)}>
                    <option value="">Select sport...</option>
                    {sportTypes.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </td>
                <td>
                  <select className="fsl" value={p.gender} onChange={e => updateProgram(p.id, "gender", e.target.value)}>
                    <option>Coed</option><option>Male</option><option>Female</option>
                  </select>
                </td>
                <td>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    <input type="number" className="fin" style={{width:50}} value={p.min} onChange={e => updateProgram(p.id, "min", +e.target.value)}/>
                    <span>–</span>
                    <input type="number" className="fin" style={{width:50}} value={p.max} onChange={e => updateProgram(p.id, "max", +e.target.value)}/>
                  </div>
                </td>
                <td>
                  <input type="date" className="fin" style={{width:130}} value={p.ageAsOfDate || ""} onChange={e => updateProgram(p.id, "ageAsOfDate", e.target.value || null)}/>
                </td>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:2}}>
                    <span style={{fontSize:12,color:'var(--gray)'}}>$</span>
                    <input type="number" className="fin" style={{width:60}} value={p.fee} onChange={e => updateProgram(p.id, "fee", +e.target.value)}/>
                  </div>
                </td>
                <td style={{textAlign:"center"}}>
                  <input type="checkbox" checked={!!p.closed} onChange={e => updateProgram(p.id, "closed", e.target.checked)} style={{accentColor:'var(--gold)'}}/>
                </td>
                <td>
                  <button className="b bd bsm" onClick={() => removeProgram(p.id)}><Ic d={icons.trash} s={13}/></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
        <button className="b bgh" onClick={onCancel}>Cancel</button>
        <button className="b bg" disabled={!name.trim()} onClick={handleSave}>Save Season</button>
      </div>
    </>
  );
}

export default function AdminPage(){
  const[tab,sTab]=useState("dash");const[sf,sSf]=useState("All");const[stf,sStf]=useState("All");const[q,sQ]=useState("");
  const[visCols,setVisCols]=useState(()=>ADMIN_COLS.filter(c=>c.default).map(c=>c.id));
  const[showColPicker,setShowColPicker]=useState(false);
  const[showEquipModal,setShowEquipModal]=useState(false);
  const { seasons, activeSeason, addSeason, updateSeason, deleteSeason, activateSeason, deactivateSeason } = useAppContext();
  const [seasonView, setSeasonView] = useState<"list"|"edit"|"new">("list");
  const [editSeasonId, setEditSeasonId] = useState<string|null>(null);
  const filt=REGS.filter(r=>{if(sf!=="All"&&r.program!==sf)return false;if(stf!=="All"&&r.status!==stf)return false;if(q&&!r.player.toLowerCase().includes(q.toLowerCase())&&!r.parent.toLowerCase().includes(q.toLowerCase()))return false;return true});
  const totalRev=REGS.reduce((s,r)=>s+r.total,0);
  const progCounts: Record<string,number>={};(activeSeason?.programs||[]).forEach(p=>{progCounts[p.name]=REGS.filter(r=>r.program===p.name).length});
  const hatCounts: Record<string,number>={};REGS.forEach(r=>{hatCounts[r.hat]=(hatCounts[r.hat]||0)+1});
  const jerseyCounts: Record<string,number>={};REGS.forEach(r=>{jerseyCounts[r.jersey]=(jerseyCounts[r.jersey]||0)+1});
  const toggleCol=(id: string)=>setVisCols(v=>v.includes(id)?v.filter(c=>c!==id):[...v,id]);
  const vis=(id: string)=>visCols.includes(id);
  return(<div className="adm"><aside className="asd"><div className="asd-l">Management</div>
    {[{id:"dash",ic:icons.clip,l:"Registrations"},{id:"seasons",ic:icons.gear,l:"Seasons"},{id:"users",ic:icons.users,l:"Users"}].map(i=>(<button key={i.id} className={`asd-i ${tab===i.id?"on":""}`} onClick={()=>sTab(i.id)}><Ic d={i.ic} s={15}/>{i.l}</button>))}
  </aside><main className="am">
    {tab==="dash"&&<><div className="amh"><h1>Registration Dashboard</h1><button className="b bs bsm"><Ic d={icons.dl} s={13}/> Export CSV</button></div>
      <div className="sts">
        <div className="stt" style={{borderLeft:'3px solid var(--gold)'}}><div className="stt-l">Total</div><div className="stt-v gd">{REGS.length}</div><div className="stt-s">all programs</div></div>
        {(activeSeason?.programs||[]).map(p=>(<div className="stt" key={p.id}><div className="stt-l">{p.name}</div><div className="stt-v">{progCounts[p.name]}</div><div className="stt-s">registered</div></div>))}
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
    {tab==="seasons"&&<>{seasonView==="list"?<>
  <div className="amh"><h1>Season Management</h1>
    <button className="b bp bsm" onClick={()=>{setEditSeasonId(null);setSeasonView("new")}}>
      <Ic d={icons.plus} s={13}/> New Season
    </button>
  </div>

  {activeSeason ? (
    <div className="sn-active">
      <div className="sn-active-hd">
        <div>
          <h2 style={{marginBottom:0}}>{activeSeason.name}</h2>
          {activeSeason.description && <p style={{fontSize:12,color:'var(--gray)',marginTop:2}}>{activeSeason.description}</p>}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span className="bdg bdg-ok">Active</span>
          <button className="b bs bsm" onClick={()=>{setEditSeasonId(activeSeason.id);setSeasonView("edit")}}>Edit</button>
          <button className="b bs bsm" onClick={()=>deactivateSeason(activeSeason.id)}>Deactivate</button>
        </div>
      </div>
      <p style={{fontSize:13,marginTop:10}}>
        <strong>{activeSeason.programs.length}</strong> programs
      </p>
    </div>
  ) : (
    <div className="sn-none">No active season. Activate a season from the table below.</div>
  )}

  <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginTop:20,marginBottom:8}}>All Seasons</div>
  <table className="dt">
    <thead><tr>
      <th>Name</th><th>Description</th><th>Programs</th><th>Status</th><th>Actions</th>
    </tr></thead>
    <tbody>{seasons.map(s=>(
      <tr key={s.id}>
        <td style={{fontWeight:600}}>{s.name}</td>
        <td style={{fontSize:11,color:'var(--gray)',maxWidth:200}}>{s.description||"—"}</td>
        <td>{s.programs.length} programs</td>
        <td><span className={`bdg ${s.status==="active"?"bdg-ok":"bdg-in"}`}>{s.status==="active"?"Active":"Inactive"}</span></td>
        <td>
          <div style={{display:"flex",gap:4}}>
            {s.status!=="active"&&<button className="b bs bsm" onClick={()=>activateSeason(s.id)}>Activate</button>}
            <button className="b bs bsm" onClick={()=>{setEditSeasonId(s.id);setSeasonView("edit")}}>Edit</button>
            <button className="b bs bsm" onClick={()=>{
              const clone: Season={...s,id:`s-${Date.now()}`,name:`${s.name} (Copy)`,status:"inactive" as const,
                programs:s.programs.map(p=>({...p,id:`pg-${Date.now()}-${Math.random().toString(36).slice(2,6)}`}))};
              addSeason(clone);
              setEditSeasonId(clone.id);
              setSeasonView("edit");
            }}>Clone</button>
            <button className="b bd bsm" onClick={()=>{if(confirm(`Delete "${s.name}"?`))deleteSeason(s.id)}}>Delete</button>
          </div>
        </td>
      </tr>
    ))}</tbody>
  </table>
</>:<SeasonDetail
  season={seasonView==="edit" ? seasons.find(s=>s.id===editSeasonId) : null}
  sportTypes={SPORT_TYPES}
  onSave={(data) => {
    if (seasonView==="edit") {
      updateSeason(editSeasonId!, data);
    } else {
      addSeason({ ...data, id: `s-${Date.now()}`, status: "inactive" as const } as Season);
    }
    setSeasonView("list");
  }}
  onCancel={() => setSeasonView("list")}
/>}
</>}
    {tab==="users"&&<><div className="amh"><h1>User Management</h1></div><p style={{color:'var(--gray)'}}>Assign Admin and Registrar roles here. Coming soon.</p></>}
  </main></div>)}
