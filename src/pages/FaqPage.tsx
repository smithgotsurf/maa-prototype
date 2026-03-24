import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_PATHS } from '../utils';

const Sh = ({ l, first }: { l: string; first?: boolean }) => (
  <div
    className={`font-bold text-secondary uppercase text-lg tracking-wide ${first ? '' : 'mt-2.5'} mb-0.5`}
  >
    {l}
  </div>
);

export default function FaqPage() {
  const navigate = useNavigate();
  const faqs = [
    {
      q: 'What sports does MAA typically offer?',
      a: (
        <>
          <Sh l="Spring" first />
          <ul className="pl-5 mt-1.5 leading-[1.9] list-disc">
            <li>T-Ball (Coed, ages 3–4)</li>
            <li>T-Shirt (Coed, ages 5–6)</li>
            <li>Baseball (8U, 10U, 12U — boys)</li>
            <li>Softball (8U, 10U, 12U — girls)</li>
          </ul>
          <Sh l="Fall" />
          <ul className="pl-5 mt-1.5 leading-[1.9] list-disc">
            <li>Soccer (6U Coed, 8U Boys, 8U Girls)</li>
            <li>Baseball (8U, 10U, 12U — boys)</li>
            <li>Softball (8U, 10U, 12U — girls)</li>
          </ul>
          <Sh l="Winter" />
          <ul className="pl-5 mt-1.5 leading-[1.9] list-disc">
            <li>Basketball (6U Coed, 8U/10U/12U/15U boys, 8U/10U/12U girls)</li>
            <li>Volleyball (8U, 10U, 12U)</li>
          </ul>
        </>
      ),
    },
    {
      q: 'When does registration open?',
      a: (
        <>
          <Sh l="Spring" first />
          Typically opens mid-January and runs through February.
          <Sh l="Fall" />
          Opens early July through early August.
          <Sh l="Winter" />
          Opens early October through early November.
          <div className="mt-1.5 text-[11px] text-base-content/50">
            Deadlines may close earlier if an age group fills.
          </div>
        </>
      ),
    },
    {
      q: 'When does each season start?',
      a: (
        <>
          <Sh l="Spring" first />
          Practices begin in March; games start in April.
          <Sh l="Fall" />
          Practices begin in late August; games start mid-September.
          <Sh l="Winter" />
          Practices begin in early December; games start in early January.
        </>
      ),
    },
    {
      q: 'When do practices start?',
      a: (
        <>
          <Sh l="Spring" first />
          Baseball, softball, T-Ball, and T-Shirt practices begin in March.
          <Sh l="Fall" />
          Soccer practices begin in late August.
          <Sh l="Winter" />
          Volleyball practices begin in early December.
        </>
      ),
    },
    {
      q: 'When are games scheduled?',
      a: (
        <>
          <Sh l="Spring" first />
          Baseball and softball games are mostly Monday, Tuesday, and Thursday evenings. T-Ball games
          start at 6:30 PM; T-Shirt games start at 7:15–7:30 PM.
          <Sh l="Fall" />
          Soccer games are mostly Monday, Tuesday, and Thursday.
          <Sh l="Winter" />
          Volleyball games are mostly Saturday with some Tuesday and Thursday.
        </>
      ),
    },
    {
      q: 'How do I volunteer to coach?',
      a: 'Indicate your interest during registration. The board will follow up with details before the season starts.',
    },
    {
      q: 'How do coaches communicate with families?',
      a: 'Coaches coordinate with families via group text message.',
    },
    {
      q: 'How do I become a sponsor?',
      a: 'MAA offers field banner sponsorships and per-team seasonal sponsorships.',
      link: { l: 'View sponsorship options', p: 'sponsors' },
    },
    {
      q: 'Is MAA a non-profit?',
      a: 'Yes. MAA has been a volunteer-run, non-profit organization serving the Meadow community since 1976, governed by 21 members and a Treasurer.',
      link: { l: 'Learn more about MAA', p: 'about' },
    },
  ];
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Frequently Asked Questions</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      {faqs.map((f, i) => (
        <div className="border border-secondary rounded-[9px] p-4 mb-2" key={i}>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <h4 className="text-base font-semibold">{f.q}</h4>
            <span className="text-base-content/30 ml-2">{open === i ? '▾' : '▸'}</span>
          </div>
          {open === i && (
            <div className="text-sm text-base-content/50 leading-relaxed mt-2.5 bg-base-100 rounded-[5px] p-2">
              {f.a}
              {f.link && (
                <button
                  className="btn btn-ghost btn-sm mt-2 inline-flex"
                  onClick={() => navigate(PAGE_PATHS[f.link.p as keyof typeof PAGE_PATHS])}
                >
                  {f.link.l} →
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
