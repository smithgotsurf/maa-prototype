import { programsSection } from './copy';
import { programs } from './programs';

export default function ProgramsOffered() {
  return (
    <section>
      <h2 className="text-[30px] font-bold mb-1.5">{programsSection.heading}</h2>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-3" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-5">
        {programsSection.subhead}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {programs.map((season) => (
          <div key={season.label}>
            <h3 className="text-xl font-bold text-center mb-3">{season.label}</h3>
            {season.items.map((i) => (
              <div
                className="card bg-white border border-primary rounded-[10px] p-4.5 mb-2"
                key={i.name}
              >
                <h4 className="font-serif font-semibold text-base">{i.name}</h4>
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
    </section>
  );
}
