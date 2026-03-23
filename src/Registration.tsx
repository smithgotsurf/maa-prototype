import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { SEASON, HATS, JERSEYS, COACH_SHIRTS, CURRENT_USER } from './data';
import { fullName, age, fmtDate, recommended, otherPrograms, calcTotal, Ic, icons } from './utils';
import { useAppContext } from './context/AppContext';
import type { Player, Program } from './types';
import './registration.css';

function AddModal({onAdd,onClose}:{onAdd:(p:Player)=>void;onClose:()=>void}){const[f,sF]=useState({fn:"",mn:"",ln:"",dob:"",g:""});const ok=f.fn&&f.ln&&f.dob&&f.g;return(<div className="mo" onClick={onClose}><div className="md" onClick={e=>e.stopPropagation()}><h3>Add Child</h3><div className="fc"><div className="fr"><label>First Name</label><input value={f.fn} onChange={e=>sF({...f,fn:e.target.value})}/></div><div className="fr"><label>Middle Name</label><input value={f.mn} onChange={e=>sF({...f,mn:e.target.value})}/></div></div><div className="fc"><div className="fr"><label>Last Name</label><input value={f.ln} onChange={e=>sF({...f,ln:e.target.value})}/></div><div className="fr"><label>Gender</label><select value={f.g} onChange={e=>sF({...f,g:e.target.value})}><option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option></select></div></div><div className="fr"><label>Date of Birth</label><input type="date" value={f.dob} onChange={e=>sF({...f,dob:e.target.value})}/></div><div className="br"><button className="b bgh" onClick={onClose}>Cancel</button><button className="b bg" disabled={!ok} onClick={()=>{onAdd({id:`p-${Date.now()}`,firstName:f.fn,middleName:f.mn,lastName:f.ln,dob:f.dob,gender:f.g as "Male"|"Female"});onClose()}}><Ic d={icons.plus} s={13}/> Add</button></div></div></div>)}

function ProgCard({p,pl,isRec,selected,onSelect}:{p:Program;pl:Player;isRec:boolean;selected:boolean;onSelect:(p:Program)=>void}){
  const ageText=p.ageAsOfDate?`${pl.firstName} is ${age(pl.dob,p.ageAsOfDate)} as of ${fmtDate(p.ageAsOfDate)}`:`${pl.firstName} is ${age(pl.dob,null)} years old`;
  const nameCell=<><h4>{p.name}{isRec&&<span className="opt-sg">Recommended</span>}{p.closed&&<span style={{marginLeft:6,fontSize:10,fontWeight:700,color:'#fff',background:'#c0392b',borderRadius:3,padding:'1px 5px',textTransform:'uppercase',letterSpacing:'.5px'}}>CLOSED</span>}</h4><p>Ages {p.min}–{p.max} · {ageText}</p></>;
  if(p.closed)return(<div className="opt" style={{opacity:.4,cursor:'not-allowed',pointerEvents:'none',position:'relative',overflow:'hidden'}}><div className="opt-i">{nameCell}</div><div className="opt-r"><span className="opt-f">${p.fee}</span><div className="opt-c"/></div><div style={{position:'absolute',top:14,right:-28,width:96,background:'#c0392b',color:'#fff',fontSize:10,fontWeight:800,textAlign:'center',padding:'4px 0',transform:'rotate(45deg)',letterSpacing:'1px',textTransform:'uppercase',boxShadow:'0 1px 3px rgba(0,0,0,.3)'}}>FULL</div></div>);
  return(<div className={`opt ${selected?"sl":""}`} onClick={()=>onSelect(p)}><div className="opt-i">{nameCell}</div><div className="opt-r"><span className="opt-f">${p.fee}</span><div className="opt-c">{selected&&<Ic d={icons.chk} s={12}/>}</div></div></div>);
}

export function RegPage(){
  const { players, addPlayer, addToCart, activeSeason } = useAppContext();
  const navigate = useNavigate();
  const[step,sStep]=useState(1);const[pl,sPl]=useState<Player|null>(null);const[pr,sPr]=useState<Program|null>(null);const[wv,sWv]=useState<Partial<Record<string,string>>>({});const[hat,sHat]=useState("");const[jer,sJer]=useState("");const[showAdd,sShowAdd]=useState(false);
  const[digitalPic,setDigitalPic]=useState(false);const[extraHat,setExtraHat]=useState(false);const[extraHatSize,setExtraHatSize]=useState("");const[coaching,setCoaching]=useState("");const[sponsorship,setSponsorship]=useState("");
  const[coachShirtSize,setCoachShirtSize]=useState("");const[sponsorName,setSponsorName]=useState("");const[activeWaiver,setActiveWaiver]=useState(0);
  const[hasMedical,setHasMedical]=useState("");const[allergies,setAllergies]=useState("");const[medicalInfo,setMedicalInfo]=useState("");
  const[gPri,setGPri]=useState({fn:CURRENT_USER.firstName,ln:CURRENT_USER.lastName,ph:CURRENT_USER.phone});
  const[gSec,setGSec]=useState({fn:CURRENT_USER.secondaryGuardian.firstName,ln:CURRENT_USER.secondaryGuardian.lastName,ph:CURRENT_USER.secondaryGuardian.phone});
  const[hasSec,setHasSec]=useState(true);
  const[priContact,setPriContact]=useState("");
  if (!activeSeason) return (
    <div className="pg"><div className="cd" style={{textAlign:"center",padding:32}}>
      <h2>Registration Not Open</h2>
      <p style={{color:'var(--gray)'}}>There is no active season at this time. Check back soon!</p>
    </div></div>
  );
  const rec=pl?recommended(pl,activeSeason.programs):[];const other=pl?otherPrograms(pl,activeSeason.programs):[];
  const applicableWaivers=SEASON.waivers.filter(w=>!w.coachOnly||coaching==="Coach"||coaching==="Assistant Coach");
  const wvOk=applicableWaivers.filter(w=>w.required).every(w=>wv[w.id]?.trim());const szOk=hat&&jer;
  const labels=["Player","Program","Guardian","Sizes","Interest","Medical","Waivers","Review"];
  function submit(){
    addToCart({
      id:`c-${Date.now()}`,
      player:pl!, program:pr!, hat, jersey:jer,
      guardian:{
        primary:{firstName:gPri.fn,lastName:gPri.ln,phone:gPri.ph},
        secondary:hasSec?{firstName:gSec.fn,lastName:gSec.ln,phone:gSec.ph}:null,
        primaryContactPhone:priContact==="primary"?gPri.ph:gSec.ph
      },
      digitalPicture:digitalPic,
      extraHat:extraHat?{size:extraHatSize}:null,
      coaching,
      coachShirtSize:(coaching==="Coach"||coaching==="Assistant Coach")?coachShirtSize:null,
      sponsorship,
      sponsorName:sponsorship==="Yes"?sponsorName:null,
      medical:hasMedical==="Yes"?{allergies:allergies||null,info:medicalInfo||null}:null,
      total:calcTotal(pr!,digitalPic,extraHat)
    });
    sStep(1);sPl(null);sPr(null);sWv({});sHat("");sJer("");setPriContact("");
    setDigitalPic(false);setExtraHat(false);setExtraHatSize("");setCoaching("");setSponsorship("");
    setCoachShirtSize("");setSponsorName("");setActiveWaiver(0);
    setHasMedical("");setAllergies("");setMedicalInfo("");
    navigate("/cart");
  }
  return(<div className="pg reg-pg">
    <div className="steps-m"><div className={`stn ${step>0?"on":""}`}>{step}</div><span>Step {step} of {labels.length} &mdash; {labels[step-1]}</span></div>
    <div className="reg-wrap">
      <aside className="steps-v">{labels.map((l,i)=>(<div key={i} className={`stv ${step===i+1?"on":step>i+1?"dn":""}`}><div className="stv-r"><div className="stn">{step>i+1?<Ic d={icons.chk} s={12}/>:i+1}</div>{i<labels.length-1&&<div className="stl-v"/>}</div><span>{l}</span></div>))}</aside>
      <div className="reg-ct">
    {pl&&step>1&&<h2 className="reg-for">Registering: {fullName(pl)} &ndash; Age: {age(pl.dob,null)}</h2>}
    {step===1&&<div className="cd"><h2>Select Player</h2><p className="cd-s">Choose which child to register for {activeSeason.name}.</p>
      {players.map(p=>(<div key={p.id} className={`opt ${pl?.id===p.id?"sl":""}`} onClick={()=>sPl(p)}><div className="opt-i"><h4>{fullName(p)}</h4><p>DOB: {fmtDate(p.dob)} · Age: {age(p.dob,null)} · {p.gender}</p></div><div className={`opt-c`}>{pl?.id===p.id&&<Ic d={icons.chk} s={12}/>}</div></div>))}
      <button className="b bs bsm" style={{marginTop:10}} onClick={()=>sShowAdd(true)}><Ic d={icons.plus} s={13}/> Add Child</button>
      <div className="br"><button className="b bp" disabled={!pl} onClick={()=>{sPr(null);sStep(2)}}>Continue <Ic d={icons.chev} s={13}/></button></div>
      {showAdd&&<AddModal onAdd={addPlayer} onClose={()=>sShowAdd(false)}/>}
    </div>}
    {step===2&&pl&&<div className="cd"><h2>Select Program</h2><p className="cd-s">Programs for {pl.firstName} ({pl.gender}).</p>
      {rec.length>0&&<><div style={{fontSize:11,fontWeight:600,color:'var(--grn)',textTransform:"uppercase",letterSpacing:".7px",marginBottom:6}}>Recommended for {pl.firstName}</div>
      {rec.map(p=>(<ProgCard key={p.id} p={p} pl={pl} isRec={true} selected={pr?.id===p.id} onSelect={sPr}/>))}</>}
      {other.length>0&&<><div style={{fontSize:11,fontWeight:600,color:'var(--gray)',textTransform:"uppercase",letterSpacing:".7px",marginTop:14,marginBottom:6}}>Other Programs</div>
      {other.map(p=>(<ProgCard key={p.id} p={p} pl={pl} isRec={false} selected={pr?.id===p.id} onSelect={sPr}/>))}</>}
      {activeSeason.programs.length===0&&<p style={{color:'var(--red)',padding:14}}>No programs available this season.</p>}
      <div className="br"><button className="b bgh" onClick={()=>sStep(1)}>Back</button><button className="b bp" disabled={!pr||!!pr.closed} onClick={()=>sStep(3)}>Continue <Ic d={icons.chev} s={13}/></button></div>
    </div>}
    {step===3&&<div className="cd">
      <h2>Parent/Guardian & Contact</h2>
      <p className="cd-s">Confirm contact information for this registration.</p>
      <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>Primary Guardian</div>
      <div className="fc">
        <div className="fr"><label>First Name</label><input value={gPri.fn} onChange={e=>setGPri({...gPri,fn:e.target.value})}/></div>
        <div className="fr"><label>Last Name</label><input value={gPri.ln} onChange={e=>setGPri({...gPri,ln:e.target.value})}/></div>
      </div>
      <div className="fr"><label>Phone</label><input value={gPri.ph} onChange={e=>setGPri({...gPri,ph:e.target.value})}/></div>
      <div style={{marginTop:16,marginBottom:8}}>
        <label className="wv-a" onClick={()=>setHasSec(!hasSec)}>
          <div className={`wck ${hasSec?"on":""}`}>{hasSec&&<Ic d={icons.chk} s={10}/>}</div>
          Add secondary guardian
        </label>
      </div>
      {hasSec&&<>
        <div className="fc">
          <div className="fr"><label>First Name</label><input value={gSec.fn} onChange={e=>setGSec({...gSec,fn:e.target.value})}/></div>
          <div className="fr"><label>Last Name</label><input value={gSec.ln} onChange={e=>setGSec({...gSec,ln:e.target.value})}/></div>
        </div>
        <div className="fr"><label>Phone</label><input value={gSec.ph} onChange={e=>setGSec({...gSec,ph:e.target.value})}/></div>
      </>}
      <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginTop:18,marginBottom:8}}>Primary Contact Phone</div>
      <div className={`opt ${priContact==="primary"?"sl":""}`} onClick={()=>setPriContact("primary")}>
        <div className="opt-i"><h4>{gPri.fn} {gPri.ln}</h4><p>{gPri.ph}</p></div>
        <div className={`opt-c`}>{priContact==="primary"&&<Ic d={icons.chk} s={12}/>}</div>
      </div>
      {hasSec&&gSec.fn&&<div className={`opt ${priContact==="secondary"?"sl":""}`} onClick={()=>setPriContact("secondary")}>
        <div className="opt-i"><h4>{gSec.fn} {gSec.ln}</h4><p>{gSec.ph}</p></div>
        <div className={`opt-c`}>{priContact==="secondary"&&<Ic d={icons.chk} s={12}/>}</div>
      </div>}
      <div className="br">
        <button className="b bgh" onClick={()=>sStep(2)}>Back</button>
        <button className="b bp" disabled={!gPri.fn||!gPri.ln||!gPri.ph||!priContact} onClick={()=>sStep(4)}>Continue <Ic d={icons.chev} s={13}/></button>
      </div>
    </div>}
    {step===4&&pl&&<div className="cd"><h2>Hat & Jersey Size</h2><p className="cd-s">Select {pl.firstName}'s sizing for this season.</p>
      <div className="szg">
        <div className="szg-l">Hat Size</div>
        <div className="szg-d">Fitted cap — included with registration</div>
        <div className="szp">{HATS.map(s=>(<button key={s} className={`sz ${hat===s?"sl":""}`} onClick={()=>sHat(s)}>{s}</button>))}</div>
      </div>
      <div className="szg">
        <div className="szg-l">Jersey Size</div>
        <div className="szg-d">Dri-Fit style game day jersey</div>
        <div className="szp">{JERSEYS.map(s=>(<button key={s} className={`sz ${jer===s?"sl":""}`} onClick={()=>sJer(s)}>{s}</button>))}</div>
      </div>
      <div>
        <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginBottom:10}}>Optional Add-ons</div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>Digital Picture Package — $10</div>
          <div style={{fontSize:12,color:'var(--gray)',marginBottom:6}}>Team and individual picture delivered via email</div>
          <div className="szp">
            <button className={`sz ${digitalPic===false?"sl":""}`} onClick={()=>setDigitalPic(false)}>No</button>
            <button className={`sz ${digitalPic===true?"sl":""}`} onClick={()=>setDigitalPic(true)}>Yes (+$10)</button>
          </div>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>Extra Hat — $30</div>
          <div style={{fontSize:12,color:'var(--gray)',marginBottom:6}}>Purchase one additional hat</div>
          <div className="szp">
            <button className={`sz ${extraHat===false?"sl":""}`} onClick={()=>{setExtraHat(false);setExtraHatSize("")}}>No</button>
            <button className={`sz ${extraHat===true?"sl":""}`} onClick={()=>setExtraHat(true)}>Yes (+$30)</button>
          </div>
          {extraHat&&<div className="szr" style={{marginTop:8}}><label>Extra Hat Size</label><div className="szp">{HATS.map(s=>(<button key={s} className={`sz ${extraHatSize===s?"sl":""}`} onClick={()=>setExtraHatSize(s)}>{s}</button>))}</div></div>}
        </div>
      </div>
      <div className="br"><button className="b bgh" onClick={()=>sStep(3)}>Back</button><button className="b bp" disabled={!szOk||(extraHat&&!extraHatSize)} onClick={()=>sStep(5)}>Continue <Ic d={icons.chev} s={13}/></button></div>
    </div>}
    {step===5&&<div className="cd"><h2>Coaching & Sponsorship</h2><p className="cd-s">Let us know if you're interested in helping out.</p>
      <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>Coaching Interest <span style={{color:'var(--red)',fontSize:10}}>Required</span></div>
      <div className={`opt ${coaching==="Coach"?"sl":""}`} onClick={()=>{setCoaching("Coach")}}><div className="opt-i"><h4>Coach</h4><p>Lead a team as head coach</p></div><div className={`opt-c`}>{coaching==="Coach"&&<Ic d={icons.chk} s={12}/>}</div></div>
      <div className={`opt ${coaching==="Assistant Coach"?"sl":""}`} onClick={()=>{setCoaching("Assistant Coach")}}><div className="opt-i"><h4>Assistant Coach</h4><p>Help out as an assistant</p></div><div className={`opt-c`}>{coaching==="Assistant Coach"&&<Ic d={icons.chk} s={12}/>}</div></div>
      <div className={`opt ${coaching==="Not Interested"?"sl":""}`} onClick={()=>{setCoaching("Not Interested");setCoachShirtSize("")}}><div className="opt-i"><h4>Not Interested</h4><p>Not at this time</p></div><div className={`opt-c`}>{coaching==="Not Interested"&&<Ic d={icons.chk} s={12}/>}</div></div>
      {(coaching==="Coach"||coaching==="Assistant Coach")&&<>
        <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginTop:18,marginBottom:8}}>Adult Shirt Size <span style={{color:'var(--red)',fontSize:10}}>Required</span></div>
        <div className="szp">{COACH_SHIRTS.map(s=>(<button key={s} className={`sz ${coachShirtSize===s?"sl":""}`} onClick={()=>setCoachShirtSize(s)}>{s}</button>))}</div>
      </>}
      <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginTop:18,marginBottom:8}}>Sponsorship Interest <span style={{color:'var(--red)',fontSize:10}}>Required</span></div>
      <div className={`opt ${sponsorship==="Yes"?"sl":""}`} onClick={()=>setSponsorship("Yes")}><div className="opt-i"><h4>Yes, I'm interested</h4><p>We'll send you sponsorship information</p></div><div className={`opt-c`}>{sponsorship==="Yes"&&<Ic d={icons.chk} s={12}/>}</div></div>
      <div className={`opt ${sponsorship==="No"?"sl":""}`} onClick={()=>{setSponsorship("No");setSponsorName("")}}><div className="opt-i"><h4>No thanks</h4></div><div className={`opt-c`}>{sponsorship==="No"&&<Ic d={icons.chk} s={12}/>}</div></div>
      {sponsorship==="Yes"&&<div className="fr" style={{marginTop:12}}><label>Sponsor / Business Name</label><input value={sponsorName} onChange={e=>setSponsorName(e.target.value)} placeholder="Enter business or sponsor name"/></div>}
      <div className="br"><button className="b bgh" onClick={()=>sStep(4)}>Back</button><button className="b bp" disabled={!coaching||!sponsorship||((coaching==="Coach"||coaching==="Assistant Coach")&&!coachShirtSize)||(sponsorship==="Yes"&&!sponsorName)} onClick={()=>sStep(6)}>Continue <Ic d={icons.chev} s={13}/></button></div>
    </div>}
    {step===6&&<div className="cd"><h2>Medical Information</h2><p className="cd-s">Let us know about any medical conditions or health concerns.</p>
      <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>Are there any medical conditions or health concerns (including allergies) we should be aware of? <span style={{color:'var(--red)',fontSize:10}}>Required</span></div>
      <div className={`opt ${hasMedical==="Yes"?"sl":""}`} onClick={()=>setHasMedical("Yes")}><div className="opt-i"><h4>Yes</h4></div><div className={`opt-c`}>{hasMedical==="Yes"&&<Ic d={icons.chk} s={12}/>}</div></div>
      <div className={`opt ${hasMedical==="No"?"sl":""}`} onClick={()=>{setHasMedical("No");setAllergies("");setMedicalInfo("")}}><div className="opt-i"><h4>No</h4></div><div className={`opt-c`}>{hasMedical==="No"&&<Ic d={icons.chk} s={12}/>}</div></div>
      {hasMedical==="Yes"&&<>
        <div className="fr" style={{marginTop:12}}><label>Allergies</label><input value={allergies} onChange={e=>setAllergies(e.target.value)} placeholder="List any allergies"/></div>
        <div className="fr" style={{marginTop:12}}><label>Any important medical information that we need to be made aware of</label><textarea value={medicalInfo} onChange={e=>setMedicalInfo(e.target.value)} placeholder="Describe any medical conditions or health concerns" rows={4}/></div>
      </>}
      <div className="br"><button className="b bgh" onClick={()=>sStep(5)}>Back</button><button className="b bp" disabled={!hasMedical||(hasMedical==="Yes"&&!allergies.trim()&&!medicalInfo.trim())} onClick={()=>{setActiveWaiver(0);sStep(7)}}>Continue <Ic d={icons.chev} s={13}/></button></div>
    </div>}
    {step===7&&<div className="cd"><h2>Waivers & Agreements</h2><p className="cd-s">Review and acknowledge the following.</p>
      {applicableWaivers.map((w,idx)=>{const firstId=applicableWaivers[0].id;const firstInit=wv[firstId]?.trim();return(<div className="wv" key={w.id}>
        <div className="wv-hd" onClick={()=>setActiveWaiver(activeWaiver===idx?-1:idx)}>
          <h4>{w.title}{w.required&&<span className="rq">Required</span>}</h4>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {wv[w.id]?.trim()&&<div className="wv-chk"><Ic d={icons.chk} s={10}/></div>}
            <span className="wv-chev">{activeWaiver===idx?"▾":"▸"}</span>
          </div>
        </div>
        {activeWaiver===idx&&<>
          <div className="wv-b" dangerouslySetInnerHTML={{__html:w.content}}/>
          <div className="wv-init"><span>Type your initials to acknowledge</span><input value={wv[w.id]||""} onChange={e=>sWv(p=>({...p,[w.id]:e.target.value}))}/>{idx>0&&firstInit&&!wv[w.id]?.trim()&&<button className="wv-copy" onClick={()=>sWv(p=>({...p,[w.id]:firstInit}))}>Copy initials</button>}</div>
        </>}
      </div>)})}
      <div className="br"><button className="b bgh" onClick={()=>sStep(6)}>Back</button><button className="b bp" disabled={!wvOk} onClick={()=>sStep(8)}>Continue <Ic d={icons.chev} s={13}/></button></div>
    </div>}
    {step===8&&<div className="cd"><h2>Review Registration</h2><p className="cd-s">Confirm details before adding to cart.</p>
  <table className="rt"><tbody>
    <tr><td>Player</td><td>{fullName(pl!)}</td></tr>
    <tr><td>Date of Birth</td><td>{fmtDate(pl!.dob)}</td></tr>
    <tr><td>Program</td><td>{pr!.name}</td></tr>
    <tr><td>Age</td><td>{age(pl!.dob,pr!.ageAsOfDate)} years old{pr!.ageAsOfDate?` (as of ${fmtDate(pr!.ageAsOfDate)})`:""}</td></tr>
    <tr><td>Primary Guardian</td><td>{gPri.fn} {gPri.ln} — {gPri.ph}</td></tr>
    {hasSec&&<tr><td>Secondary Guardian</td><td>{gSec.fn} {gSec.ln} — {gSec.ph}</td></tr>}
    <tr><td>Primary Contact</td><td>{priContact==="primary"?gPri.ph:gSec.ph}</td></tr>
    <tr><td>Hat Size</td><td>{hat}</td></tr>
    <tr><td>Jersey Size</td><td>{jer}</td></tr>
    <tr><td>Digital Picture</td><td>{digitalPic?"Yes (+$10)":"No"}</td></tr>
    <tr><td>Extra Hat</td><td>{extraHat?`${extraHatSize} (+$30)`:"No"}</td></tr>
    <tr><td>Coaching</td><td>{coaching}</td></tr>
    {(coaching==="Coach"||coaching==="Assistant Coach")&&<tr><td>Coach Shirt Size</td><td>{coachShirtSize}</td></tr>}
    <tr><td>Sponsorship</td><td>{sponsorship==="Yes"?"Yes":"No"}</td></tr>
    {sponsorship==="Yes"&&<tr><td>Sponsor Name</td><td>{sponsorName}</td></tr>}
    <tr><td>Medical Conditions</td><td>{hasMedical==="Yes"?"Yes":"No"}</td></tr>
    {hasMedical==="Yes"&&allergies&&<tr><td>Allergies</td><td>{allergies}</td></tr>}
    {hasMedical==="Yes"&&medicalInfo&&<tr><td>Medical Info</td><td>{medicalInfo}</td></tr>}
    <tr><td>Waivers</td><td>{applicableWaivers.map(w=>`${w.title} (${wv[w.id]})`).join(", ")}</td></tr>
  </tbody></table>
  <div style={{borderTop:'1px solid var(--bdr-lt)',marginTop:12,paddingTop:12}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span>Registration Fee</span><span>${pr!.fee}.00</span></div>
    {digitalPic&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4,color:'var(--gray)'}}><span>Digital Picture</span><span>+$10.00</span></div>}
    {extraHat&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4,color:'var(--gray)'}}><span>Extra Hat</span><span>+$30.00</span></div>}
    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,borderTop:'1px solid var(--bdr-lt)',paddingTop:8,marginTop:4}}><span>Total</span><span className="rf">${calcTotal(pr!,digitalPic,extraHat)}.00</span></div>
  </div>
  <div className="br"><button className="b bgh" onClick={()=>sStep(7)}>Back</button><button className="b bg" onClick={submit}><Ic d={icons.cart} s={14}/> Add to Cart</button></div>
</div>}
  </div></div></div>)}

export function CartPage(){
  const { cart, removeFromCart, clearCart } = useAppContext();
  const navigate = useNavigate();
  const total=cart.reduce((s,i)=>s+(i.total||i.program.fee),0);const[done,sDone]=useState(false);
  if(done)return(<div className="pg"><div className="cfm"><div className="cfm-ic"><Ic d={icons.chk} s={28}/></div><h2>Registration Submitted!</h2><p>Your registration has been submitted. Payment details will be communicated separately by the MAA board.</p><button className="b bp" style={{marginTop:20}} onClick={()=>{sDone(false);clearCart();navigate("/")}}>Return Home</button></div></div>);
  return(<div className="pg"><div className="pgn">
    <h2 style={{fontFamily:'var(--font-display)',fontSize:24,marginBottom:2}}>Your Cart</h2>
    <p style={{fontSize:13,color:'var(--gray)',marginBottom:18}}>{cart.length===0?"Your cart is empty.":`${cart.length} registration${cart.length!==1?"s":""} ready to submit.`}</p>
    {cart.map(i=>(<div className="ci" key={i.id}>
  <div className="ci-i">
    <h4>{fullName(i.player)}</h4>
    <p>{i.program.name} · Hat: {i.hat} · Jersey: {i.jersey}
      {i.digitalPicture&&" · Digital Pic"}
      {i.extraHat&&` · Extra Hat (${i.extraHat.size})`}
    </p>
  </div>
  <div className="ci-r">
    <span className="ci-f">${i.total||i.program.fee}.00</span>
    <button className="b bd bsm" onClick={()=>removeFromCart(i.id)}><Ic d={icons.trash} s={14}/></button>
  </div>
</div>))}
    {cart.length>0&&<><div className="ct"><span className="ct-l">Total Due</span><span className="ct-a">${total}.00</span></div><div className="br" style={{marginTop:16}}><button className="b bs" onClick={()=>navigate("/register")}>Register Another</button><button className="b bg" onClick={()=>sDone(true)}>Complete Registration</button></div></>}
    {cart.length===0&&<div style={{textAlign:"center",padding:32}}><button className="b bp" onClick={()=>navigate("/register")}>Start Registration</button></div>}
  </div></div>)}
