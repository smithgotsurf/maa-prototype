import { useNavigate } from 'react-router-dom';
import { B_URL, Ic, icons } from '../utils';
import { useAppContext } from '../context/AppContext';

const SPORTS = [
  {
    label: 'Spring',
    items: [
      { name: 'T-Ball', ages: ['3–4'] },
      { name: 'T-Shirt', ages: ['5–6'] },
      { name: 'Baseball', ages: ['8U', '10U', '12U'] },
      { name: 'Softball', ages: ['8U', '10U', '12U'] },
    ],
  },
  {
    label: 'Fall',
    items: [
      { name: 'Soccer', ages: ['6U', '8U'] },
      { name: 'Baseball', ages: ['8U', '10U', '12U'] },
      { name: 'Softball', ages: ['8U', '10U', '12U'] },
    ],
  },
  {
    label: 'Winter',
    items: [
      { name: 'Basketball', ages: ['6U', '8U', '10U', '12U', '15U'] },
      { name: 'Volleyball', ages: ['8U', '10U', '12U'] },
    ],
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { activeSeason } = useAppContext();
  const minAge = activeSeason ? Math.min(...activeSeason.programs.map((p) => p.min)) : null;
  const maxAge = activeSeason ? Math.max(...activeSeason.programs.map((p) => p.max)) : null;
  return (
    <div>
      <div
        className="relative bg-cover bg-center py-20 px-6 text-white text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${B_URL}static/field-1.jpg')`,
        }}
      >
        <h1 className="text-3xl md:text-[42px] font-bold leading-tight mb-3">
          <span className="text-primary">M</span>eadow <span className="text-primary">A</span>
          thletic <span className="text-primary">A</span>ssociation
        </h1>
        <p className="text-sm md:text-base opacity-90 max-w-xl mx-auto">
          Youth recreational sports for the Meadow community. Building character, teamwork, and
          lifelong memories.
        </p>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeSeason ? (
          <>
            <div className="card bg-base-100 shadow-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 -mt-10 relative z-10 mb-6">
              <div>
                <h3 className="text-lg font-bold">{activeSeason.name}</h3>
                <p className="text-sm text-gray-500">{activeSeason.description}</p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Register Now <Ic d={icons.chev} s={15} />
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold">Available Programs</h3>
              <p className="text-sm text-gray-500">
                {activeSeason.programs.length} programs for ages {minAge}–{maxAge}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ['Coed', 'Coed'],
                ['Boys', 'Male'],
                ['Girls', 'Female'],
              ].map(([label, key]) => (
                <div key={label}>
                  <div className="text-xs font-bold uppercase tracking-wider text-center mb-2 text-gray-500">
                    {label}
                  </div>
                  {activeSeason.programs
                    .filter((p) => p.gender === key)
                    .map((p) => (
                      <div
                        className={`card border border-base-300 p-3 mb-2 ${p.closed ? 'opacity-40' : ''}`}
                        key={p.id}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{p.name}</h4>
                          {p.closed && <span className="badge badge-error badge-sm">Closed</span>}
                        </div>
                        <span className="text-xs text-gray-500">
                          Ages {p.min}–{p.max}
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="card bg-base-100 shadow-md p-5 -mt-10 relative z-10 mb-6">
              <h3 className="text-lg font-bold">Registration</h3>
              <p className="text-sm text-gray-500">
                Check back soon for upcoming registration information.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold">What We Offer</h3>
              <p className="text-sm text-gray-500">Youth sports across three seasons</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SPORTS.map((s) => (
                <div key={s.label}>
                  <div className="text-xs font-bold uppercase tracking-wider text-center mb-2 text-gray-500">
                    {s.label}
                  </div>
                  {s.items.map((i) => (
                    <div className="card border border-base-300 p-3 mb-2" key={i.name}>
                      <h4 className="font-semibold text-sm">{i.name}</h4>
                      <ul className="flex flex-wrap gap-1 mt-1">
                        {i.ages.map((a) => (
                          <li key={a} className="badge badge-ghost badge-sm">
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
