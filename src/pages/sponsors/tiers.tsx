import { B_URL, Ic, icons } from '../../utils';
import { contactEmail } from '../../content';

export type Tier = {
  icon: string;
  title: string;
  /** Rendered above the bullet list. JSX so each tier can express its own price layout. */
  price: React.ReactNode;
  bullets: string[];
  /** Optional CTA rendered below the bullets. JSX so it can be a link, an `<a>` to a PDF, etc. */
  cta?: React.ReactNode;
  /** Optional plain-text note below the bullets (used by tiers without a CTA). */
  note?: string;
};

export const tiers: Tier[] = [
  {
    icon: icons.star,
    title: 'Field Banner',
    price: (
      <div className="flex gap-4 justify-center items-end my-2">
        <div className="text-center">
          <div className="text-[26px] font-bold font-serif text-secondary">
            $175<span className="text-base font-semibold">/yr</span>
          </div>
          <div className="text-[11px] text-base-content/50 mt-0.5">for 3 years</div>
        </div>
        <div className="text-base-content/30 text-[13px] pb-4.5">or</div>
        <div className="text-center">
          <div className="text-[26px] font-bold font-serif text-secondary">$500</div>
          <div className="text-[11px] text-base-content/50 mt-0.5">one-time</div>
        </div>
      </div>
    ),
    bullets: [
      'Two banners — one on an MAA field, one on a school field',
      'Seen by players, families & fans all season',
      'Covers three full seasons',
    ],
    cta: (
      <a
        href={B_URL + 'static/sponsorship-form.pdf'}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 mt-3.5 text-secondary font-semibold text-[13px] no-underline"
      >
        <Ic d={icons.dl} s={13} /> Download Sponsorship Form
      </a>
    ),
  },
  {
    icon: icons.heart,
    title: 'Team Sponsor',
    price: (
      <>
        <div className="text-[26px] font-bold font-serif text-secondary my-1.5">$250</div>
        <div className="text-xs text-base-content/50 mb-2.5">per team · per season</div>
      </>
    ),
    bullets: [
      'Sponsor a specific team for one season',
      'Sponsor name on team jersey',
      'Available for any sport or age group',
    ],
    note: 'Let us know during player registration.',
  },
  {
    icon: icons.mail,
    title: 'Custom Opportunity',
    price: (
      <>
        <div className="text-[26px] font-bold font-serif text-secondary my-1.5">
          Let&rsquo;s Talk
        </div>
        <div className="text-xs text-base-content/50 mb-2.5">we'll work with you</div>
      </>
    ),
    bullets: ['Event sponsorship', 'Equipment donation', 'Other creative partnerships'],
    note: "Have another idea? We'd love to hear it.",
    cta: (
      <a
        href={`mailto:${contactEmail}`}
        className="inline-flex items-center gap-1.5 mt-3.5 text-secondary font-semibold text-[13px] no-underline"
      >
        <Ic d={icons.mail} s={13} /> Contact Us
      </a>
    ),
  },
];
