import { Ic, usePageTitle } from '../../utils';
import { contactEmail } from '../../content';
import { tiers } from './tiers';

function Check() {
  return (
    <span aria-hidden="true" className="text-primary font-bold mr-1.5">
      ✓
    </span>
  );
}

export default function SponsorsPage() {
  usePageTitle('Sponsorship');
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Become a Sponsor</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">
        MAA relies on local businesses and families to keep registration fees affordable and our
        fields well-maintained. There are several ways to get involved.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5 justify-items-center">
        {tiers.map((t) => (
          <div
            key={t.title}
            className="card bg-white border border-primary rounded-[10px] p-5.5 text-center w-68.75"
          >
            <Ic d={t.icon} s={24} style={{ margin: '0 auto 6px', display: 'block' }} />
            <h3 className="text-lg font-bold mb-0.5">{t.title}</h3>
            {t.price}
            <ul className="text-[13px] text-base-content/70 text-left list-none p-0 mt-2.5 mb-0 leading-6">
              {t.bullets.map((b) => (
                <li key={b}>
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
            {t.note && (
              <div className="text-sm text-base-content/50 mt-5 leading-relaxed">{t.note}</div>
            )}
            {t.cta}
          </div>
        ))}
      </div>
      <p className="text-[13px] text-base-content/50 mt-5">
        To get started, contact us at {contactEmail}.
      </p>
    </div>
  );
}
