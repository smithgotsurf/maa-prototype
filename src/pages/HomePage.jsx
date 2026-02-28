import { useNavigate } from 'react-router-dom';
import { B_URL, Ic, icons } from '../utils';
import { SEASON } from '../data';

export default function HomePage(){
  const navigate = useNavigate();
  return(<div><div className="hero" style={{backgroundImage:`linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${B_URL}static/field-1.jpg')`}}><h1><span className="g">M</span>eadow <span className="g">A</span>thletic <span className="g">A</span>ssociation</h1><p>Youth recreational sports for the Meadow community. Building character, teamwork, and lifelong memories.</p></div><div className="pg"><div className="sb"><div><h3>{SEASON.name}</h3><p>Registration open Jan 20 – Feb 28, 2026</p></div><button className="hcta" onClick={()=>navigate("/register")}>Register Now <Ic d={icons.chev} s={15}/></button></div><div className="sh"><h3>Available Programs</h3><p>{SEASON.programs.length} programs for ages 3–12</p></div><div className="pgrid">{[["Coed","Coed"],["Boys","Male"],["Girls","Female"]].map(([label,key])=>(<div key={label} className="pcol"><div className="pcol-h">{label}</div>{SEASON.programs.filter(p=>p.gender===key).map(p=>(<div className="pcard" key={p.id}><h4>{p.name}</h4><div className="pcard-m"><span className="pcard-a">Ages {p.min}–{p.max}</span><span className="pcard-f">${p.fee}</span></div></div>))}</div>))}</div></div></div>)
}
