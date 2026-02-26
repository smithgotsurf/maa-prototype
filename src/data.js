import parentsCodeHtml from './waivers/parents-code.html?raw';
import communicableDiseasesHtml from './waivers/communicable-diseases.html?raw';
import generalWaiverHtml from './waivers/general-waiver.html?raw';
import coachesCodeHtml from './waivers/coaches-code.html?raw';

export const SEASON = {
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
    {id:"w2",title:"Parents Code of Conduct",required:true,content:parentsCodeHtml},
    {id:"w3",title:"Waiver/Release for Communicable Diseases",required:true,content:communicableDiseasesHtml},
    {id:"w4",title:"General Participation Waiver",required:true,content:generalWaiverHtml},
    {id:"w1",title:"Coaches Code of Conduct",required:true,coachOnly:true,content:coachesCodeHtml},
  ]
};

export const HATS = ["XS/SM","SM/M","L/XL"];
export const JERSEYS = ["Youth S","Youth M","Youth L","Youth XL","Adult S","Adult M","Adult L","Adult XL"];
export const COACH_SHIRTS = ["Adult S","Adult M","Adult L","Adult XL","Adult 2XL","Adult 3XL"];

export const INIT_PLAYERS = [
  {id:"p1",firstName:"Ethan",middleName:"James",lastName:"Carter",dob:"2016-06-15",gender:"Male"},
  {id:"p2",firstName:"Lily",middleName:"",lastName:"Carter",dob:"2018-03-22",gender:"Female"},
  {id:"p3",firstName:"Owen",middleName:"Michael",lastName:"Carter",dob:"2022-01-10",gender:"Male"},
];

export const CURRENT_USER = {
  firstName: "Sarah", lastName: "Carter", phone: "(555) 867-5309",
  secondaryGuardian: { firstName: "John", lastName: "Carter", phone: "(555) 555-1234" }
};

export const REGS = [
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

export const ADMIN_COLS = [
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
