import parentsCodeHtml from './waivers/parents-code.html?raw';
import communicableDiseasesHtml from './waivers/communicable-diseases.html?raw';
import generalWaiverHtml from './waivers/general-waiver.html?raw';
import coachesCodeHtml from './waivers/coaches-code.html?raw';
import type { SeasonConfig, Player, CurrentUser, AdminRegistration, AdminColumn, SportType, Season } from './types';

export const SEASON: SeasonConfig = {
  name:"2026 Spring Sports", programs:[
    {id:"pg1",name:"T-Ball",gender:"Coed",ageAsOfDate:null,min:3,max:4,fee:65},
    {id:"pg2",name:"T-Shirt",gender:"Coed",ageAsOfDate:null,min:5,max:6,fee:65},
    {id:"pg3",name:"8U Baseball",gender:"Male",ageAsOfDate:"2026-05-01",min:7,max:8,fee:80},
    {id:"pg4",name:"10U Baseball",gender:"Male",ageAsOfDate:"2026-05-01",min:9,max:10,fee:80},
    {id:"pg5",name:"12U Baseball",gender:"Male",ageAsOfDate:"2026-05-01",min:11,max:12,fee:80,closed:true},
    {id:"pg6",name:"8U Softball",gender:"Female",ageAsOfDate:"2026-01-01",min:7,max:8,fee:80,closed:true},
    {id:"pg7",name:"10U Softball",gender:"Female",ageAsOfDate:"2026-01-01",min:9,max:10,fee:80},
    {id:"pg8",name:"12U Softball",gender:"Female",ageAsOfDate:"2026-01-01",min:11,max:12,fee:80},
  ],
  waivers:[
    {id:"w2",title:"Parents Code of Conduct",required:true,content:parentsCodeHtml},
    {id:"w3",title:"Waiver/Release for Communicable Diseases",required:true,content:communicableDiseasesHtml},
    {id:"w4",title:"General Participation Waiver",required:true,content:generalWaiverHtml},
    {id:"w1",title:"Coaches Code of Conduct",required:true,coachOnly:true,content:coachesCodeHtml},
  ]
};

export const HATS = ["XS/SM","SM/M","L/XL"] as const;
export const JERSEYS = ["Youth S","Youth M","Youth L","Youth XL","Adult S","Adult M","Adult L","Adult XL"] as const;
export const COACH_SHIRTS = ["Adult S","Adult M","Adult L","Adult XL","Adult 2XL","Adult 3XL"] as const;

export const SPORT_TYPES: SportType[] = [
  // Spring
  { name: "T-Ball", gender: "Coed", min: 3, max: 4, fee: 65 },
  { name: "T-Shirt", gender: "Coed", min: 5, max: 6, fee: 65 },
  { name: "8U Baseball", gender: "Male", min: 7, max: 8, fee: 80 },
  { name: "10U Baseball", gender: "Male", min: 9, max: 10, fee: 80 },
  { name: "12U Baseball", gender: "Male", min: 11, max: 12, fee: 80 },
  { name: "8U Softball", gender: "Female", min: 7, max: 8, fee: 80 },
  { name: "10U Softball", gender: "Female", min: 9, max: 10, fee: 80 },
  { name: "12U Softball", gender: "Female", min: 11, max: 12, fee: 80 },
  // Fall
  { name: "Soccer 6U", gender: "Coed", min: 5, max: 6, fee: 65 },
  { name: "Soccer 8U Boys", gender: "Male", min: 7, max: 8, fee: 80 },
  { name: "Soccer 8U Girls", gender: "Female", min: 7, max: 8, fee: 80 },
  // Winter
  { name: "Basketball 6U", gender: "Coed", min: 5, max: 6, fee: 65 },
  { name: "Basketball 8U Boys", gender: "Male", min: 7, max: 8, fee: 80 },
  { name: "Basketball 10U Boys", gender: "Male", min: 9, max: 10, fee: 80 },
  { name: "Basketball 12U Boys", gender: "Male", min: 11, max: 12, fee: 80 },
  { name: "Basketball 15U Boys", gender: "Male", min: 13, max: 15, fee: 80 },
  { name: "Basketball 8U Girls", gender: "Female", min: 7, max: 8, fee: 80 },
  { name: "Basketball 10U Girls", gender: "Female", min: 9, max: 10, fee: 80 },
  { name: "Basketball 12U Girls", gender: "Female", min: 11, max: 12, fee: 80 },
  { name: "Volleyball 8U", gender: "Coed", min: 7, max: 8, fee: 80 },
  { name: "Volleyball 10U", gender: "Coed", min: 9, max: 10, fee: 80 },
  { name: "Volleyball 12U", gender: "Coed", min: 11, max: 12, fee: 80 },
];

export const SEED_SEASONS: Season[] = [
  {
    id: "s1", name: "2026 Spring Sports",
    description: "Registration open Jan 20 through Feb 28, 2026",
    status: "active",
    programs: SEASON.programs
  },
  {
    id: "s2", name: "2025 Fall Sports",
    description: "Registration closed",
    status: "inactive",
    programs: [
      { id: "pg-f1", name: "Soccer 6U", gender: "Coed", ageAsOfDate: null, min: 5, max: 6, fee: 65, closed: false },
      { id: "pg-f2", name: "Soccer 8U Boys", gender: "Male", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-f3", name: "Soccer 8U Girls", gender: "Female", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-f4", name: "8U Baseball", gender: "Male", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-f5", name: "10U Baseball", gender: "Male", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-f6", name: "12U Baseball", gender: "Male", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
      { id: "pg-f7", name: "8U Softball", gender: "Female", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-f8", name: "10U Softball", gender: "Female", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-f9", name: "12U Softball", gender: "Female", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
    ]
  },
  {
    id: "s3", name: "2025-2026 Winter Sports",
    description: "Registration closed",
    status: "inactive",
    programs: [
      { id: "pg-w1", name: "Basketball 6U", gender: "Coed", ageAsOfDate: null, min: 5, max: 6, fee: 65, closed: false },
      { id: "pg-w2", name: "Basketball 8U Boys", gender: "Male", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-w3", name: "Basketball 10U Boys", gender: "Male", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-w4", name: "Basketball 12U Boys", gender: "Male", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
      { id: "pg-w5", name: "Basketball 15U Boys", gender: "Male", ageAsOfDate: null, min: 13, max: 15, fee: 80, closed: false },
      { id: "pg-w6", name: "Basketball 8U Girls", gender: "Female", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-w7", name: "Basketball 10U Girls", gender: "Female", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-w8", name: "Basketball 12U Girls", gender: "Female", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
      { id: "pg-w9", name: "Volleyball 8U", gender: "Coed", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-w10", name: "Volleyball 10U", gender: "Coed", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-w11", name: "Volleyball 12U", gender: "Coed", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
    ]
  }
];

export const INIT_PLAYERS: Player[] = [
  {id:"p1",firstName:"Ethan",middleName:"James",lastName:"Carter",dob:"2016-06-15",gender:"Male"},
  {id:"p2",firstName:"Lily",middleName:"",lastName:"Carter",dob:"2018-03-22",gender:"Female"},
  {id:"p3",firstName:"Owen",middleName:"Michael",lastName:"Carter",dob:"2022-01-10",gender:"Male"},
];

export const CURRENT_USER: CurrentUser = {
  firstName: "Sarah", lastName: "Carter", phone: "(555) 867-5309",
  secondaryGuardian: { firstName: "John", lastName: "Carter", phone: "(555) 555-1234" }
};

export const REGS: AdminRegistration[] = [
  {id:"r1",player:"Ethan Carter",gender:"Male",dob:"2016-08-04",program:"10U Baseball",parent:"Sarah Carter",email:"sarah@email.com",primaryContact:"(919) 555-0142",fee:80,status:"Completed",date:"2026-02-10 2:30 PM",hat:"L/XL",jersey:"Youth L",digitalPic:true,extraHat:null,coaching:"Not Interested",sponsorship:"No",total:90},
  {id:"r2",player:"Lily Carter",gender:"Female",dob:"2018-04-11",program:"8U Softball",parent:"Sarah Carter",email:"sarah@email.com",primaryContact:"(919) 555-0142",fee:80,status:"Completed",date:"2026-02-10 3:15 PM",hat:"XS/SM",jersey:"Youth M",digitalPic:false,extraHat:"SM/M",coaching:"Not Interested",sponsorship:"No",total:110},
  {id:"r3",player:"Mason Brooks",gender:"Male",dob:"2013-07-19",program:"12U Baseball",parent:"Tom Brooks",email:"tom@email.com",primaryContact:"(984) 555-0237",fee:80,status:"Pending",date:"2026-02-11 9:45 AM",hat:"L/XL",jersey:"Youth XL",digitalPic:true,extraHat:"L/XL",coaching:"Coach",sponsorship:"Yes",total:120},
  {id:"r4",player:"Ava Brooks",gender:"Female",dob:"2015-09-03",program:"10U Softball",parent:"Tom Brooks",email:"tom@email.com",primaryContact:"(984) 555-0237",fee:80,status:"Completed",date:"2026-02-11 10:20 AM",hat:"SM/M",jersey:"Youth M",digitalPic:true,extraHat:null,coaching:"Assistant Coach",sponsorship:"No",total:90},
  {id:"r5",player:"Noah Kim",gender:"Male",dob:"2022-05-28",program:"T-Ball",parent:"Grace Kim",email:"grace@email.com",primaryContact:"(704) 555-0381",fee:65,status:"Completed",date:"2026-02-12 1:00 PM",hat:"XS/SM",jersey:"Youth S",digitalPic:false,extraHat:null,coaching:"Not Interested",sponsorship:"No",total:65},
  {id:"r6",player:"Emma Davis",gender:"Female",dob:"2020-11-14",program:"T-Shirt",parent:"Mike Davis",email:"mike@email.com",primaryContact:"(336) 555-0194",fee:65,status:"Pending",date:"2026-02-13 11:30 AM",hat:"XS/SM",jersey:"Youth S",digitalPic:true,extraHat:null,coaching:"Not Interested",sponsorship:"Yes",total:75},
  {id:"r7",player:"Liam Johnson",gender:"Male",dob:"2018-06-15",program:"8U Baseball",parent:"Amy Johnson",email:"amy@email.com",primaryContact:"(919) 555-0456",fee:80,status:"Completed",date:"2026-02-13 4:05 PM",hat:"SM/M",jersey:"Youth M",digitalPic:false,extraHat:null,coaching:"Coach",sponsorship:"No",total:80},
  {id:"r8",player:"Sophie Turner",gender:"Female",dob:"2013-10-22",program:"12U Softball",parent:"Jane Turner",email:"jane@email.com",primaryContact:"(984) 555-0512",fee:80,status:"Completed",date:"2026-02-14 8:50 AM",hat:"L/XL",jersey:"Youth L",digitalPic:true,extraHat:"L/XL",coaching:"Not Interested",sponsorship:"No",total:120},
  {id:"r9",player:"Jake Miller",gender:"Male",dob:"2018-01-30",program:"8U Baseball",parent:"Chris Miller",email:"chris@email.com",primaryContact:"(704) 555-0673",fee:80,status:"Completed",date:"2026-02-14 2:10 PM",hat:"XS/SM",jersey:"Youth S",digitalPic:false,extraHat:null,coaching:"Assistant Coach",sponsorship:"Yes",total:80},
  {id:"r10",player:"Mia Wilson",gender:"Female",dob:"2021-08-16",program:"T-Ball",parent:"Dan Wilson",email:"dan@email.com",primaryContact:"(336) 555-0728",fee:65,status:"Completed",date:"2026-02-15 12:30 PM",hat:"SM/M",jersey:"Youth S",digitalPic:true,extraHat:"XS/SM",coaching:"Not Interested",sponsorship:"No",total:105},
];

export const ADMIN_COLS: AdminColumn[] = [
  {id:"player",label:"Player",default:true},
  {id:"gender",label:"Gender",default:true},
  {id:"age",label:"Age",default:true},
  {id:"program",label:"Program",default:true},
  {id:"parent",label:"Parent/Guardian",default:true},
  {id:"hat",label:"Hat",default:false},
  {id:"jersey",label:"Jersey",default:false},
  {id:"pic",label:"Pic",default:false},
  {id:"extraHat",label:"Extra Hat",default:false},
  {id:"coaching",label:"Coaching",default:false},
  {id:"status",label:"Status",default:false},
  {id:"primaryContact",label:"Primary Contact",default:true},
  {id:"sponsorship",label:"Sponsorship",default:false},
  {id:"total",label:"Total",default:true},
  {id:"date",label:"Date",default:true},
];
