import { Ic, icons, usePageTitle } from '../../utils';
import { board } from './board';
import { intro, boardLead } from './copy';
import ContactSection from '../../components/ContactSection';
import PageBand from '../../components/PageBand';
import PageColumn from '../../components/PageColumn';

export default function AboutPage() {
  usePageTitle('About');
  const officers = board.filter((m) => m.role);
  const members = board.filter((m) => !m.role);
  return (
    <>
      <PageBand title="About the Meadow Athletic Association" />
      <PageColumn>
        <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">{intro}</p>
        <h2 className="text-xl font-bold mb-2">Our Board</h2>
        <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">{boardLead}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 mb-8">
          {officers.map((o) => (
            <div
              className="card bg-white border border-secondary rounded-[9px] p-4.5 text-center"
              key={o.name}
            >
              <div className="w-12 h-12 rounded-full bg-[#FBF7EC] flex items-center justify-center mx-auto mb-2 text-primary">
                <Ic d={icons.user} s={22} />
              </div>
              <h4 className="text-sm font-semibold">{o.name}</h4>
              <p className="text-[11px] text-base-content/50">{o.role}</p>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-bold mb-2">Members</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2.5 mb-8">
          {members.map((m) => (
            <span
              key={m.name}
              className="text-[13px] text-base-content/70 bg-base-100 border border-base-300 py-1.5 px-1 rounded-[5px] text-center"
            >
              {m.name}
            </span>
          ))}
        </div>
        <h2 className="text-xl font-bold mb-4">Contact</h2>
        <ContactSection />
      </PageColumn>
    </>
  );
}
