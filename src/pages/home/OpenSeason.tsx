import { useNavigate } from 'react-router-dom';
import { Ic, icons } from '../../utils';
import type { Season } from '../../types';

const GROUPS = [
  ['Coed', 'Coed'],
  ['Boys', 'Male'],
  ['Girls', 'Female'],
] as const;

export default function OpenSeason({ season }: { season: Season }) {
  const navigate = useNavigate();
  const { programs } = season;
  return (
    <>
      <div className="card bg-white shadow-[0_3px_20px_rgba(0,0,0,.05)] border border-base-300 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 -mt-34 max-w-[600px] mx-auto relative z-10 mb-10">
        <div>
          <h3 className="text-[17px] font-bold">{season.name}</h3>
          <p className="text-[13px] text-base-content/50 mt-0.5">{season.description}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/register')}>
          Register Now <Ic d={icons.chev} s={15} />
        </button>
      </div>
      <section>
        <h2 className="text-[30px] font-bold mb-1.5">Available Programs</h2>
        <div className="w-11 h-[3px] bg-primary rounded-sm mb-3" />
        {programs.length > 0 ? (
          <>
            <p className="text-[17px] text-base-content/70 leading-relaxed mb-5">
              {programs.length} programs for ages {Math.min(...programs.map((p) => p.min))}–
              {Math.max(...programs.map((p) => p.max))}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GROUPS.map(([label, key]) => (
                <div key={label}>
                  <h3 className="text-xl font-bold text-center mb-3">{label}</h3>
                  {programs
                    .filter((p) => p.gender === key)
                    .map((p) => (
                      <div
                        className={`card bg-white border border-primary rounded-[10px] p-4.5 mb-2 ${p.closed ? 'opacity-40' : ''}`}
                        key={p.id}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-semibold text-base">{p.name}</h4>
                          {p.closed && <span className="badge badge-error badge-sm">Closed</span>}
                        </div>
                        <span className="text-xs text-base-content/50">
                          Ages {p.min}–{p.max}
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-[17px] text-base-content/70 leading-relaxed mb-5">
            Programs will be listed here soon.
          </p>
        )}
      </section>
    </>
  );
}
