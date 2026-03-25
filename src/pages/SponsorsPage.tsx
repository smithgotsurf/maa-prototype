import { B_URL, Ic, icons } from '../utils';

function Check() {
  return <span className="text-primary font-bold mr-1.5">✓</span>;
}

export default function SponsorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Become a Sponsor</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">
        MAA relies on local businesses and families to keep registration fees affordable and our
        fields well-maintained. There are several ways to get involved.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5 justify-items-center">
        <div className="card bg-white border border-primary rounded-[10px] p-5.5 text-center w-68.75">
          <Ic
            d={icons.star}
            s={24}
            style={{ margin: '0 auto 6px', display: 'block' }}
          />
          <h3 className="text-lg font-bold mb-0.5">Field Banner</h3>
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
          <ul className="text-[13px] text-base-content/70 text-left list-none p-0 mt-2.5 mb-0 leading-6">
            <li>
              <Check />
              Two banners — one on an MAA field, one on a school field
            </li>
            <li>
              <Check />
              Seen by players, families &amp; fans all season
            </li>
            <li>
              <Check />
              Covers three full seasons
            </li>
          </ul>
          <a
            href={B_URL + 'static/sponsorship-form.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3.5 text-secondary font-semibold text-[13px] no-underline"
          >
            <Ic d={icons.dl} s={13} /> Download Sponsorship Form
          </a>
        </div>
        <div className="card bg-white border border-primary rounded-[10px] p-5.5 text-center w-68.75">
          <Ic
            d={icons.heart}
            s={24}
            style={{ margin: '0 auto 6px', display: 'block' }}
          />
          <h3 className="text-lg font-bold mb-0.5">Team Sponsor</h3>
          <div className="text-[26px] font-bold font-serif text-secondary my-1.5">$250</div>
          <div className="text-xs text-base-content/50 mb-2.5">per team · per season</div>
          <ul className="text-[13px] text-base-content/70 text-left list-none p-0 leading-6">
            <li>
              <Check />
              Sponsor a specific team for one season
            </li>
            <li>
              <Check />
              Sponsor name on team jersey
            </li>
            <li>
              <Check />
              Available for any sport or age group
            </li>
          </ul>
          <div className="text-sm text-base-content/50 mt-5 leading-relaxed">
            Let us know during player registration.
          </div>
        </div>
        <div className="card bg-white border border-primary rounded-[10px] p-5.5 text-center w-68.75">
          <Ic
            d={icons.mail}
            s={24}
            style={{ margin: '0 auto 6px', display: 'block' }}
          />
          <h3 className="text-lg font-bold mb-0.5">Custom Opportunity</h3>
          <div className="text-[26px] font-bold font-serif text-secondary my-1.5">
            Let&rsquo;s Talk
          </div>
          <div className="text-xs text-base-content/50 mb-2.5">we'll work with you</div>
          <ul className="text-[13px] text-base-content/70 text-left list-none p-0 leading-6">
            <li>
              <Check />
              Event sponsorship
            </li>
            <li>
              <Check />
              Equipment donation
            </li>
            <li>
              <Check />
              Other creative partnerships
            </li>
          </ul>
          <div className="text-sm text-base-content/50 mt-5 leading-relaxed">
            Have another idea? We'd love to hear it.
          </div>
          <a
            href="mailto:meadowathleticassociation@gmail.com"
            className="inline-flex items-center gap-1.5 mt-3.5 text-secondary font-semibold text-[13px] no-underline"
          >
            <Ic d={icons.mail} s={13} /> Contact Us
          </a>
        </div>
      </div>
      <p className="text-[13px] text-base-content/50 mt-5">
        To get started, contact us at meadowathleticassociation@gmail.com.
      </p>
    </div>
  );
}
