import { useNavigate } from 'react-router-dom';
import { B_URL, Ic, icons } from '../utils';
import { useAppContext } from '../context/AppContext';

const SPORTS = [
  { label: 'Spring', items: [
    { name: 'T-Ball', ages: ['3–4'] },
    { name: 'T-Shirt', ages: ['5–6'] },
    { name: 'Baseball', ages: ['8U', '10U', '12U'] },
    { name: 'Softball', ages: ['8U', '10U', '12U'] },
  ]},
  { label: 'Fall', items: [
    { name: 'Soccer', ages: ['6U', '8U'] },
    { name: 'Baseball', ages: ['8U', '10U', '12U'] },
    { name: 'Softball', ages: ['8U', '10U', '12U'] },
  ]},
  { label: 'Winter', items: [
    { name: 'Basketball', ages: ['6U', '8U', '10U', '12U', '15U'] },
    { name: 'Volleyball', ages: ['8U', '10U', '12U'] },
  ]},
];

export default function HomePage(){
  const navigate = useNavigate();
  const { activeSeason } = useAppContext();
  const minAge = activeSeason ? Math.min(...activeSeason.programs.map(p=>p.min)) : null;
  const maxAge = activeSeason ? Math.max(...activeSeason.programs.map(p=>p.max)) : null;
  return(<div><div className="hero" style={{backgroundImage:`linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${B_URL}static/field-1.jpg')`}}><h1><span className="g">M</span>eadow <span className="g">A</span>thletic <span className="g">A</span>ssociation</h1><p>Youth recreational sports for the Meadow community. Building character, teamwork, and lifelong memories.</p></div><div className="pg">{activeSeason ? (<><div className="sb"><div><h3>{activeSeason.name}</h3><p>{activeSeason.description}</p></div><button className="hcta" onClick={()=>navigate("/register")}>Register Now <Ic d={icons.chev} s={15}/></button></div><div className="sh"><h3>Available Programs</h3><p>{activeSeason.programs.length} programs for ages {minAge}–{maxAge}</p></div><div className="pgrid">{[["Coed","Coed"],["Boys","Male"],["Girls","Female"]].map(([label,key])=>(<div key={label} className="pcol"><div className="pcol-h">{label}</div>{activeSeason.programs.filter(p=>p.gender===key).map(p=>(<div className={`pcard${p.closed?" closed":""}`} key={p.id}><div className="pcard-m"><h4>{p.name}</h4>{p.closed&&<span className="pcard-cl">Closed</span>}</div><span className="pcard-a">Ages {p.min}–{p.max}</span></div>))}</div>))}</div></>) : (<><div className="sb"><div><h3>Registration</h3><p>Check back soon for upcoming registration information.</p></div></div><div className="sh"><h3>What We Offer</h3><p>Youth sports across three seasons</p></div><div className="pgrid">{SPORTS.map(s=>(<div key={s.label} className="pcol"><div className="pcol-h">{s.label}</div>{s.items.map(i=>(<div className="pcard" key={i.name}><h4>{i.name}</h4><ul className="pcard-ages">{i.ages.map(a=>(<li key={a}>{a}</li>))}</ul></div>))}</div>))}</div></>)}</div></div>)
}
