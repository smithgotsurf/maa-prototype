import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEASON, HATS, JERSEYS, COACH_SHIRTS, CURRENT_USER } from './data';
import { fullName, age, fmtDate, recommended, otherPrograms, calcTotal, Ic, icons } from './utils';
import { useAppContext } from './context/AppContext';
import type { Player, Program } from './types';

function AddModal({ onAdd, onClose }: { onAdd: (p: Player) => void; onClose: () => void }) {
  const [f, sF] = useState({ fn: '', mn: '', ln: '', dob: '', g: '' });
  const ok = f.fn && f.ln && f.dob && f.g;
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold mb-4">Add Child</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-3">
            <label className="label label-text text-xs font-semibold">First Name</label>
            <input className="input input-bordered w-full input-sm" value={f.fn} onChange={(e) => sF({ ...f, fn: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="label label-text text-xs font-semibold">Middle Name</label>
            <input className="input input-bordered w-full input-sm" value={f.mn} onChange={(e) => sF({ ...f, mn: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-3">
            <label className="label label-text text-xs font-semibold">Last Name</label>
            <input className="input input-bordered w-full input-sm" value={f.ln} onChange={(e) => sF({ ...f, ln: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="label label-text text-xs font-semibold">Gender</label>
            <select className="select select-bordered w-full select-sm" value={f.g} onChange={(e) => sF({ ...f, g: e.target.value })}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="label label-text text-xs font-semibold">Date of Birth</label>
          <input type="date" className="input input-bordered w-full input-sm" value={f.dob} onChange={(e) => sF({ ...f, dob: e.target.value })} />
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!ok} onClick={() => { onAdd({ id: `p-${Date.now()}`, firstName: f.fn, middleName: f.mn, lastName: f.ln, dob: f.dob, gender: f.g as 'Male' | 'Female' }); onClose(); }}>
            <Ic d={icons.plus} s={13} /> Add
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}

function ProgCard({ p, pl, isRec, selected, onSelect }: { p: Program; pl: Player; isRec: boolean; selected: boolean; onSelect: (p: Program) => void }) {
  const ageText = p.ageAsOfDate
    ? `${pl.firstName} is ${age(pl.dob, p.ageAsOfDate)} as of ${fmtDate(p.ageAsOfDate)}`
    : `${pl.firstName} is ${age(pl.dob, null)} years old`;
  const nameCell = (
    <>
      <h4 className="font-semibold text-sm">
        {p.name}
        {isRec && <span className="badge badge-success badge-sm ml-2">Recommended</span>}
        {p.closed && <span className="badge badge-error badge-sm ml-2">CLOSED</span>}
      </h4>
      <p className="text-xs text-gray-500">Ages {p.min}–{p.max} · {ageText}</p>
    </>
  );
  if (p.closed)
    return (
      <div className="card border-2 border-base-300 p-3 mb-2 opacity-40 cursor-not-allowed pointer-events-none relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>{nameCell}</div>
          <span className="font-bold text-sm">${p.fee}</span>
        </div>
        <div className="absolute top-3.5 -right-7 w-24 bg-error text-white text-[10px] font-extrabold text-center py-1 rotate-45 tracking-wider uppercase shadow">FULL</div>
      </div>
    );
  return (
    <div className={`card border-2 p-3 mb-2 cursor-pointer transition-colors ${selected ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary hover:bg-primary/5'}`} onClick={() => onSelect(p)}>
      <div className="flex items-center justify-between">
        <div>{nameCell}</div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">${p.fee}</span>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-primary bg-primary text-white' : 'border-base-300'}`}>
            {selected && <Ic d={icons.chk} s={12} />}
          </div>
        </div>
      </div>
    </div>
  );
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">{children}</div>
);

const RequiredLabel = () => <span className="text-error text-[10px] ml-1">Required</span>;

const OptCard = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <div className={`card border-2 p-3 mb-2 cursor-pointer transition-colors ${selected ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary hover:bg-primary/5'}`} onClick={onClick}>
    <div className="flex items-center justify-between">
      <div>{children}</div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-primary bg-primary text-white' : 'border-base-300'}`}>
        {selected && <Ic d={icons.chk} s={12} />}
      </div>
    </div>
  </div>
);

const SizeBtn = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline'}`} onClick={onClick}>{label}</button>
);

export function RegPage() {
  const { players, addPlayer, addToCart, activeSeason } = useAppContext();
  const navigate = useNavigate();
  const [step, sStep] = useState(1);
  const [pl, sPl] = useState<Player | null>(null);
  const [pr, sPr] = useState<Program | null>(null);
  const [wv, sWv] = useState<Partial<Record<string, string>>>({});
  const [hat, sHat] = useState('');
  const [jer, sJer] = useState('');
  const [showAdd, sShowAdd] = useState(false);
  const [digitalPic, setDigitalPic] = useState(false);
  const [extraHat, setExtraHat] = useState(false);
  const [extraHatSize, setExtraHatSize] = useState('');
  const [coaching, setCoaching] = useState('');
  const [sponsorship, setSponsorship] = useState('');
  const [coachShirtSize, setCoachShirtSize] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [activeWaiver, setActiveWaiver] = useState(0);
  const [hasMedical, setHasMedical] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [gPri, setGPri] = useState({ fn: CURRENT_USER.firstName, ln: CURRENT_USER.lastName, ph: CURRENT_USER.phone });
  const [gSec, setGSec] = useState({ fn: CURRENT_USER.secondaryGuardian.firstName, ln: CURRENT_USER.secondaryGuardian.lastName, ph: CURRENT_USER.secondaryGuardian.phone });
  const [hasSec, setHasSec] = useState(true);
  const [priContact, setPriContact] = useState('');
  if (!activeSeason)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card bg-base-100 border border-base-300 p-8 text-center">
          <h2 className="text-xl font-bold">Registration Not Open</h2>
          <p className="text-gray-500">There is no active season at this time. Check back soon!</p>
        </div>
      </div>
    );
  const rec = pl ? recommended(pl, activeSeason.programs) : [];
  const other = pl ? otherPrograms(pl, activeSeason.programs) : [];
  const applicableWaivers = SEASON.waivers.filter((w) => !w.coachOnly || coaching === 'Coach' || coaching === 'Assistant Coach');
  const wvOk = applicableWaivers.filter((w) => w.required).every((w) => wv[w.id]?.trim());
  const szOk = hat && jer;
  const labels = ['Player', 'Program', 'Guardian', 'Sizes', 'Interest', 'Medical', 'Waivers', 'Review'];
  function submit() {
    addToCart({
      id: `c-${Date.now()}`, player: pl!, program: pr!, hat, jersey: jer,
      guardian: { primary: { firstName: gPri.fn, lastName: gPri.ln, phone: gPri.ph }, secondary: hasSec ? { firstName: gSec.fn, lastName: gSec.ln, phone: gSec.ph } : null, primaryContactPhone: priContact === 'primary' ? gPri.ph : gSec.ph },
      digitalPicture: digitalPic, extraHat: extraHat ? { size: extraHatSize } : null,
      coaching, coachShirtSize: (coaching === 'Coach' || coaching === 'Assistant Coach') ? coachShirtSize : null,
      sponsorship, sponsorName: sponsorship === 'Yes' ? sponsorName : null,
      medical: hasMedical === 'Yes' ? { allergies: allergies || null, info: medicalInfo || null } : null,
      total: calcTotal(pr!, digitalPic, extraHat),
    });
    sStep(1); sPl(null); sPr(null); sWv({}); sHat(''); sJer(''); setPriContact('');
    setDigitalPic(false); setExtraHat(false); setExtraHatSize(''); setCoaching(''); setSponsorship('');
    setCoachShirtSize(''); setSponsorName(''); setActiveWaiver(0);
    setHasMedical(''); setAllergies(''); setMedicalInfo('');
    navigate('/cart');
  }


  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4 md:hidden">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > 0 ? 'bg-primary text-primary-content' : 'bg-base-300'}`}>{step}</div>
        <span className="text-sm">Step {step} of {labels.length} &mdash; {labels[step - 1]}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
        <aside className="hidden md:block">
          <ul className="steps steps-vertical">
            {labels.map((l, i) => (
              <li key={i} className={`step ${step > i + 1 ? 'step-primary' : step === i + 1 ? 'step-primary' : ''}`}>{l}</li>
            ))}
          </ul>
        </aside>
        <div>
          {pl && step > 1 && (
            <h2 className="text-lg font-bold mb-4 text-primary">
              Registering: {fullName(pl)} &ndash; Age: {age(pl.dob, null)}
            </h2>
          )}
          {step === 1 && (
            <div className="card bg-base-100 border border-base-300 p-5">
              <h2 className="text-xl font-bold mb-1">Select Player</h2>
              <p className="text-sm text-gray-500 mb-4">Choose which child to register for {activeSeason.name}.</p>
              {players.map((p) => (
                <OptCard key={p.id} selected={pl?.id === p.id} onClick={() => sPl(p)}>
                  <h4 className="font-semibold text-sm">{fullName(p)}</h4>
                  <p className="text-xs text-gray-500">DOB: {fmtDate(p.dob)} · Age: {age(p.dob, null)} · {p.gender}</p>
                </OptCard>
              ))}
              <button className="btn btn-outline btn-sm mt-2" onClick={() => sShowAdd(true)}>
                <Ic d={icons.plus} s={13} /> Add Child
              </button>
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-neutral" disabled={!pl} onClick={() => { sPr(null); sStep(2); }}>
                  Continue <Ic d={icons.chev} s={13} />
                </button>
              </div>
              {showAdd && <AddModal onAdd={addPlayer} onClose={() => sShowAdd(false)} />}
            </div>
          )}
          {step === 2 && pl && (
            <div className="card bg-base-100 border border-base-300 p-5">
              <h2 className="text-xl font-bold mb-1">Select Program</h2>
              <p className="text-sm text-gray-500 mb-4">Programs for {pl.firstName} ({pl.gender}).</p>
              {rec.length > 0 && (
                <>
                  <div className="text-[11px] font-semibold text-success uppercase tracking-wider mb-1.5">Recommended for {pl.firstName}</div>
                  {rec.map((p) => <ProgCard key={p.id} p={p} pl={pl} isRec={true} selected={pr?.id === p.id} onSelect={sPr} />)}
                </>
              )}
              {other.length > 0 && (
                <>
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-3.5 mb-1.5">Other Programs</div>
                  {other.map((p) => <ProgCard key={p.id} p={p} pl={pl} isRec={false} selected={pr?.id === p.id} onSelect={sPr} />)}
                </>
              )}
              {activeSeason.programs.length === 0 && <p className="text-error p-3.5">No programs available this season.</p>}
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => sStep(1)}>Back</button>
                <button className="btn btn-neutral" disabled={!pr || !!pr.closed} onClick={() => sStep(3)}>Continue <Ic d={icons.chev} s={13} /></button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="card bg-base-100 border border-base-300 p-5">
              <h2 className="text-xl font-bold mb-1">Parent/Guardian & Contact</h2>
              <p className="text-sm text-gray-500 mb-4">Confirm contact information for this registration.</p>
              <SectionLabel>Primary Guardian</SectionLabel>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-3"><label className="label label-text text-xs font-semibold">First Name</label><input className="input input-bordered w-full input-sm" value={gPri.fn} onChange={(e) => setGPri({ ...gPri, fn: e.target.value })} /></div>
                <div className="mb-3"><label className="label label-text text-xs font-semibold">Last Name</label><input className="input input-bordered w-full input-sm" value={gPri.ln} onChange={(e) => setGPri({ ...gPri, ln: e.target.value })} /></div>
              </div>
              <div className="mb-3"><label className="label label-text text-xs font-semibold">Phone</label><input className="input input-bordered w-full input-sm" value={gPri.ph} onChange={(e) => setGPri({ ...gPri, ph: e.target.value })} /></div>
              <div className="mt-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer" onClick={() => setHasSec(!hasSec)}>
                  <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={hasSec} readOnly />
                  <span className="text-sm">Add secondary guardian</span>
                </label>
              </div>
              {hasSec && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-3"><label className="label label-text text-xs font-semibold">First Name</label><input className="input input-bordered w-full input-sm" value={gSec.fn} onChange={(e) => setGSec({ ...gSec, fn: e.target.value })} /></div>
                    <div className="mb-3"><label className="label label-text text-xs font-semibold">Last Name</label><input className="input input-bordered w-full input-sm" value={gSec.ln} onChange={(e) => setGSec({ ...gSec, ln: e.target.value })} /></div>
                  </div>
                  <div className="mb-3"><label className="label label-text text-xs font-semibold">Phone</label><input className="input input-bordered w-full input-sm" value={gSec.ph} onChange={(e) => setGSec({ ...gSec, ph: e.target.value })} /></div>
                </>
              )}
              <SectionLabel>Primary Contact Phone</SectionLabel>
              <OptCard selected={priContact === 'primary'} onClick={() => setPriContact('primary')}>
                <h4 className="font-semibold text-sm">{gPri.fn} {gPri.ln}</h4>
                <p className="text-xs text-gray-500">{gPri.ph}</p>
              </OptCard>
              {hasSec && gSec.fn && (
                <OptCard selected={priContact === 'secondary'} onClick={() => setPriContact('secondary')}>
                  <h4 className="font-semibold text-sm">{gSec.fn} {gSec.ln}</h4>
                  <p className="text-xs text-gray-500">{gSec.ph}</p>
                </OptCard>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => sStep(2)}>Back</button>
                <button className="btn btn-neutral" disabled={!gPri.fn || !gPri.ln || !gPri.ph || !priContact} onClick={() => sStep(4)}>Continue <Ic d={icons.chev} s={13} /></button>
              </div>
            </div>
          )}
          {step === 4 && pl && (
            <div className="card bg-base-100 border border-base-300 p-5">
              <h2 className="text-xl font-bold mb-1">Hat & Jersey Size</h2>
              <p className="text-sm text-gray-500 mb-4">Select {pl.firstName}'s sizing for this season.</p>
              <div className="mb-5">
                <div className="font-semibold text-sm mb-1">Hat Size</div>
                <div className="text-xs text-gray-500 mb-2">Fitted cap — included with registration</div>
                <div className="flex flex-wrap gap-2">{HATS.map((s) => <SizeBtn key={s} label={s} selected={hat === s} onClick={() => sHat(s)} />)}</div>
              </div>
              <div className="mb-5">
                <div className="font-semibold text-sm mb-1">Jersey Size</div>
                <div className="text-xs text-gray-500 mb-2">Dri-Fit style game day jersey</div>
                <div className="flex flex-wrap gap-2">{JERSEYS.map((s) => <SizeBtn key={s} label={s} selected={jer === s} onClick={() => sJer(s)} />)}</div>
              </div>
              <SectionLabel>Optional Add-ons</SectionLabel>
              <div className="mb-3.5">
                <div className="font-semibold text-[13px] mb-0.5">Digital Picture Package — $10</div>
                <div className="text-xs text-gray-500 mb-1.5">Team and individual picture delivered via email</div>
                <div className="flex gap-2">
                  <SizeBtn label="No" selected={!digitalPic} onClick={() => setDigitalPic(false)} />
                  <SizeBtn label="Yes (+$10)" selected={digitalPic} onClick={() => setDigitalPic(true)} />
                </div>
              </div>
              <div>
                <div className="font-semibold text-[13px] mb-0.5">Extra Hat — $30</div>
                <div className="text-xs text-gray-500 mb-1.5">Purchase one additional hat</div>
                <div className="flex gap-2">
                  <SizeBtn label="No" selected={!extraHat} onClick={() => { setExtraHat(false); setExtraHatSize(''); }} />
                  <SizeBtn label="Yes (+$30)" selected={extraHat} onClick={() => setExtraHat(true)} />
                </div>
                {extraHat && <div className="mt-2"><label className="text-xs font-semibold">Extra Hat Size</label><div className="flex flex-wrap gap-2 mt-1">{HATS.map((s) => <SizeBtn key={s} label={s} selected={extraHatSize === s} onClick={() => setExtraHatSize(s)} />)}</div></div>}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => sStep(3)}>Back</button>
                <button className="btn btn-neutral" disabled={!szOk || (extraHat && !extraHatSize)} onClick={() => sStep(5)}>Continue <Ic d={icons.chev} s={13} /></button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="card bg-base-100 border border-base-300 p-5">
              <h2 className="text-xl font-bold mb-1">Coaching & Sponsorship</h2>
              <p className="text-sm text-gray-500 mb-4">Let us know if you're interested in helping out.</p>
              <SectionLabel>Coaching Interest<RequiredLabel /></SectionLabel>
              <OptCard selected={coaching === 'Coach'} onClick={() => setCoaching('Coach')}><h4 className="font-semibold text-sm">Coach</h4><p className="text-xs text-gray-500">Lead a team as head coach</p></OptCard>
              <OptCard selected={coaching === 'Assistant Coach'} onClick={() => setCoaching('Assistant Coach')}><h4 className="font-semibold text-sm">Assistant Coach</h4><p className="text-xs text-gray-500">Help out as an assistant</p></OptCard>
              <OptCard selected={coaching === 'Not Interested'} onClick={() => { setCoaching('Not Interested'); setCoachShirtSize(''); }}><h4 className="font-semibold text-sm">Not Interested</h4><p className="text-xs text-gray-500">Not at this time</p></OptCard>
              {(coaching === 'Coach' || coaching === 'Assistant Coach') && (
                <div className="mt-4"><SectionLabel>Adult Shirt Size<RequiredLabel /></SectionLabel><div className="flex flex-wrap gap-2">{COACH_SHIRTS.map((s) => <SizeBtn key={s} label={s} selected={coachShirtSize === s} onClick={() => setCoachShirtSize(s)} />)}</div></div>
              )}
              <div className="mt-4"><SectionLabel>Sponsorship Interest<RequiredLabel /></SectionLabel></div>
              <OptCard selected={sponsorship === 'Yes'} onClick={() => setSponsorship('Yes')}><h4 className="font-semibold text-sm">Yes, I'm interested</h4><p className="text-xs text-gray-500">We'll send you sponsorship information</p></OptCard>
              <OptCard selected={sponsorship === 'No'} onClick={() => { setSponsorship('No'); setSponsorName(''); }}><h4 className="font-semibold text-sm">No thanks</h4></OptCard>
              {sponsorship === 'Yes' && <div className="mt-3"><label className="label label-text text-xs font-semibold">Sponsor / Business Name</label><input className="input input-bordered w-full input-sm" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} placeholder="Enter business or sponsor name" /></div>}
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => sStep(4)}>Back</button>
                <button className="btn btn-neutral" disabled={!coaching || !sponsorship || ((coaching === 'Coach' || coaching === 'Assistant Coach') && !coachShirtSize) || (sponsorship === 'Yes' && !sponsorName)} onClick={() => sStep(6)}>Continue <Ic d={icons.chev} s={13} /></button>
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="card bg-base-100 border border-base-300 p-5">
              <h2 className="text-xl font-bold mb-1">Medical Information</h2>
              <p className="text-sm text-gray-500 mb-4">Let us know about any medical conditions or health concerns.</p>
              <SectionLabel>Are there any medical conditions or health concerns (including allergies) we should be aware of?<RequiredLabel /></SectionLabel>
              <OptCard selected={hasMedical === 'Yes'} onClick={() => setHasMedical('Yes')}><h4 className="font-semibold text-sm">Yes</h4></OptCard>
              <OptCard selected={hasMedical === 'No'} onClick={() => { setHasMedical('No'); setAllergies(''); setMedicalInfo(''); }}><h4 className="font-semibold text-sm">No</h4></OptCard>
              {hasMedical === 'Yes' && (
                <>
                  <div className="mt-3"><label className="label label-text text-xs font-semibold">Allergies</label><input className="input input-bordered w-full input-sm" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="List any allergies" /></div>
                  <div className="mt-3"><label className="label label-text text-xs font-semibold">Any important medical information that we need to be made aware of</label><textarea className="textarea textarea-bordered w-full" value={medicalInfo} onChange={(e) => setMedicalInfo(e.target.value)} placeholder="Describe any medical conditions or health concerns" rows={4} /></div>
                </>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => sStep(5)}>Back</button>
                <button className="btn btn-neutral" disabled={!hasMedical || (hasMedical === 'Yes' && !allergies.trim() && !medicalInfo.trim())} onClick={() => { setActiveWaiver(0); sStep(7); }}>Continue <Ic d={icons.chev} s={13} /></button>
              </div>
            </div>
          )}
          {step === 7 && (
            <div className="card bg-base-100 border border-base-300 p-5">
              <h2 className="text-xl font-bold mb-1">Waivers & Agreements</h2>
              <p className="text-sm text-gray-500 mb-4">Review and acknowledge the following.</p>
              {applicableWaivers.map((w, idx) => {
                const firstId = applicableWaivers[0].id;
                const firstInit = wv[firstId]?.trim();
                return (
                  <div className="border border-base-300 rounded-lg mb-2" key={w.id}>
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-base-200 rounded-lg" onClick={() => setActiveWaiver(activeWaiver === idx ? -1 : idx)}>
                      <h4 className="font-semibold text-sm">{w.title}{w.required && <span className="text-error text-[10px] ml-1">Required</span>}</h4>
                      <div className="flex items-center gap-1.5">
                        {wv[w.id]?.trim() && <div className="w-4 h-4 rounded-full bg-success text-white flex items-center justify-center"><Ic d={icons.chk} s={10} /></div>}
                        <span className="text-gray-400">{activeWaiver === idx ? '▾' : '▸'}</span>
                      </div>
                    </div>
                    {activeWaiver === idx && (
                      <>
                        <div className="px-3 pb-3 text-xs max-h-48 overflow-y-auto border-t border-base-300 pt-2" dangerouslySetInnerHTML={{ __html: w.content }} />
                        <div className="flex items-center gap-2 px-3 pb-3">
                          <span className="text-xs text-gray-500">Type your initials to acknowledge</span>
                          <input className="input input-bordered input-sm w-24" value={wv[w.id] || ''} onChange={(e) => sWv((p) => ({ ...p, [w.id]: e.target.value }))} />
                          {idx > 0 && firstInit && !wv[w.id]?.trim() && (
                            <button className="btn btn-ghost btn-xs" onClick={() => sWv((p) => ({ ...p, [w.id]: firstInit }))}>Copy initials</button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => sStep(6)}>Back</button>
                <button className="btn btn-neutral" disabled={!wvOk} onClick={() => sStep(8)}>Continue <Ic d={icons.chev} s={13} /></button>
              </div>
            </div>
          )}
          {step === 8 && (
            <div className="card bg-base-100 border border-base-300 p-5">
              <h2 className="text-xl font-bold mb-1">Review Registration</h2>
              <p className="text-sm text-gray-500 mb-4">Confirm details before adding to cart.</p>
              <table className="table table-sm">
                <tbody>
                  <tr><td className="font-semibold">Player</td><td>{fullName(pl!)}</td></tr>
                  <tr><td className="font-semibold">Date of Birth</td><td>{fmtDate(pl!.dob)}</td></tr>
                  <tr><td className="font-semibold">Program</td><td>{pr!.name}</td></tr>
                  <tr><td className="font-semibold">Age</td><td>{age(pl!.dob, pr!.ageAsOfDate)} years old{pr!.ageAsOfDate ? ` (as of ${fmtDate(pr!.ageAsOfDate)})` : ''}</td></tr>
                  <tr><td className="font-semibold">Primary Guardian</td><td>{gPri.fn} {gPri.ln} — {gPri.ph}</td></tr>
                  {hasSec && <tr><td className="font-semibold">Secondary Guardian</td><td>{gSec.fn} {gSec.ln} — {gSec.ph}</td></tr>}
                  <tr><td className="font-semibold">Primary Contact</td><td>{priContact === 'primary' ? gPri.ph : gSec.ph}</td></tr>
                  <tr><td className="font-semibold">Hat Size</td><td>{hat}</td></tr>
                  <tr><td className="font-semibold">Jersey Size</td><td>{jer}</td></tr>
                  <tr><td className="font-semibold">Digital Picture</td><td>{digitalPic ? 'Yes (+$10)' : 'No'}</td></tr>
                  <tr><td className="font-semibold">Extra Hat</td><td>{extraHat ? `${extraHatSize} (+$30)` : 'No'}</td></tr>
                  <tr><td className="font-semibold">Coaching</td><td>{coaching}</td></tr>
                  {(coaching === 'Coach' || coaching === 'Assistant Coach') && <tr><td className="font-semibold">Coach Shirt Size</td><td>{coachShirtSize}</td></tr>}
                  <tr><td className="font-semibold">Sponsorship</td><td>{sponsorship === 'Yes' ? 'Yes' : 'No'}</td></tr>
                  {sponsorship === 'Yes' && <tr><td className="font-semibold">Sponsor Name</td><td>{sponsorName}</td></tr>}
                  <tr><td className="font-semibold">Medical Conditions</td><td>{hasMedical === 'Yes' ? 'Yes' : 'No'}</td></tr>
                  {hasMedical === 'Yes' && allergies && <tr><td className="font-semibold">Allergies</td><td>{allergies}</td></tr>}
                  {hasMedical === 'Yes' && medicalInfo && <tr><td className="font-semibold">Medical Info</td><td>{medicalInfo}</td></tr>}
                  <tr><td className="font-semibold">Waivers</td><td>{applicableWaivers.map((w) => `${w.title} (${wv[w.id]})`).join(', ')}</td></tr>
                </tbody>
              </table>
              <div className="border-t border-base-300 mt-3 pt-3">
                <div className="flex justify-between text-sm mb-1"><span>Registration Fee</span><span>${pr!.fee}.00</span></div>
                {digitalPic && <div className="flex justify-between text-sm mb-1 text-gray-500"><span>Digital Picture</span><span>+$10.00</span></div>}
                {extraHat && <div className="flex justify-between text-sm mb-1 text-gray-500"><span>Extra Hat</span><span>+$30.00</span></div>}
                <div className="flex justify-between text-sm font-bold border-t border-base-300 pt-2 mt-1"><span>Total</span><span className="text-primary">${calcTotal(pr!, digitalPic, extraHat)}.00</span></div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => sStep(7)}>Back</button>
                <button className="btn btn-primary" onClick={submit}><Ic d={icons.cart} s={14} /> Add to Cart</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CartPage() {
  const { cart, removeFromCart, clearCart } = useAppContext();
  const navigate = useNavigate();
  const total = cart.reduce((s, i) => s + (i.total || i.program.fee), 0);
  const [done, sDone] = useState(false);
  if (done)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card bg-success/10 border border-success p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-success text-white flex items-center justify-center mx-auto mb-4"><Ic d={icons.chk} s={28} /></div>
          <h2 className="text-xl font-bold">Registration Submitted!</h2>
          <p className="text-sm text-gray-600 mt-2">Your registration has been submitted. Payment details will be communicated separately by the MAA board.</p>
          <button className="btn btn-neutral mt-5" onClick={() => { sDone(false); clearCart(); navigate('/'); }}>Return Home</button>
        </div>
      </div>
    );
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-0.5">Your Cart</h2>
        <p className="text-sm text-gray-500 mb-5">{cart.length === 0 ? 'Your cart is empty.' : `${cart.length} registration${cart.length !== 1 ? 's' : ''} ready to submit.`}</p>
        {cart.map((i) => (
          <div className="card border border-base-300 p-4 mb-3" key={i.id}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{fullName(i.player)}</h4>
                <p className="text-sm text-gray-500">
                  {i.program.name} · Hat: {i.hat} · Jersey: {i.jersey}
                  {i.digitalPicture && ' · Digital Pic'}
                  {i.extraHat && ` · Extra Hat (${i.extraHat.size})`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">${i.total || i.program.fee}.00</span>
                <button className="btn btn-error btn-ghost btn-sm" onClick={() => removeFromCart(i.id)}><Ic d={icons.trash} s={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {cart.length > 0 && (
          <>
            <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-base-300">
              <span>Total Due</span><span className="text-primary">${total}.00</span>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline" onClick={() => navigate('/register')}>Register Another</button>
              <button className="btn btn-primary" onClick={() => sDone(true)}>Complete Registration</button>
            </div>
          </>
        )}
        {cart.length === 0 && (
          <div className="text-center py-8">
            <button className="btn btn-neutral" onClick={() => navigate('/register')}>Start Registration</button>
          </div>
        )}
      </div>
    </div>
  );
}
