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
  const [name, setName] = useState(season?.name || '');
  const [desc, setDesc] = useState(season?.description || '');
  const [programs, setPrograms] = useState<Program[]>(season?.programs ? season.programs.map((p) => ({ ...p })) : []);

  const addProgram = () => {
    setPrograms((prev) => [...prev, { id: `pg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', gender: 'Coed', ageAsOfDate: null, min: 3, max: 4, fee: 65, closed: false }]);
  };
  const updateProgram = (id: string, field: string, value: string | number | boolean | null) => {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };
  const removeProgram = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  };
  const applyDefaults = (id: string, sportName: string) => {
    const type = sportTypes.find((t: SportType) => t.name === sportName);
    if (type) {
      setPrograms((prev) => prev.map((p) => p.id === id ? { ...p, name: sportName, gender: type.gender, min: type.min, max: type.max, fee: type.fee } : p));
    } else {
      updateProgram(id, 'name', sportName);
    }
  };

  return (
    <>
      <button className="btn btn-ghost mb-3.5" onClick={onCancel}>← Back to Seasons</button>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{season ? 'Edit Season' : 'New Season'}</h1>
      </div>
      <div className="card border border-base-300 p-5 mb-4">
        <div className="mb-3">
          <label className="label label-text text-xs font-semibold">Season Name</label>
          <input className="input input-bordered w-full input-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 2026 Fall Sports" />
        </div>
        <div className="mb-3">
          <label className="label label-text text-xs font-semibold">Description</label>
          <textarea className="textarea textarea-bordered w-full" value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="e.g. Registration open through Aug 15, 2026" />
        </div>
      </div>
      <div className="card border border-base-300 p-5">
        <div className="flex justify-between items-center mb-3">
          <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Programs ({programs.length})</div>
          <button className="btn btn-outline btn-sm" onClick={addProgram}><Ic d={icons.plus} s={11} /> Add Program</button>
        </div>
        {programs.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No programs yet. Click "Add Program" to get started.</p>}
        {programs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead><tr><th>Sport</th><th>Gender</th><th>Ages</th><th>Age As Of</th><th>Fee</th><th>Closed</th><th></th></tr></thead>
              <tbody>{programs.map((p) => (
                <tr key={p.id}>
                  <td><select className="select select-bordered select-xs w-full" value={p.name} onChange={(e) => applyDefaults(p.id, e.target.value)}><option value="">Select sport...</option>{sportTypes.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}</select></td>
                  <td><select className="select select-bordered select-xs" value={p.gender} onChange={(e) => updateProgram(p.id, 'gender', e.target.value)}><option>Coed</option><option>Male</option><option>Female</option></select></td>
                  <td><div className="flex gap-1 items-center"><input type="number" className="input input-bordered input-xs w-12" value={p.min} onChange={(e) => updateProgram(p.id, 'min', +e.target.value)} /><span>–</span><input type="number" className="input input-bordered input-xs w-12" value={p.max} onChange={(e) => updateProgram(p.id, 'max', +e.target.value)} /></div></td>
                  <td><input type="date" className="input input-bordered input-xs w-32" value={p.ageAsOfDate || ''} onChange={(e) => updateProgram(p.id, 'ageAsOfDate', e.target.value || null)} /></td>
                  <td><div className="flex items-center gap-0.5"><span className="text-xs text-gray-500">$</span><input type="number" className="input input-bordered input-xs w-16" value={p.fee} onChange={(e) => updateProgram(p.id, 'fee', +e.target.value)} /></div></td>
                  <td className="text-center"><input type="checkbox" className="checkbox checkbox-xs checkbox-primary" checked={!!p.closed} onChange={(e) => updateProgram(p.id, 'closed', e.target.checked)} /></td>
                  <td><button className="btn btn-error btn-ghost btn-xs" onClick={() => removeProgram(p.id)}><Ic d={icons.trash} s={13} /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" disabled={!name.trim()} onClick={() => onSave({ name, description: desc, programs })}>Save Season</button>
      </div>
    </>
  );
}

export default function AdminPage() {
  const [tab, sTab] = useState('dash');
  const [sf, sSf] = useState('All');
  const [stf, sStf] = useState('All');
  const [q, sQ] = useState('');
  const [visCols, setVisCols] = useState(() => ADMIN_COLS.filter((c) => c.default).map((c) => c.id));
  const [showColPicker, setShowColPicker] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const { seasons, activeSeason, addSeason, updateSeason, deleteSeason, activateSeason, deactivateSeason } = useAppContext();
  const [seasonView, setSeasonView] = useState<'list' | 'edit' | 'new'>('list');
  const [editSeasonId, setEditSeasonId] = useState<string | null>(null);
  const filt = REGS.filter((r) => {
    if (sf !== 'All' && r.program !== sf) return false;
    if (stf !== 'All' && r.status !== stf) return false;
    if (q && !r.player.toLowerCase().includes(q.toLowerCase()) && !r.parent.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const totalRev = REGS.reduce((s, r) => s + r.total, 0);
  const progCounts: Record<string, number> = {};
  (activeSeason?.programs || []).forEach((p) => { progCounts[p.name] = REGS.filter((r) => r.program === p.name).length; });
  const hatCounts: Record<string, number> = {};
  REGS.forEach((r) => { hatCounts[r.hat] = (hatCounts[r.hat] || 0) + 1; });
  const jerseyCounts: Record<string, number> = {};
  REGS.forEach((r) => { jerseyCounts[r.jersey] = (jerseyCounts[r.jersey] || 0) + 1; });
  const toggleCol = (id: string) => setVisCols((v) => (v.includes(id) ? v.filter((c) => c !== id) : [...v, id]));
  const vis = (id: string) => visCols.includes(id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
      <aside className="hidden md:block">
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Management</div>
        {[
          { id: 'dash', ic: icons.clip, l: 'Registrations' },
          { id: 'seasons', ic: icons.gear, l: 'Seasons' },
          { id: 'users', ic: icons.users, l: 'Users' },
        ].map((i) => (
          <button key={i.id} className={`btn btn-ghost btn-sm justify-start gap-2 w-full mb-1 ${tab === i.id ? 'btn-active' : ''}`} onClick={() => sTab(i.id)}>
            <Ic d={i.ic} s={15} />{i.l}
          </button>
        ))}
      </aside>
      <main>
        <div role="tablist" className="tabs tabs-bordered mb-4 md:hidden">
          {['dash', 'seasons', 'users'].map((t) => (
            <button key={t} role="tab" className={`tab ${tab === t ? 'tab-active' : ''}`} onClick={() => sTab(t)}>
              {t === 'dash' ? 'Registrations' : t === 'seasons' ? 'Seasons' : 'Users'}
            </button>
          ))}
        </div>
        {tab === 'dash' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Registration Dashboard</h1>
              <button className="btn btn-outline btn-sm"><Ic d={icons.dl} s={13} /> Export CSV</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="card border border-base-300 p-3 border-l-4 border-l-primary">
                <div className="text-[11px] text-gray-500 font-semibold">Total</div>
                <div className="text-2xl font-bold text-primary">{REGS.length}</div>
                <div className="text-[10px] text-gray-400">all programs</div>
              </div>
              {(activeSeason?.programs || []).map((p) => (
                <div className="card border border-base-300 p-3" key={p.id}>
                  <div className="text-[11px] text-gray-500 font-semibold">{p.name}</div>
                  <div className="text-2xl font-bold">{progCounts[p.name]}</div>
                  <div className="text-[10px] text-gray-400">registered</div>
                </div>
              ))}
              <div className="card border border-base-300 p-3 border-l-4 border-l-success">
                <div className="text-[11px] text-gray-500 font-semibold">Revenue</div>
                <div className="text-2xl font-bold text-primary">${totalRev.toLocaleString()}</div>
                <div className="text-[10px] text-gray-400">collected</div>
              </div>
            </div>
            <div className="mb-3.5"><button className="btn btn-outline btn-sm" onClick={() => setShowEquipModal(true)}>Equipment Summary</button></div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <select className="select select-bordered select-sm" value={sf} onChange={(e) => sSf(e.target.value)}>
                <option>All</option>
                {[...new Set(REGS.map((r) => r.program))].map((s) => <option key={s}>{s}</option>)}
              </select>
              <select className="select select-bordered select-sm" value={stf} onChange={(e) => sStf(e.target.value)}>
                <option>All</option><option>Completed</option><option>Pending</option>
              </select>
              <input className="input input-bordered input-sm" placeholder="Search player or parent..." value={q} onChange={(e) => sQ(e.target.value)} />
              <div className="relative ml-auto">
                <button className="btn btn-outline btn-sm" onClick={() => setShowColPicker(!showColPicker)}>Columns</button>
                {showColPicker && (
                  <div className="dropdown-content menu bg-base-100 rounded-box shadow p-2 w-52 absolute right-0 top-full mt-1 z-20 border border-base-300">
                    {ADMIN_COLS.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-base-200 rounded">
                        <input type="checkbox" className="checkbox checkbox-xs" checked={visCols.includes(c.id)} onChange={() => toggleCol(c.id)} />{c.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead><tr>
                  {vis('player') && <th>Player</th>}{vis('gender') && <th>Gender</th>}{vis('age') && <th>Age</th>}{vis('program') && <th>Program</th>}{vis('parent') && <th>Parent/Guardian</th>}{vis('hat') && <th>Hat</th>}{vis('jersey') && <th>Jersey</th>}{vis('pic') && <th>Pic</th>}{vis('extraHat') && <th>Extra Hat</th>}{vis('coaching') && <th>Coaching</th>}{vis('status') && <th>Status</th>}{vis('primaryContact') && <th>Primary Contact</th>}{vis('sponsorship') && <th>Sponsorship</th>}{vis('total') && <th>Total</th>}{vis('date') && <th>Date</th>}
                </tr></thead>
                <tbody>{filt.map((r) => (
                  <tr key={r.id}>
                    {vis('player') && <td className="font-semibold">{r.player}</td>}
                    {vis('gender') && <td>{r.gender}</td>}
                    {vis('age') && <td>{age(r.dob, null)}</td>}
                    {vis('program') && <td><span className="badge badge-ghost badge-sm">{r.program}</span></td>}
                    {vis('parent') && <td>{r.parent}</td>}
                    {vis('hat') && <td>{r.hat}</td>}
                    {vis('jersey') && <td>{r.jersey}</td>}
                    {vis('pic') && <td>{r.digitalPic ? '✓' : '—'}</td>}
                    {vis('extraHat') && <td>{r.extraHat || '—'}</td>}
                    {vis('coaching') && <td className="text-[11px]">{r.coaching}</td>}
                    {vis('status') && <td><span className={`badge badge-sm ${r.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>}
                    {vis('primaryContact') && <td className="text-[11px]">{r.primaryContact}</td>}
                    {vis('sponsorship') && <td>{r.sponsorship}</td>}
                    {vis('total') && <td className="font-semibold text-primary">${r.total}</td>}
                    {vis('date') && <td className="text-gray-400 text-[11px]">{r.date}</td>}
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 text-right">{filt.length} of {REGS.length}</p>
            {showEquipModal && (
              <div className="modal modal-open">
                <div className="modal-box max-w-md">
                  <h3 className="text-lg font-bold mb-4">Equipment Summary</h3>
                  <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Hat Sizes</div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {HATS.map((h) => (
                      <div key={h} className="bg-base-200 rounded-md p-2.5 text-center">
                        <div className="text-[11px] text-gray-500 font-semibold">{h}</div>
                        <div className="text-xl font-bold mt-0.5">{hatCounts[h] || 0}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Jersey Sizes</div>
                  <div className="grid grid-cols-4 gap-2">
                    {JERSEYS.map((j) => (
                      <div key={j} className="bg-base-200 rounded-md p-2.5 text-center">
                        <div className="text-[10px] text-gray-500 font-semibold">{j}</div>
                        <div className="text-xl font-bold mt-0.5">{jerseyCounts[j] || 0}</div>
                      </div>
                    ))}
                  </div>
                  <div className="modal-action">
                    <button className="btn btn-outline" onClick={() => setShowEquipModal(false)}>Close</button>
                  </div>
                </div>
                <div className="modal-backdrop" onClick={() => setShowEquipModal(false)} />
              </div>
            )}
          </>
        )}
        {tab === 'seasons' && (
          <>
            {seasonView === 'list' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Season Management</h1>
                  <button className="btn btn-neutral btn-sm" onClick={() => { setEditSeasonId(null); setSeasonView('new'); }}>
                    <Ic d={icons.plus} s={13} /> New Season
                  </button>
                </div>
                {activeSeason ? (
                  <div className="card border-2 border-primary p-5 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-bold">{activeSeason.name}</h2>
                        {activeSeason.description && <p className="text-xs text-gray-500 mt-0.5">{activeSeason.description}</p>}
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <span className="badge badge-success">Active</span>
                        <button className="btn btn-outline btn-sm" onClick={() => { setEditSeasonId(activeSeason.id); setSeasonView('edit'); }}>Edit</button>
                        <button className="btn btn-outline btn-sm" onClick={() => deactivateSeason(activeSeason.id)}>Deactivate</button>
                      </div>
                    </div>
                    <p className="text-sm mt-2.5"><strong>{activeSeason.programs.length}</strong> programs</p>
                  </div>
                ) : (
                  <div className="card bg-base-200 p-4 mb-4 text-sm text-gray-500">No active season. Activate a season from the table below.</div>
                )}
                <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mt-5 mb-2">All Seasons</div>
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead><tr><th>Name</th><th>Description</th><th>Programs</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{seasons.map((s) => (
                      <tr key={s.id}>
                        <td className="font-semibold">{s.name}</td>
                        <td className="text-[11px] text-gray-500 max-w-[200px]">{s.description || '—'}</td>
                        <td>{s.programs.length} programs</td>
                        <td><span className={`badge badge-sm ${s.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>{s.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <div className="flex gap-1">
                            {s.status !== 'active' && <button className="btn btn-outline btn-xs" onClick={() => activateSeason(s.id)}>Activate</button>}
                            <button className="btn btn-outline btn-xs" onClick={() => { setEditSeasonId(s.id); setSeasonView('edit'); }}>Edit</button>
                            <button className="btn btn-outline btn-xs" onClick={() => {
                              const clone: Season = { ...s, id: `s-${Date.now()}`, name: `${s.name} (Copy)`, status: 'inactive' as const, programs: s.programs.map((p) => ({ ...p, id: `pg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })) };
                              addSeason(clone); setEditSeasonId(clone.id); setSeasonView('edit');
                            }}>Clone</button>
                            <button className="btn btn-error btn-ghost btn-xs" onClick={() => { if (confirm(`Delete "${s.name}"?`)) deleteSeason(s.id); }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </>
            ) : (
              <SeasonDetail
                season={seasonView === 'edit' ? seasons.find((s) => s.id === editSeasonId) : null}
                sportTypes={SPORT_TYPES}
                onSave={(data) => {
                  if (seasonView === 'edit') { updateSeason(editSeasonId!, data); } else { addSeason({ ...data, id: `s-${Date.now()}`, status: 'inactive' as const } as Season); }
                  setSeasonView('list');
                }}
                onCancel={() => setSeasonView('list')}
              />
            )}
          </>
        )}
        {tab === 'users' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">User Management</h1>
            </div>
            <p className="text-gray-500">Assign Admin and Registrar roles here. Coming soon.</p>
          </>
        )}
      </main>
    </div>
  );
}
