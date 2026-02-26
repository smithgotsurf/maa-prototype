import { useState } from "react";

// Theme: Vegas Gold / Black / White
const C = { gold:"#C5A04E", goldDk:"#A68636", goldLt:"#D4B86A", goldPale:"#F5EDD5", goldFaint:"#FBF7EC", blk:"#1A1A1A", blkSoft:"#2D2D2D", char:"#404040", gray:"#6B6B6B", grayLt:"#9A9A9A", bdr:"#E0E0E0", bdrLt:"#EEEEEE", wht:"#FFFFFF", off:"#FAFAF8", bg:"#F5F4F0", red:"#C23B22", redBg:"#FCECEA", grn:"#2E7D4F", grnBg:"#E8F5E9" };
const F = { d:"'Playfair Display',Georgia,serif", b:"'Source Sans 3',-apple-system,sans-serif" };
const B_URL = import.meta.env.BASE_URL;

// Mock data
const SEASON = {
  name:"2026 Spring Sports", programs:[
    {id:"pg1",name:"T-Ball",gender:"Coed",cutoff:null,min:3,max:4,fee:65},
    {id:"pg2",name:"T-Shirt",gender:"Coed",cutoff:null,min:5,max:6,fee:65},
    {id:"pg3",name:"8U Baseball",gender:"Male",cutoff:"2026-05-01",min:7,max:8,fee:80},
    {id:"pg4",name:"10U Baseball",gender:"Male",cutoff:"2026-05-01",min:9,max:10,fee:80},
    {id:"pg5",name:"12U Baseball",gender:"Male",cutoff:"2026-05-01",min:11,max:12,fee:80},
    {id:"pg6",name:"8U Softball",gender:"Female",cutoff:"2026-01-01",min:7,max:8,fee:80},
    {id:"pg7",name:"10U Softball",gender:"Female",cutoff:"2026-01-01",min:9,max:10,fee:80},
    {id:"pg8",name:"12U Softball",gender:"Female",cutoff:"2026-01-01",min:11,max:12,fee:80},
  ],
  waivers:[
    {id:"w1",title:"Liability Waiver",content:"By registering your child for MAA programs, you acknowledge that participation in recreational sports involves inherent risks of physical injury. You release MAA, its board members, coaches, volunteers, and sponsors from any claims arising from participation.",required:true},
    {id:"w2",title:"Code of Conduct",content:"All parents, guardians, players, and spectators must demonstrate good sportsmanship at all times. Abusive language, unsportsmanlike behavior, or harassment will not be tolerated and may result in suspension from the program.",required:true},
    {id:"w3",title:"Coaches Code of Conduct",content:"As a volunteer coach or assistant coach for MAA, you agree to prioritize the safety, well-being, and development of all players. You will promote good sportsmanship, treat all participants with respect, follow MAA guidelines and rules, attend required training sessions, and submit to any background check requirements. Violation of this code may result in removal from coaching duties.",required:true,coachOnly:true},
  ]
};
const HATS = ["XS/SM","SM/M","L/XL"];
const JERSEYS = ["Youth S","Youth M","Youth L","Youth XL","Adult S","Adult M","Adult L","Adult XL"];
const COACH_SHIRTS = ["Adult S","Adult M","Adult L","Adult XL","Adult 2XL","Adult 3XL"];
const INIT_PLAYERS = [
  {id:"p1",firstName:"Ethan",middleName:"James",lastName:"Carter",dob:"2016-06-15",gender:"Male"},
  {id:"p2",firstName:"Lily",middleName:"",lastName:"Carter",dob:"2018-03-22",gender:"Female"},
  {id:"p3",firstName:"Owen",middleName:"Michael",lastName:"Carter",dob:"2022-01-10",gender:"Male"},
];
const CURRENT_USER = {
  firstName: "Sarah", lastName: "Carter", phone: "(555) 867-5309",
  secondaryGuardian: { firstName: "John", lastName: "Carter", phone: "(555) 555-1234" }
};
const REGS = [
  {id:"r1",player:"Ethan Carter",program:"10U Baseball",parent:"Sarah Carter",email:"sarah@email.com",fee:80,status:"Completed",date:"2026-02-10 2:30 PM",hat:"L/XL",jersey:"Youth L",digitalPic:true,extraHat:null,coaching:"Not Interested",sponsorship:"No",total:90},
  {id:"r2",player:"Lily Carter",program:"8U Softball",parent:"Sarah Carter",email:"sarah@email.com",fee:80,status:"Completed",date:"2026-02-10 3:15 PM",hat:"XS/SM",jersey:"Youth M",digitalPic:false,extraHat:"SM/M",coaching:"Not Interested",sponsorship:"No",total:110},
  {id:"r3",player:"Mason Brooks",program:"12U Baseball",parent:"Tom Brooks",email:"tom@email.com",fee:80,status:"Pending",date:"2026-02-11 9:45 AM",hat:"L/XL",jersey:"Youth XL",digitalPic:true,extraHat:"L/XL",coaching:"Coach",sponsorship:"Yes",total:120},
  {id:"r4",player:"Ava Brooks",program:"10U Softball",parent:"Tom Brooks",email:"tom@email.com",fee:80,status:"Completed",date:"2026-02-11 10:20 AM",hat:"SM/M",jersey:"Youth M",digitalPic:true,extraHat:null,coaching:"Assistant Coach",sponsorship:"No",total:90},
  {id:"r5",player:"Noah Kim",program:"T-Ball",parent:"Grace Kim",email:"grace@email.com",fee:65,status:"Completed",date:"2026-02-12 1:00 PM",hat:"XS/SM",jersey:"Youth S",digitalPic:false,extraHat:null,coaching:"Not Interested",sponsorship:"No",total:65},
  {id:"r6",player:"Emma Davis",program:"T-Shirt",parent:"Mike Davis",email:"mike@email.com",fee:65,status:"Pending",date:"2026-02-13 11:30 AM",hat:"XS/SM",jersey:"Youth S",digitalPic:true,extraHat:null,coaching:"Not Interested",sponsorship:"Yes",total:75},
  {id:"r7",player:"Liam Johnson",program:"8U Baseball",parent:"Amy Johnson",email:"amy@email.com",fee:80,status:"Completed",date:"2026-02-13 4:05 PM",hat:"SM/M",jersey:"Youth M",digitalPic:false,extraHat:null,coaching:"Coach",sponsorship:"No",total:80},
  {id:"r8",player:"Sophie Turner",program:"12U Softball",parent:"Jane Turner",email:"jane@email.com",fee:80,status:"Completed",date:"2026-02-14 8:50 AM",hat:"L/XL",jersey:"Youth L",digitalPic:true,extraHat:"L/XL",coaching:"Not Interested",sponsorship:"No",total:120},
  {id:"r9",player:"Jake Miller",program:"8U Baseball",parent:"Chris Miller",email:"chris@email.com",fee:80,status:"Completed",date:"2026-02-14 2:10 PM",hat:"XS/SM",jersey:"Youth S",digitalPic:false,extraHat:null,coaching:"Assistant Coach",sponsorship:"Yes",total:80},
  {id:"r10",player:"Mia Wilson",program:"T-Ball",parent:"Dan Wilson",email:"dan@email.com",fee:65,status:"Completed",date:"2026-02-15 12:30 PM",hat:"SM/M",jersey:"Youth S",digitalPic:true,extraHat:"XS/SM",coaching:"Not Interested",sponsorship:"No",total:105},
];

function age(dob,cutoff){const d=new Date(dob);const c=cutoff?new Date(cutoff):new Date();let a=c.getFullYear()-d.getFullYear();if(d.getMonth()>c.getMonth()||(d.getMonth()===c.getMonth()&&d.getDate()>c.getDate()))a--;return a}
function recommended(p,progs){return progs.filter(pr=>{const a2=age(p.dob,pr.cutoff);return a2>=pr.min&&a2<=pr.max&&(pr.gender==="Coed"||pr.gender===p.gender)})}
function otherPrograms(p,progs){const rec=recommended(p,progs);return progs.filter(pr=>!rec.find(r=>r.id===pr.id))}
function fullName(p){return[p.firstName,p.middleName,p.lastName].filter(Boolean).join(' ')}
function calcTotal(pr,digitalPic,extraHat){let total=pr.fee;if(digitalPic)total+=10;if(extraHat)total+=30;return total}

const Ic=({d,s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:d}}/>;
const icons={
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

const css = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{font-family:${F.b};color:${C.blk};background:${C.bg};-webkit-font-smoothing:antialiased}
.H{background:${C.blk};color:#fff;padding:0 28px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.H-logo{font-family:${F.d};font-size:19px;display:flex;align-items:center;gap:8px;cursor:pointer}.H-logo .g{color:${C.gold}}
.H-nav{display:flex;gap:1px}.H-nav button{background:none;border:none;color:rgba(255,255,255,.5);font-family:${F.b};font-size:14px;font-weight:500;padding:7px 12px;border-radius:7px;cursor:pointer;transition:.15s;display:flex;align-items:center;gap:5px}
.H-nav button:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.8)}.H-nav button.on{background:rgba(197,160,78,.15);color:${C.gold}}
.hbadge{background:${C.gold};color:${C.blk};font-size:10px;font-weight:700;padding:1px 6px;border-radius:9px}
.pg{max-width:1080px;margin:0 auto;padding:28px 20px}.pgn{max-width:680px;margin:0 auto}
.hero{background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.68)),url('${B_URL}static/home-top-background.jpg') center/cover no-repeat;color:#fff;padding:64px 28px 88px;text-align:center;position:relative;overflow:hidden}
.hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.gold},transparent)}
.hero h1{font-family:${F.d};font-size:42px;font-weight:700;margin-bottom:6px}.hero h1 .g{color:${C.gold}}
.hero p{font-size:16px;opacity:.55;max-width:440px;margin:0 auto 32px;line-height:1.6}
.hcta{display:inline-flex;align-items:center;gap:7px;background:${C.gold};color:${C.blk};border:none;padding:13px 28px;font-family:${F.b};font-size:15px;font-weight:600;border-radius:7px;cursor:pointer;transition:.2s}
.hcta:hover{background:${C.goldLt};transform:translateY(-1px);box-shadow:0 4px 16px rgba(197,160,78,.3)}
.sb{background:#fff;border:1px solid ${C.bdrLt};border-radius:12px;padding:20px 24px;margin:-44px auto 24px;max-width:600px;position:relative;z-index:10;box-shadow:0 3px 20px rgba(0,0,0,.05);display:flex;align-items:center;justify-content:space-between}
.sb h3{font-family:${F.d};font-size:17px}.sb p{font-size:13px;color:${C.gray};margin-top:2px}
.sbb{background:${C.goldFaint};color:${C.goldDk};font-size:11px;font-weight:600;padding:4px 12px;border-radius:16px;border:1px solid ${C.goldPale}}
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin-top:16px}
.pcard{background:#fff;border:1px solid ${C.bdrLt};border-radius:10px;padding:18px;transition:.15s}.pcard:hover{border-color:${C.gold}}
.pcard-l{font-size:10px;color:${C.gray};text-transform:uppercase;letter-spacing:.7px;font-weight:600}
.pcard h4{font-family:${F.d};font-size:16px;margin:2px 0 6px}.pcard-m{display:flex;justify-content:space-between;align-items:center}
.pcard-a{font-size:11px;color:${C.gray};background:${C.off};padding:2px 7px;border-radius:3px}.pcard-f{font-size:13px;font-weight:700;color:${C.goldDk}}
.sh h3{font-family:${F.d};font-size:20px}.sh p{font-size:13px;color:${C.gray};margin-top:2px}
.steps{display:flex;align-items:center;justify-content:center;margin-bottom:28px}
.st{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;color:${C.grayLt}}.st.on{color:${C.blk}}.st.dn{color:${C.gold}}
.stn{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid ${C.bdr};background:#fff;flex-shrink:0}
.st.on .stn{border-color:${C.blk};background:${C.blk};color:#fff}.st.dn .stn{border-color:${C.gold};background:${C.gold};color:${C.blk}}
.stl{width:32px;height:2px;background:${C.bdrLt};margin:0 5px}.stl.dn{background:${C.gold}}
.cd{background:#fff;border:1px solid ${C.bdrLt};border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.02)}
.cd h2{font-family:${F.d};font-size:21px;margin-bottom:2px}.cd-s{font-size:14px;color:${C.gray};margin-bottom:18px}
.opt{border:2px solid ${C.bdrLt};border-radius:9px;padding:12px 16px;margin-bottom:7px;cursor:pointer;transition:.15s;display:flex;align-items:center;justify-content:space-between}
.opt:hover{border-color:${C.gold};background:${C.goldFaint}}.opt.sl{border-color:${C.goldDk};background:${C.goldFaint}}
.opt-i h4{font-size:14px;font-weight:600}.opt-i p{font-size:13px;color:${C.gray};margin-top:1px}
.opt-c{width:20px;height:20px;border-radius:50%;border:2px solid ${C.bdr};display:flex;align-items:center;justify-content:center;flex-shrink:0}
.opt.sl .opt-c{border-color:${C.gold};background:${C.gold};color:${C.blk}}
.opt-f{font-size:14px;font-weight:700;color:${C.goldDk}}
.opt-sg{font-size:10px;background:${C.grnBg};color:${C.grn};padding:1px 7px;border-radius:3px;font-weight:600;margin-left:6px}
.wv{border:1px solid ${C.bdrLt};border-radius:9px;padding:16px;margin-bottom:9px}
.wv h4{font-size:13px;font-weight:600;margin-bottom:0}.wv .rq{color:${C.red};font-size:10px;margin-left:4px}
.wv-hd{display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:2px 0;border-radius:5px;transition:.12s}
.wv-hd:hover{opacity:.8}
.wv-chev{font-size:14px;color:${C.grayLt}}
.wv-b{font-size:14px;color:${C.gray};line-height:1.6;margin:10px 0;padding:8px;background:${C.off};border-radius:5px}
.wv-a{display:flex;align-items:center;gap:7px;cursor:pointer;font-size:13px;font-weight:500}
.reg-for{text-align:center;font-size:15px;color:${C.gray};margin-top:-18px;margin-bottom:18px;font-weight:500}
.col-picker{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border:1px solid ${C.bdrLt};border-radius:8px;padding:8px 0;box-shadow:0 4px 16px rgba(0,0,0,.1);z-index:50;min-width:160px}
.col-picker-item{display:flex;align-items:center;gap:7px;padding:5px 14px;font-size:12px;font-weight:500;cursor:pointer;transition:.1s}.col-picker-item:hover{background:${C.goldFaint}}
.col-picker-item input{accent-color:${C.gold}}
.wck{width:16px;height:16px;border:2px solid ${C.bdr};border-radius:3px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wck.on{background:${C.gold};border-color:${C.gold};color:${C.blk}}
.szr{display:flex;align-items:center;gap:10px;margin-bottom:12px}.szr label{font-size:13px;font-weight:600;color:${C.char};min-width:90px}
.szp{display:flex;gap:5px;flex-wrap:wrap}
.sz{padding:5px 12px;border:1px solid ${C.bdr};border-radius:5px;font-size:13px;font-weight:500;cursor:pointer;background:#fff;font-family:${F.b};color:${C.char};transition:.15s}
.sz:hover{border-color:${C.gold}}.sz.sl{border-color:${C.gold};background:${C.goldFaint};color:${C.goldDk};font-weight:600}
.rt{width:100%;border-collapse:collapse;margin:12px 0}.rt td{padding:8px 0;font-size:14px;border-bottom:1px solid ${C.bdrLt}}
.rt td:first-child{color:${C.gray};width:120px}.rt td:last-child{font-weight:500}
.rf{font-size:20px;font-weight:700;color:${C.goldDk};font-family:${F.d}}
.br{display:flex;gap:9px;margin-top:20px;justify-content:flex-end}
.b{padding:9px 20px;border-radius:7px;font-family:${F.b};font-size:14px;font-weight:600;cursor:pointer;transition:.15s;display:inline-flex;align-items:center;gap:5px;border:none}
.bp{background:${C.blk};color:#fff}.bp:hover{background:${C.blkSoft}}
.bg{background:${C.gold};color:${C.blk}}.bg:hover{background:${C.goldLt}}
.bs{background:${C.off};color:${C.char};border:1px solid ${C.bdr}}.bs:hover{background:${C.bdrLt}}
.bgh{background:none;color:${C.gray};border:none}.bgh:hover{color:${C.blk}}
.bd{background:none;color:${C.red};border:none}.bd:hover{background:${C.redBg}}
.bsm{padding:6px 12px;font-size:13px}
.b:disabled{opacity:.35;cursor:not-allowed}
.ci{background:#fff;border:1px solid ${C.bdrLt};border-radius:10px;padding:16px 20px;margin-bottom:9px;display:flex;align-items:center;justify-content:space-between}
.ci-i h4{font-size:14px;font-weight:600}.ci-i p{font-size:13px;color:${C.gray};margin-top:1px}
.ci-r{display:flex;align-items:center;gap:12px}.ci-f{font-size:15px;font-weight:700;color:${C.goldDk}}
.ct{background:${C.goldFaint};border:1px solid ${C.goldPale};border-radius:10px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-top:12px}
.ct-l{font-size:14px;font-weight:600}.ct-a{font-size:22px;font-weight:700;color:${C.goldDk};font-family:${F.d}}
.cfm{background:#fff;border:1px solid ${C.bdrLt};border-radius:12px;padding:44px 24px;text-align:center;max-width:520px;margin:0 auto}
.cfm-ic{width:56px;height:56px;border-radius:50%;background:${C.goldFaint};display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:${C.gold}}
.cfm h2{font-family:${F.d};font-size:24px;margin-bottom:5px}.cfm p{color:${C.gray};font-size:14px;line-height:1.6;max-width:380px;margin:0 auto}
.adm{display:grid;grid-template-columns:190px 1fr;min-height:calc(100vh - 56px)}
.asd{background:#fff;border-right:1px solid ${C.bdrLt};padding:18px 0}
.asd-l{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${C.grayLt};padding:16px 18px 5px;font-weight:600}
.asd-i{display:flex;align-items:center;gap:7px;padding:8px 18px;font-size:13px;font-weight:500;color:${C.gray};cursor:pointer;border:none;background:none;width:100%;text-align:left;font-family:${F.b};transition:.12s}
.asd-i:hover{background:${C.goldFaint};color:${C.blk}}.asd-i.on{background:${C.goldFaint};color:${C.goldDk};font-weight:600;border-right:3px solid ${C.gold}}
.am{padding:24px}.amh{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.amh h1{font-family:${F.d};font-size:24px}
.sts{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:20px}
.stt{background:#fff;border:1px solid ${C.bdrLt};border-radius:10px;padding:14px}
.stt-l{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:${C.gray};font-weight:600}
.stt-v{font-family:${F.d};font-size:26px;margin-top:2px}.stt-v.gd{color:${C.goldDk}}
.stt-s{font-size:10px;color:${C.grayLt};margin-top:1px}
.flt{display:flex;gap:8px;margin-bottom:14px;align-items:center}
.fsl{padding:6px 10px;border:1px solid ${C.bdr};border-radius:5px;font-family:${F.b};font-size:12px;background:#fff;cursor:pointer}
.fin{padding:6px 10px;border:1px solid ${C.bdr};border-radius:5px;font-family:${F.b};font-size:12px;flex:1;max-width:220px}
.fsl:focus,.fin:focus{outline:none;border-color:${C.gold};box-shadow:0 0 0 2px rgba(197,160,78,.1)}
.dt{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border:1px solid ${C.bdrLt};border-radius:10px;overflow:hidden}
.dt th{text-align:left;padding:10px 12px;font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:${C.gray};font-weight:600;background:${C.off};border-bottom:1px solid ${C.bdrLt}}
.dt td{padding:10px 12px;font-size:12px;border-bottom:1px solid ${C.bdrLt}}.dt tr:last-child td{border-bottom:none}.dt tr:hover td{background:${C.goldFaint}}
.bdg{font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;display:inline-block}
.bdg-ok{background:${C.grnBg};color:${C.grn}}.bdg-pn{background:#fef3c7;color:#92400e}
.btag{background:${C.off};color:${C.char};font-size:10px;font-weight:600;padding:2px 7px;border-radius:3px}
.cp h1{font-family:${F.d};font-size:30px;margin-bottom:6px}.cp h2{font-family:${F.d};font-size:20px;margin:24px 0 6px}
.cp p{font-size:17px;color:${C.char};line-height:1.7;margin-bottom:12px}
.cp .gl{width:44px;height:3px;background:${C.gold};border-radius:2px;margin-bottom:16px}
.bgrd{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-top:12px}
.bcrd{background:#fff;border:1px solid ${C.bdrLt};border-radius:9px;padding:18px;text-align:center}
.bcrd-av{width:48px;height:48px;border-radius:50%;background:${C.goldFaint};display:flex;align-items:center;justify-content:center;margin:0 auto 8px;color:${C.gold}}
.bcrd h4{font-size:14px;font-weight:600}.bcrd p{font-size:11px;color:${C.gray}}
.ic{background:#fff;border:1px solid ${C.bdrLt};border-radius:10px;padding:20px;margin-bottom:12px}
.ic h3{font-family:${F.d};font-size:16px;margin-bottom:4px}.ic p{font-size:14px;color:${C.gray};line-height:1.6;margin:0}
.spt{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:14px}
.spc{background:#fff;border:1px solid ${C.bdrLt};border-radius:10px;padding:22px;text-align:center;transition:.15s}.spc:hover{border-color:${C.gold}}
.spc h3{font-family:${F.d};font-size:18px;margin-bottom:2px}
.spc .pr{font-size:26px;font-weight:700;color:${C.goldDk};font-family:${F.d};margin:6px 0}
.spc ul{text-align:left;font-size:13px;color:${C.char};line-height:2;list-style:none;padding:0}.spc ul li::before{content:"✓ ";color:${C.gold};font-weight:700}
.mo{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:200}
.md{background:#fff;border-radius:12px;padding:24px;width:400px;max-width:90vw;box-shadow:0 16px 48px rgba(0,0,0,.15)}
.md h3{font-family:${F.d};font-size:18px;margin-bottom:14px}
.fr{margin-bottom:12px}.fr label{display:block;font-size:15px;font-weight:600;color:${C.char};margin-bottom:3px}
.fr input,.fr select{width:100%;padding:8px 10px;border:1px solid ${C.bdr};border-radius:5px;font-family:${F.b};font-size:14px}
.fr input:focus,.fr select:focus{outline:none;border-color:${C.gold};box-shadow:0 0 0 2px rgba(197,160,78,.1)}
.fc{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:768px){.hero h1{font-size:28px}.sts{grid-template-columns:repeat(2,1fr)}.adm{grid-template-columns:1fr}.asd{display:none}.pgrid{grid-template-columns:1fr}.sb{flex-direction:column;gap:8px;text-align:center}.st span{display:none}.bgrd{grid-template-columns:1fr}.spt{grid-template-columns:1fr}}`;

// ─── Pages ───
function HomePage({go}){return(<div><div className="hero"><h1><span className="g">M</span>eadow <span className="g">A</span>thletic <span className="g">A</span>ssociation</h1><p>Youth recreational sports for the Meadow community. Building character, teamwork, and lifelong memories.</p><button className="hcta" onClick={()=>go("register")}>Register Now <Ic d={icons.chev} s={15}/></button></div><div className="pg"><div className="sb"><div><h3>{SEASON.name}</h3><p>Registration open Jan 20 – Feb 28, 2026</p></div><span className="sbb">Open Now</span></div><div className="sh"><h3>Available Programs</h3><p>{SEASON.programs.length} programs for ages 3–12</p></div><div className="pgrid">{SEASON.programs.map(p=>(<div className="pcard" key={p.id}><div className="pcard-l">{p.gender}</div><h4>{p.name}</h4><div className="pcard-m"><span className="pcard-a">Ages {p.min}–{p.max}</span><span className="pcard-f">${p.fee}</span></div></div>))}</div></div></div>)}

function AboutPage(){const board=[{n:"Karla Parnell",r:"President"},{n:"Justin Massengill",r:"Vice President"},{n:"Parker Johnson",r:"Secretary"},{n:"Tiffany Adams",r:"Treasurer"}];return(<div className="pg cp"><h1>About the Meadow Athletic Association</h1><div className="gl"/><p>We are a multiple sport athletic association, serving the Meadow community. We are a non-profit organization and a part of our area since 1976. We are run by all volunteers, currently consisting of 21 members and a Treasurer.</p><h2>Our Board</h2><p>MAA is governed by a volunteer board of directors elected by the membership.</p><div className="bgrd">{board.map(b=>(<div className="bcrd" key={b.n}><div className="bcrd-av"><Ic d={icons.user} s={22}/></div><h4>{b.n}</h4><p>{b.r}</p></div>))}</div><h2>Contact</h2><div className="ic"><div style={{display:"flex",gap:28,flexWrap:"wrap",alignItems:"flex-start"}}><div><h3>Get in Touch</h3><p>meadowathleticassociation@gmail.com</p><a href="https://www.facebook.com/groups/169287900378142" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,color:C.gold,fontWeight:600,fontSize:13,textDecoration:"none",marginTop:8}}><Ic d={icons.fb} s={16}/>Join us on Facebook</a></div></div></div></div>)}

function FieldsPage(){return(<div className="pg cp"><h1>Field Rentals</h1><div className="gl"/><p>MAA has two fields available for rental when not in use for games or practices.</p><div style={{borderRadius:10,overflow:"hidden",margin:"16px 0",border:`1px solid ${C.bdrLt}`,position:"relative"}}><img src={B_URL+"static/fields-aerial.jpg"} alt="Aerial view of MAA fields" style={{width:"100%",display:"block",maxHeight:420,objectFit:"cover",objectPosition:"center"}}/><div style={{position:"absolute",left:"38%",top:"49%",transform:"translate(-50%,-50%)",background:"rgba(0,0,0,.68)",color:"#fff",padding:"5px 14px",borderRadius:6,fontFamily:F.b,fontWeight:700,fontSize:13,letterSpacing:".5px",border:`1px solid ${C.gold}`,pointerEvents:"none"}}>Field 1</div><div style={{position:"absolute",left:"61%",top:"76%",transform:"translate(-50%,-50%)",background:"rgba(0,0,0,.68)",color:"#fff",padding:"5px 14px",borderRadius:6,fontFamily:F.b,fontWeight:700,fontSize:13,letterSpacing:".5px",border:`1px solid ${C.gold}`,pointerEvents:"none"}}>Field 2</div></div><div className="ic"><h3>MAA Field 1</h3><p>Supports T-Ball, T-Shirt, 8U, 10U, and 12U baseball and softball.</p></div><div className="ic"><h3>MAA Field 2</h3><p>Supports T-Ball, T-Shirt, 8U and 10U baseball, and 8U, 10U, and 12U softball.</p></div><h2>Rental Rates</h2><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:360}}><div style={{background:"#fff",border:`1px solid ${C.bdrLt}`,borderRadius:8,padding:16,textAlign:"center"}}><div style={{fontSize:12,color:C.gray,fontWeight:600,marginBottom:4}}>Without Lights</div><div style={{fontFamily:F.d,fontSize:26,color:C.goldDk}}>$15<span style={{fontSize:14,fontWeight:400}}>/hr</span></div></div><div style={{background:"#fff",border:`1px solid ${C.bdrLt}`,borderRadius:8,padding:16,textAlign:"center"}}><div style={{fontSize:12,color:C.gray,fontWeight:600,marginBottom:4}}>With Lights</div><div style={{fontFamily:F.d,fontSize:26,color:C.goldDk}}>$35<span style={{fontSize:14,fontWeight:400}}>/hr</span></div><div style={{fontSize:11,color:C.grayLt,marginTop:2}}>+$20/hr for lights</div></div></div><p style={{marginTop:12,fontSize:13,color:C.gray}}>Example: 1 hr without lights + 1 hr with lights = $15 + $35 = $50</p><p style={{marginTop:16,fontSize:13,color:C.gray}}>To reserve, contact meadowathleticassociation@gmail.com.</p></div>)}

function SponsorsPage(){return(<div className="pg cp"><h1>Become a Sponsor</h1><div className="gl"/><p>MAA relies on local businesses and families to keep registration fees affordable and our fields well-maintained. There are two ways to get involved.</p><div className="spt"><div className="spc" style={{borderColor:C.gold}}><Ic d={icons.star} s={24} style={{color:C.gold,margin:"0 auto 6px",display:"block"}}/><h3>Field Banner</h3><div style={{display:"flex",gap:16,justifyContent:"center",alignItems:"flex-end",margin:"8px 0 4px"}}><div style={{textAlign:"center"}}><div className="pr" style={{margin:0}}>$175<span style={{fontSize:16,fontWeight:600}}>/yr</span></div><div style={{fontSize:11,color:C.gray,marginTop:2}}>for 3 years</div></div><div style={{color:C.grayLt,fontSize:13,paddingBottom:18}}>or</div><div style={{textAlign:"center"}}><div className="pr" style={{margin:0}}>$500</div><div style={{fontSize:11,color:C.gray,marginTop:2}}>one-time</div></div></div><ul style={{marginTop:10,marginBottom:0}}><li>Two banners — one on an MAA field, one on a school field</li><li>Seen by players, families &amp; fans all season</li><li>Covers three full seasons</li></ul><a href={B_URL+"static/sponsorship-form.pdf"} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:14,color:C.goldDk,fontWeight:600,fontSize:13,textDecoration:"none"}}><Ic d={icons.dl} s={13}/> Download Sponsorship Form</a></div><div className="spc" style={{borderColor:C.gold}}><Ic d={icons.heart} s={24} style={{color:C.gold,margin:"0 auto 6px",display:"block"}}/><h3>Team Sponsor</h3><div className="pr">$250</div><div style={{fontSize:12,color:C.gray,marginBottom:10}}>per team · per season</div><ul><li>Sponsor a specific team for one season</li><li>Sponsor name on team jersey</li><li>Available for any sport or age group</li></ul></div></div><p style={{marginTop:20,fontSize:13,color:C.gray}}>To get started, contact us at meadowathleticassociation@gmail.com.</p></div>)}

function FaqPage({go}){
  const Sh=({l,first})=><div style={{fontWeight:700,color:C.goldDk,fontSize:18,textTransform:"uppercase",letterSpacing:".7px",marginTop:first?0:10,marginBottom:3}}>{l}</div>;
  const faqs=[
    {q:"What sports does MAA typically offer?",a:<><Sh l="Spring" first/><ul style={{paddingLeft:16,marginTop:3,lineHeight:1.9}}><li>T-Ball (Coed, ages 3–4)</li><li>T-Shirt (Coed, ages 5–6)</li><li>Baseball (8U, 10U, 12U — boys)</li><li>Softball (8U, 10U, 12U — girls)</li></ul><Sh l="Fall"/><ul style={{paddingLeft:16,marginTop:3,lineHeight:1.9}}><li>Soccer (6U Coed, 8U Boys, 8U Girls)</li><li>Baseball (8U, 10U, 12U — boys)</li><li>Softball (8U, 10U, 12U — girls)</li></ul><Sh l="Winter"/><ul style={{paddingLeft:16,marginTop:3,lineHeight:1.9}}><li>Basketball (6U Coed, 8U/10U/12U/15U boys, 8U/10U/12U girls)</li><li>Volleyball (8U, 10U, 12U)</li></ul></>},
    {q:"When does registration open?",a:<><Sh l="Spring" first/>Typically opens mid-January and runs through February.<Sh l="Fall"/>Opens early July through early August.<Sh l="Winter"/>Opens early October through early November.<div style={{marginTop:6,fontSize:11,color:C.gray}}>Deadlines may close earlier if an age group fills.</div></>},
    {q:"When does each season start?",a:<><Sh l="Spring" first/>Practices begin in March; games start in April.<Sh l="Fall"/>Practices begin in late August; games start mid-September.<Sh l="Winter"/>Practices begin in early December; games start in early January.</>},
    {q:"When do practices start?",a:<><Sh l="Spring" first/>Baseball, softball, T-Ball, and T-Shirt practices begin in March.<Sh l="Fall"/>Soccer practices begin in late August.<Sh l="Winter"/>Volleyball practices begin in early December.</>},
    {q:"When are games scheduled?",a:<><Sh l="Spring" first/>Baseball and softball games are mostly Monday, Tuesday, and Thursday evenings. T-Ball games start at 6:30 PM; T-Shirt games start at 7:15–7:30 PM.<Sh l="Fall"/>Soccer games are mostly Monday, Tuesday, and Thursday.<Sh l="Winter"/>Volleyball games are mostly Saturday with some Tuesday and Thursday.</>},
    {q:"How do I volunteer to coach?",a:"Indicate your interest during registration. The board will follow up with details before the season starts."},
    {q:"How do coaches communicate with families?",a:"Coaches coordinate with families via group text message."},
    {q:"How do I become a sponsor?",a:"MAA offers field banner sponsorships and per-team seasonal sponsorships.",link:{l:"View sponsorship options",p:"sponsors"}},
    {q:"Is MAA a non-profit?",a:"Yes. MAA has been a volunteer-run, non-profit organization serving the Meadow community since 1976, governed by 21 members and a Treasurer.",link:{l:"Learn more about MAA",p:"about"}}
  ];
  const[open,setOpen]=useState(null);
  return(<div className="pg cp"><h1>Frequently Asked Questions</h1><div className="gl"/>{faqs.map((f,i)=>(<div className="wv" key={i}><div className="wv-hd" onClick={()=>setOpen(open===i?null:i)}><h4 style={{fontWeight:600,fontSize:18}}>{f.q}</h4><span className="wv-chev">{open===i?"▾":"▸"}</span></div>{open===i&&<div className="wv-b">{f.a}{f.link&&<button className="b bgh bsm" style={{marginTop:8,display:"inline-flex"}} onClick={()=>go(f.link.p)}>{f.link.l} →</button>}</div>}</div>))}</div>)}

function AddModal({onAdd,onClose}){const[f,sF]=useState({fn:"",mn:"",ln:"",dob:"",g:""});const ok=f.fn&&f.ln&&f.dob&&f.g;return(<div className="mo" onClick={onClose}><div className="md" onClick={e=>e.stopPropagation()}><h3>Add Child</h3><div className="fc"><div className="fr"><label>First Name</label><input value={f.fn} onChange={e=>sF({...f,fn:e.target.value})}/></div><div className="fr"><label>Middle Name</label><input value={f.mn} onChange={e=>sF({...f,mn:e.target.value})}/></div></div><div className="fc"><div className="fr"><label>Last Name</label><input value={f.ln} onChange={e=>sF({...f,ln:e.target.value})}/></div><div className="fr"><label>Gender</label><select value={f.g} onChange={e=>sF({...f,g:e.target.value})}><option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option></select></div></div><div className="fr"><label>Date of Birth</label><input type="date" value={f.dob} onChange={e=>sF({...f,dob:e.target.value})}/></div><div className="br"><button className="b bgh" onClick={onClose}>Cancel</button><button className="b bg" disabled={!ok} onClick={()=>{onAdd({id:`p-${Date.now()}`,firstName:f.fn,middleName:f.mn,lastName:f.ln,dob:f.dob,gender:f.g});onClose()}}><Ic d={icons.plus} s={13}/> Add</button></div></div></div>)}

function RegPage({players,addPlayer,addToCart,go}){
  const[step,sStep]=useState(1);const[pl,sPl]=useState(null);const[pr,sPr]=useState(null);const[wv,sWv]=useState({});const[hat,sHat]=useState("");const[jer,sJer]=useState("");const[showAdd,sShowAdd]=useState(false);
  const[digitalPic,setDigitalPic]=useState(false);const[extraHat,setExtraHat]=useState(false);const[extraHatSize,setExtraHatSize]=useState("");const[coaching,setCoaching]=useState("");const[sponsorship,setSponsorship]=useState("");
  const[coachShirtSize,setCoachShirtSize]=useState("");const[sponsorName,setSponsorName]=useState("");const[activeWaiver,setActiveWaiver]=useState(0);
  const[gPri,setGPri]=useState({fn:CURRENT_USER.firstName,ln:CURRENT_USER.lastName,ph:CURRENT_USER.phone});
  const[gSec,setGSec]=useState({fn:CURRENT_USER.secondaryGuardian.firstName,ln:CURRENT_USER.secondaryGuardian.lastName,ph:CURRENT_USER.secondaryGuardian.phone});
  const[hasSec,setHasSec]=useState(true);
  const[priContact,setPriContact]=useState("");
  const rec=pl?recommended(pl,SEASON.programs):[];const other=pl?otherPrograms(pl,SEASON.programs):[];
  const applicableWaivers=SEASON.waivers.filter(w=>!w.coachOnly||coaching==="Coach"||coaching==="Assistant Coach");
  const wvOk=applicableWaivers.filter(w=>w.required).every(w=>wv[w.id]);const szOk=hat&&jer;
  const labels=["Player","Program","Guardian","Sizes","Interest","Waivers","Review"];
  function submit(){
    addToCart({
      id:`c-${Date.now()}`,
      player:pl, program:pr, hat, jersey:jer,
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
      total:calcTotal(pr,digitalPic,extraHat)
    });
    sStep(1);sPl(null);sPr(null);sWv({});sHat("");sJer("");setPriContact("");
    setDigitalPic(false);setExtraHat(false);setExtraHatSize("");setCoaching("");setSponsorship("");
    setCoachShirtSize("");setSponsorName("");setActiveWaiver(0);
    go("cart");
  }
  return(<div className="pg"><div className="pgn">
    <div className="steps">{labels.map((l,i)=>(<div key={i} style={{display:"flex",alignItems:"center"}}><div className={`st ${step===i+1?"on":step>i+1?"dn":""}`}><div className="stn">{step>i+1?<Ic d={icons.chk} s={12}/>:i+1}</div><span>{l}</span></div>{i<labels.length-1&&<div className={`stl ${step>i+1?"dn":""}`}/>}</div>))}</div>
    {pl&&step>1&&<div className="reg-for">Registering: {fullName(pl)} &ndash; Age: {age(pl.dob,null)}</div>}
    {step===1&&<div className="cd"><h2>Select Player</h2><p className="cd-s">Choose which child to register for {SEASON.name}.</p>
      {players.map(p=>(<div key={p.id} className={`opt ${pl?.id===p.id?"sl":""}`} onClick={()=>sPl(p)}><div className="opt-i"><h4>{fullName(p)}</h4><p>DOB: {new Date(p.dob).toLocaleDateString()} · Age: {age(p.dob,null)} · {p.gender}</p></div><div className={`opt-c`}>{pl?.id===p.id&&<Ic d={icons.chk} s={12}/>}</div></div>))}
      <button className="b bs bsm" style={{marginTop:10}} onClick={()=>sShowAdd(true)}><Ic d={icons.plus} s={13}/> Add Child</button>
      <div className="br"><button className="b bp" disabled={!pl} onClick={()=>{sPr(null);sStep(2)}}>Continue <Ic d={icons.chev} s={13}/></button></div>
      {showAdd&&<AddModal onAdd={addPlayer} onClose={()=>sShowAdd(false)}/>}
    </div>}
    {step===2&&<div className="cd"><h2>Select Program</h2><p className="cd-s">Programs for {pl.firstName} ({pl.gender}).</p>
      {rec.length>0&&<><div style={{fontSize:11,fontWeight:600,color:C.grn,textTransform:"uppercase",letterSpacing:".7px",marginBottom:6}}>Recommended for {pl.firstName}</div>
      {rec.map(p=>(<div key={p.id} className={`opt ${pr?.id===p.id?"sl":""}`} onClick={()=>sPr(p)}><div className="opt-i"><h4>{p.name}<span className="opt-sg">Recommended</span></h4><p>Ages {p.min}–{p.max} · {p.cutoff?`${pl.firstName} is ${age(pl.dob,p.cutoff)} as of ${new Date(p.cutoff).toLocaleDateString()}`:`${pl.firstName} is ${age(pl.dob,p.cutoff)} years old`}</p></div><span className="opt-f">${p.fee}</span></div>))}</>}
      {other.length>0&&<><div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:".7px",marginTop:14,marginBottom:6}}>Other Programs</div>
      {other.map(p=>(<div key={p.id} className={`opt ${pr?.id===p.id?"sl":""}`} onClick={()=>sPr(p)}><div className="opt-i"><h4>{p.name}</h4><p>Ages {p.min}–{p.max} · {p.cutoff?`${pl.firstName} is ${age(pl.dob,p.cutoff)} as of ${new Date(p.cutoff).toLocaleDateString()}`:`${pl.firstName} is ${age(pl.dob,p.cutoff)} years old`}</p></div><span className="opt-f">${p.fee}</span></div>))}</>}
      {SEASON.programs.length===0&&<p style={{color:C.red,padding:14}}>No programs available this season.</p>}
      <div className="br"><button className="b bgh" onClick={()=>sStep(1)}>Back</button><button className="b bp" disabled={!pr} onClick={()=>sStep(3)}>Continue <Ic d={icons.chev} s={13}/></button></div>
    </div>}
    {step===3&&<div className="cd">
      <h2>Parent/Guardian & Contact</h2>
      <p className="cd-s">Confirm contact information for this registration.</p>
      <div style={{fontSize:11,fontWeight:600,color:C.char,textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>Primary Guardian</div>
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
      <div style={{fontSize:11,fontWeight:600,color:C.char,textTransform:"uppercase",letterSpacing:".7px",marginTop:18,marginBottom:8}}>Primary Contact Phone</div>
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
    {step===4&&<div className="cd"><h2>Hat & Jersey Size</h2><p className="cd-s">Select {pl.firstName}'s sizing for this season.</p>
      <div className="szr"><label>Hat Size</label><div className="szp">{HATS.map(s=>(<button key={s} className={`sz ${hat===s?"sl":""}`} onClick={()=>sHat(s)}>{s}</button>))}</div></div>
      <div className="szr"><label>Jersey Size</label><div className="szp">{JERSEYS.map(s=>(<button key={s} className={`sz ${jer===s?"sl":""}`} onClick={()=>sJer(s)}>{s}</button>))}</div></div>
      <div style={{borderTop:`1px solid ${C.bdrLt}`,marginTop:18,paddingTop:18}}>
        <div style={{fontSize:11,fontWeight:600,color:C.char,textTransform:"uppercase",letterSpacing:".7px",marginBottom:10}}>Optional Add-ons</div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>Digital Picture Package — $10</div>
          <div style={{fontSize:12,color:C.gray,marginBottom:6}}>Team and individual picture delivered via email</div>
          <div className="szp">
            <button className={`sz ${digitalPic===false?"sl":""}`} onClick={()=>setDigitalPic(false)}>No</button>
            <button className={`sz ${digitalPic===true?"sl":""}`} onClick={()=>setDigitalPic(true)}>Yes (+$10)</button>
          </div>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>Extra Hat — $30</div>
          <div style={{fontSize:12,color:C.gray,marginBottom:6}}>Purchase one additional hat</div>
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
      <div style={{fontSize:11,fontWeight:600,color:C.char,textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>Coaching Interest <span style={{color:C.red,fontSize:10}}>Required</span></div>
      <div className={`opt ${coaching==="Coach"?"sl":""}`} onClick={()=>{setCoaching("Coach")}}><div className="opt-i"><h4>Coach</h4><p>Lead a team as head coach</p></div><div className={`opt-c`}>{coaching==="Coach"&&<Ic d={icons.chk} s={12}/>}</div></div>
      <div className={`opt ${coaching==="Assistant Coach"?"sl":""}`} onClick={()=>{setCoaching("Assistant Coach")}}><div className="opt-i"><h4>Assistant Coach</h4><p>Help out as an assistant</p></div><div className={`opt-c`}>{coaching==="Assistant Coach"&&<Ic d={icons.chk} s={12}/>}</div></div>
      <div className={`opt ${coaching==="Not Interested"?"sl":""}`} onClick={()=>{setCoaching("Not Interested");setCoachShirtSize("")}}><div className="opt-i"><h4>Not Interested</h4><p>Not at this time</p></div><div className={`opt-c`}>{coaching==="Not Interested"&&<Ic d={icons.chk} s={12}/>}</div></div>
      {(coaching==="Coach"||coaching==="Assistant Coach")&&<>
        <div style={{fontSize:11,fontWeight:600,color:C.char,textTransform:"uppercase",letterSpacing:".7px",marginTop:18,marginBottom:8}}>Adult Shirt Size <span style={{color:C.red,fontSize:10}}>Required</span></div>
        <div className="szp">{COACH_SHIRTS.map(s=>(<button key={s} className={`sz ${coachShirtSize===s?"sl":""}`} onClick={()=>setCoachShirtSize(s)}>{s}</button>))}</div>
      </>}
      <div style={{fontSize:11,fontWeight:600,color:C.char,textTransform:"uppercase",letterSpacing:".7px",marginTop:18,marginBottom:8}}>Sponsorship Interest <span style={{color:C.red,fontSize:10}}>Required</span></div>
      <div className={`opt ${sponsorship==="Yes"?"sl":""}`} onClick={()=>setSponsorship("Yes")}><div className="opt-i"><h4>Yes, I'm interested</h4><p>We'll send you sponsorship information</p></div><div className={`opt-c`}>{sponsorship==="Yes"&&<Ic d={icons.chk} s={12}/>}</div></div>
      <div className={`opt ${sponsorship==="No"?"sl":""}`} onClick={()=>{setSponsorship("No");setSponsorName("")}}><div className="opt-i"><h4>No thanks</h4></div><div className={`opt-c`}>{sponsorship==="No"&&<Ic d={icons.chk} s={12}/>}</div></div>
      {sponsorship==="Yes"&&<div className="fr" style={{marginTop:12}}><label>Sponsor / Business Name</label><input value={sponsorName} onChange={e=>setSponsorName(e.target.value)} placeholder="Enter business or sponsor name"/></div>}
      <div className="br"><button className="b bgh" onClick={()=>sStep(4)}>Back</button><button className="b bp" disabled={!coaching||!sponsorship||((coaching==="Coach"||coaching==="Assistant Coach")&&!coachShirtSize)||(sponsorship==="Yes"&&!sponsorName)} onClick={()=>{setActiveWaiver(0);sStep(6)}}>Continue <Ic d={icons.chev} s={13}/></button></div>
    </div>}
    {step===6&&<div className="cd"><h2>Waivers & Agreements</h2><p className="cd-s">Review and acknowledge the following.</p>
      {applicableWaivers.map((w,idx)=>(<div className="wv" key={w.id}>
        <div className="wv-hd" onClick={()=>setActiveWaiver(activeWaiver===idx?-1:idx)}>
          <h4>{w.title}{w.required&&<span className="rq">Required</span>}</h4>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {wv[w.id]&&<Ic d={icons.chk} s={12}/>}
            <span className="wv-chev">{activeWaiver===idx?"▾":"▸"}</span>
          </div>
        </div>
        {activeWaiver===idx&&<>
          <div className="wv-b">{w.content}</div>
          <label className="wv-a" onClick={()=>{sWv(p=>({...p,[w.id]:!p[w.id]}));if(!wv[w.id]&&idx<applicableWaivers.length-1){setActiveWaiver(idx+1)}}}><div className={`wck ${wv[w.id]?"on":""}`}>{wv[w.id]&&<Ic d={icons.chk} s={10}/>}</div>I have read and agree to the {w.title}</label>
        </>}
      </div>))}
      <div className="br"><button className="b bgh" onClick={()=>sStep(5)}>Back</button><button className="b bp" disabled={!wvOk} onClick={()=>sStep(7)}>Continue <Ic d={icons.chev} s={13}/></button></div>
    </div>}
    {step===7&&<div className="cd"><h2>Review Registration</h2><p className="cd-s">Confirm details before adding to cart.</p>
  <table className="rt"><tbody>
    <tr><td>Player</td><td>{fullName(pl)}</td></tr>
    <tr><td>Date of Birth</td><td>{new Date(pl.dob).toLocaleDateString()}</td></tr>
    <tr><td>Program</td><td>{pr.name}</td></tr>
    <tr><td>Age</td><td>{age(pl.dob,pr.cutoff)} years old{pr.cutoff?` (as of ${new Date(pr.cutoff).toLocaleDateString()})`:""}</td></tr>
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
    <tr><td>Waivers</td><td>{applicableWaivers.map(w=>w.title).join(", ")}</td></tr>
  </tbody></table>
  <div style={{borderTop:`1px solid ${C.bdrLt}`,marginTop:12,paddingTop:12}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span>Registration Fee</span><span>${pr.fee}.00</span></div>
    {digitalPic&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4,color:C.gray}}><span>Digital Picture</span><span>+$10.00</span></div>}
    {extraHat&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4,color:C.gray}}><span>Extra Hat</span><span>+$30.00</span></div>}
    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,borderTop:`1px solid ${C.bdrLt}`,paddingTop:8,marginTop:4}}><span>Total</span><span className="rf">${calcTotal(pr,digitalPic,extraHat)}.00</span></div>
  </div>
  <div className="br"><button className="b bgh" onClick={()=>sStep(6)}>Back</button><button className="b bg" onClick={submit}><Ic d={icons.cart} s={14}/> Add to Cart</button></div>
</div>}
  </div></div>)}

function CartPage({cart,remove,clear,go}){
  const total=cart.reduce((s,i)=>s+(i.total||i.program.fee),0);const[done,sDone]=useState(false);
  if(done)return(<div className="pg"><div className="cfm"><div className="cfm-ic"><Ic d={icons.chk} s={28}/></div><h2>Registration Submitted!</h2><p>Your registration has been submitted. Payment details will be communicated separately by the MAA board.</p><button className="b bp" style={{marginTop:20}} onClick={()=>{sDone(false);clear();go("home")}}>Return Home</button></div></div>);
  return(<div className="pg"><div className="pgn">
    <h2 style={{fontFamily:F.d,fontSize:24,marginBottom:2}}>Your Cart</h2>
    <p style={{fontSize:13,color:C.gray,marginBottom:18}}>{cart.length===0?"Your cart is empty.":`${cart.length} registration${cart.length!==1?"s":""} ready to submit.`}</p>
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
    <button className="b bd bsm" onClick={()=>remove(i.id)}><Ic d={icons.trash} s={14}/></button>
  </div>
</div>))}
    {cart.length>0&&<><div className="ct"><span className="ct-l">Total Due</span><span className="ct-a">${total}.00</span></div><div className="br" style={{marginTop:16}}><button className="b bs" onClick={()=>go("register")}>Register Another</button><button className="b bg" onClick={()=>sDone(true)}>Complete Registration</button></div></>}
    {cart.length===0&&<div style={{textAlign:"center",padding:32}}><button className="b bp" onClick={()=>go("register")}>Start Registration</button></div>}
  </div></div>)}

const ADMIN_COLS = [
  {id:"player",label:"Player",default:true},
  {id:"program",label:"Program",default:true},
  {id:"parent",label:"Parent",default:true},
  {id:"hat",label:"Hat",default:false},
  {id:"jersey",label:"Jersey",default:false},
  {id:"pic",label:"Pic",default:false},
  {id:"extraHat",label:"Extra Hat",default:false},
  {id:"coaching",label:"Coaching",default:false},
  {id:"status",label:"Status",default:false},
  {id:"total",label:"Total",default:true},
  {id:"date",label:"Date",default:true},
];

function AdminPage(){
  const[tab,sTab]=useState("dash");const[sf,sSf]=useState("All");const[stf,sStf]=useState("All");const[q,sQ]=useState("");
  const[visCols,setVisCols]=useState(()=>ADMIN_COLS.filter(c=>c.default).map(c=>c.id));
  const[showColPicker,setShowColPicker]=useState(false);
  const[showEquipModal,setShowEquipModal]=useState(false);
  const filt=REGS.filter(r=>{if(sf!=="All"&&r.program!==sf)return false;if(stf!=="All"&&r.status!==stf)return false;if(q&&!r.player.toLowerCase().includes(q.toLowerCase())&&!r.parent.toLowerCase().includes(q.toLowerCase()))return false;return true});
  const totalRev=REGS.reduce((s,r)=>s+r.total,0);
  const tball=REGS.filter(r=>r.program==="T-Ball").length;
  const tshirt=REGS.filter(r=>r.program==="T-Shirt").length;
  const bball=REGS.filter(r=>r.program.includes("Baseball"));
  const sball=REGS.filter(r=>r.program.includes("Softball"));
  const bball8=bball.filter(r=>r.program.includes("8U")).length;
  const bball10=bball.filter(r=>r.program.includes("10U")).length;
  const bball12=bball.filter(r=>r.program.includes("12U")).length;
  const sball8=sball.filter(r=>r.program.includes("8U")).length;
  const sball10=sball.filter(r=>r.program.includes("10U")).length;
  const sball12=sball.filter(r=>r.program.includes("12U")).length;
  const hatCounts={};REGS.forEach(r=>{hatCounts[r.hat]=(hatCounts[r.hat]||0)+1});
  const jerseyCounts={};REGS.forEach(r=>{jerseyCounts[r.jersey]=(jerseyCounts[r.jersey]||0)+1});
  const toggleCol=id=>setVisCols(v=>v.includes(id)?v.filter(c=>c!==id):[...v,id]);
  const vis=id=>visCols.includes(id);
  return(<div className="adm"><aside className="asd"><div className="asd-l">Management</div>
    {[{id:"dash",ic:icons.clip,l:"Registrations"},{id:"seasons",ic:icons.gear,l:"Seasons"},{id:"users",ic:icons.users,l:"Users"}].map(i=>(<button key={i.id} className={`asd-i ${tab===i.id?"on":""}`} onClick={()=>sTab(i.id)}><Ic d={i.ic} s={15}/>{i.l}</button>))}
  </aside><main className="am">
    {tab==="dash"&&<><div className="amh"><h1>Registration Dashboard</h1><button className="b bs bsm"><Ic d={icons.dl} s={13}/> Export CSV</button></div>
      <div className="sts">
        <div className="stt" style={{borderLeft:`3px solid ${C.gold}`}}><div className="stt-l">Total</div><div className="stt-v gd">{REGS.length}</div><div className="stt-s">all programs</div></div>
        <div className="stt"><div className="stt-l">T-Ball</div><div className="stt-v">{tball}</div><div className="stt-s">registered</div></div>
        <div className="stt"><div className="stt-l">T-Shirt</div><div className="stt-v">{tshirt}</div><div className="stt-s">registered</div></div>
        <div className="stt"><div className="stt-l">Baseball</div><div className="stt-v">{bball.length}</div><div className="stt-s">8U: {bball8} · 10U: {bball10} · 12U: {bball12}</div></div>
        <div className="stt"><div className="stt-l">Softball</div><div className="stt-v">{sball.length}</div><div className="stt-s">8U: {sball8} · 10U: {sball10} · 12U: {sball12}</div></div>
        <div className="stt" style={{borderLeft:`3px solid ${C.grn}`}}><div className="stt-l">Revenue</div><div className="stt-v gd">${totalRev.toLocaleString()}</div><div className="stt-s">total collected</div></div>
      </div>
      <div style={{marginBottom:14}}><button className="b bs bsm" onClick={()=>setShowEquipModal(true)}>Equipment Summary</button></div>
      <div className="flt"><select className="fsl" value={sf} onChange={e=>sSf(e.target.value)}><option>All</option>{[...new Set(REGS.map(r=>r.program))].map(s=><option key={s}>{s}</option>)}</select>
      <select className="fsl" value={stf} onChange={e=>sStf(e.target.value)}><option>All</option><option>Completed</option><option>Pending</option></select>
      <input className="fin" placeholder="Search player or parent..." value={q} onChange={e=>sQ(e.target.value)}/>
      <div style={{position:"relative"}}><button className="b bs bsm" onClick={()=>setShowColPicker(!showColPicker)}>Columns</button>
        {showColPicker&&<div className="col-picker">{ADMIN_COLS.map(c=>(<label key={c.id} className="col-picker-item"><input type="checkbox" checked={visCols.includes(c.id)} onChange={()=>toggleCol(c.id)}/>{c.label}</label>))}</div>}
      </div></div>
      <table className="dt"><thead><tr>{vis("player")&&<th>Player</th>}{vis("program")&&<th>Program</th>}{vis("parent")&&<th>Parent</th>}{vis("hat")&&<th>Hat</th>}{vis("jersey")&&<th>Jersey</th>}{vis("pic")&&<th>Pic</th>}{vis("extraHat")&&<th>Extra Hat</th>}{vis("coaching")&&<th>Coaching</th>}{vis("status")&&<th>Status</th>}{vis("total")&&<th>Total</th>}{vis("date")&&<th>Date</th>}</tr></thead>
      <tbody>{filt.map(r=>(<tr key={r.id}>{vis("player")&&<td style={{fontWeight:600}}>{r.player}</td>}{vis("program")&&<td><span className="btag">{r.program}</span></td>}{vis("parent")&&<td>{r.parent}</td>}{vis("hat")&&<td>{r.hat}</td>}{vis("jersey")&&<td>{r.jersey}</td>}{vis("pic")&&<td>{r.digitalPic?"✓":"—"}</td>}{vis("extraHat")&&<td>{r.extraHat||"—"}</td>}{vis("coaching")&&<td style={{fontSize:11}}>{r.coaching}</td>}{vis("status")&&<td><span className={`bdg ${r.status==="Completed"?"bdg-ok":"bdg-pn"}`}>{r.status}</span></td>}{vis("total")&&<td style={{fontWeight:600,color:C.goldDk}}>${r.total}</td>}{vis("date")&&<td style={{color:C.grayLt,fontSize:11}}>{r.date}</td>}</tr>))}</tbody></table>
      <p style={{fontSize:11,color:C.grayLt,marginTop:8,textAlign:"right"}}>{filt.length} of {REGS.length}</p>
      {showEquipModal&&<div className="mo" onClick={()=>setShowEquipModal(false)}><div className="md" onClick={e=>e.stopPropagation()} style={{width:480}}>
        <h3>Equipment Summary</h3>
        <div style={{fontSize:11,fontWeight:600,color:C.char,textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>Hat Sizes</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>{HATS.map(h=>(<div key={h} style={{background:C.off,borderRadius:6,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:11,color:C.gray,fontWeight:600}}>{h}</div><div style={{fontFamily:F.d,fontSize:22,marginTop:2}}>{hatCounts[h]||0}</div></div>))}</div>
        <div style={{fontSize:11,fontWeight:600,color:C.char,textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>Jersey Sizes</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{JERSEYS.map(j=>(<div key={j} style={{background:C.off,borderRadius:6,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:10,color:C.gray,fontWeight:600}}>{j}</div><div style={{fontFamily:F.d,fontSize:22,marginTop:2}}>{jerseyCounts[j]||0}</div></div>))}</div>
        <div className="br" style={{marginTop:18}}><button className="b bs" onClick={()=>setShowEquipModal(false)}>Close</button></div>
      </div></div>}
    </>}
    {tab==="seasons"&&<><div className="amh"><h1>Season Management</h1><button className="b bp bsm"><Ic d={icons.plus} s={13}/> New Season</button></div>
      <div className="cd"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h2 style={{marginBottom:0}}>{SEASON.name}</h2><p style={{fontSize:12,color:C.gray,marginTop:2}}>Registration: Jan 20 – Feb 28, 2026</p></div><div style={{display:"flex",gap:6,alignItems:"center"}}><span className="sbb">Active</span><button className="b bs bsm">Edit</button><button className="b bs bsm">Clone</button></div></div><p style={{fontSize:13,marginTop:10}}><strong>{SEASON.programs.length}</strong> programs · <strong>{SEASON.waivers.length}</strong> waivers · <strong>{REGS.length}</strong> registrations</p></div></>}
    {tab==="users"&&<><div className="amh"><h1>User Management</h1></div><p style={{color:C.gray}}>Assign Admin and Registrar roles here. Coming soon.</p></>}
  </main></div>)}

// ─── App Shell ───
export default function App(){
  const[pg,sPg]=useState("home");const[cart,sCart]=useState([]);const[players,sPlayers]=useState(INIT_PLAYERS);
  const add=i=>sCart(p=>[...p,i]);const rm=id=>sCart(p=>p.filter(i=>i.id!==id));const clr=()=>sCart([]);const addP=p=>sPlayers(prev=>[...prev,p]);
  const nav=[{id:"about",ic:icons.info,l:"About"},{id:"faq",ic:icons.help,l:"FAQ"},{id:"fields",ic:icons.map,l:"Field Rentals"},{id:"sponsors",ic:icons.star,l:"Sponsorship"},{id:"register",ic:icons.clip,l:"Register"},{id:"cart",ic:icons.cart,l:"Cart",badge:cart.length},{id:"admin",ic:icons.gear,l:"Admin"}];
  return(<div><style>{css}</style>
    <header className="H"><div className="H-logo" onClick={()=>sPg("home")}><img src={B_URL+"static/maa-large.jpg"} alt="MAA" style={{height:30,width:"auto",borderRadius:3}}/><span className="g">MAA</span> Meadow Athletic Association</div>
    <nav className="H-nav">{nav.map(n=>(<button key={n.id} className={pg===n.id?"on":""} onClick={()=>sPg(n.id)}><Ic d={n.ic} s={14}/>{n.l}{n.badge>0&&<span className="hbadge">{n.badge}</span>}</button>))}<button><Ic d={icons.user} s={14}/>Sarah C.</button></nav></header>
    {pg==="home"&&<HomePage go={sPg}/>}
    {pg==="about"&&<AboutPage/>}
    {pg==="faq"&&<FaqPage go={sPg}/>}
    {pg==="fields"&&<FieldsPage/>}
    {pg==="sponsors"&&<SponsorsPage/>}
    {pg==="register"&&<RegPage players={players} addPlayer={addP} addToCart={add} go={sPg}/>}
    {pg==="cart"&&<CartPage cart={cart} remove={rm} clear={clr} go={sPg}/>}
    {pg==="admin"&&<AdminPage/>}
  </div>)}
