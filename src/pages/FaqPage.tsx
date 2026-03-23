import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_PATHS } from '../utils';

const Sh=({l,first}:{l:string;first?:boolean})=><div style={{fontWeight:700,color:'var(--gold-dk)',fontSize:18,textTransform:"uppercase",letterSpacing:".7px",marginTop:first?0:10,marginBottom:3}}>{l}</div>;

export default function FaqPage(){
  const navigate = useNavigate();
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
  const[open,setOpen]=useState<number|null>(null);
  return(<div className="pg cp"><h1>Frequently Asked Questions</h1><div className="gl"/>{faqs.map((f,i)=>(<div className="wv" key={i}><div className="wv-hd" onClick={()=>setOpen(open===i?null:i)}><h4 style={{fontWeight:600,fontSize:18}}>{f.q}</h4><span className="wv-chev">{open===i?"▾":"▸"}</span></div>{open===i&&<div className="wv-b faq-a">{f.a}{f.link&&<button className="b bgh bsm" style={{marginTop:8,display:"inline-flex"}} onClick={()=>navigate(PAGE_PATHS[f.link.p as keyof typeof PAGE_PATHS])}>{f.link.l} →</button>}</div>}</div>))}</div>)
}
