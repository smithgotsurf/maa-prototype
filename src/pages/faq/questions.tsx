/* eslint-disable react-refresh/only-export-components */
const Sh = ({ l, first }: { l: string; first?: boolean }) => (
  <div
    className={`font-bold text-secondary uppercase text-lg tracking-wide ${first ? '' : 'mt-2.5'} mb-0.5`}
  >
    {l}
  </div>
);

export type FaqEntry = {
  q: string;
  a: React.ReactNode;
  link?: { l: string; p: 'about' | 'faq' | 'fields' | 'sponsors' };
};

export const questions: FaqEntry[] = [
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
          <li>Volleyball (10U, 12U)</li>
        </ul>
        <Sh l="Winter" />
        <ul className="pl-5 mt-1.5 leading-[1.9] list-disc">
          <li>Basketball (6U Coed, 8U/10U/12U/15U boys, 8U/10U/12U girls)</li>
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
        Practices begin in early December; games start in early January. Practices are held on
        Saturdays, and older age groups also have some practices during the week.
      </>
    ),
  },
  {
    q: 'When are games scheduled?',
    a: (
      <>
        <Sh l="Spring" first />
        Games are mostly Monday, Tuesday, and Thursday evenings. The first game starts at 6:30 PM;
        the second starts at 7:30 or 7:45 PM, depending on the sport.
        <Sh l="Fall" />
        Games are mostly Monday, Tuesday, and Thursday evenings. The first game starts at 6:30 PM;
        the second starts at 7:30 or 7:45 PM, depending on the sport.
        <Sh l="Winter" />
        Games are held on Saturdays, starting at 9:00 AM and running into the afternoon, with an
        occasional weeknight game.
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
