import { B_URL, Ic, icons } from '../utils';

export default function SponsorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Become a Sponsor</h1>
      <div className="border-t-2 border-primary w-16 mb-6" />
      <p className="text-sm mb-6">
        MAA relies on local businesses and families to keep registration fees affordable and our
        fields well-maintained. There are several ways to get involved.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card border-2 border-primary p-6">
          <Ic d={icons.star} s={24} style={{ color: '#C5A04E', margin: '0 auto 6px', display: 'block' }} />
          <h3 className="font-bold text-center mb-2">Field Banner</h3>
          <div className="flex gap-4 justify-center items-end my-2">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                $175<span className="text-base font-semibold">/yr</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">for 3 years</div>
            </div>
            <div className="text-gray-400 text-sm pb-4">or</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">$500</div>
              <div className="text-[11px] text-gray-500 mt-0.5">one-time</div>
            </div>
          </div>
          <ul className="list-disc pl-4 text-sm mt-2.5 mb-0 space-y-0.5">
            <li>Two banners — one on an MAA field, one on a school field</li>
            <li>Seen by players, families &amp; fans all season</li>
            <li>Covers three full seasons</li>
          </ul>
          <a
            href={B_URL + 'static/sponsorship-form.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3.5 text-primary font-semibold text-sm no-underline"
          >
            <Ic d={icons.dl} s={13} /> Download Sponsorship Form
          </a>
        </div>
        <div className="card border-2 border-primary p-6">
          <Ic d={icons.heart} s={24} style={{ color: '#C5A04E', margin: '0 auto 6px', display: 'block' }} />
          <h3 className="font-bold text-center mb-2">Team Sponsor</h3>
          <div className="text-3xl font-bold text-primary text-center">$250</div>
          <div className="text-xs text-gray-500 text-center mb-2.5">per team · per season</div>
          <ul className="list-disc pl-4 text-sm space-y-0.5">
            <li>Sponsor a specific team for one season</li>
            <li>Sponsor name on team jersey</li>
            <li>Available for any sport or age group</li>
          </ul>
          <div className="text-sm text-gray-500 mt-5 leading-relaxed">
            Let us know during player registration.
          </div>
        </div>
        <div className="card border-2 border-primary p-6">
          <Ic d={icons.mail} s={24} style={{ color: '#C5A04E', margin: '0 auto 6px', display: 'block' }} />
          <h3 className="font-bold text-center mb-2">Custom Opportunity</h3>
          <div className="text-3xl font-bold text-primary text-center">Let's Talk</div>
          <div className="text-xs text-gray-500 text-center mb-2.5">we'll work with you</div>
          <ul className="list-disc pl-4 text-sm space-y-0.5">
            <li>Event sponsorship</li>
            <li>Equipment donation</li>
            <li>Other creative partnerships</li>
          </ul>
          <div className="text-sm text-gray-500 mt-5 leading-relaxed">
            Have another idea? We'd love to hear it.
          </div>
          <a
            href="mailto:meadowathleticassociation@gmail.com"
            className="inline-flex items-center gap-1 mt-3.5 text-primary font-semibold text-sm no-underline"
          >
            <Ic d={icons.mail} s={13} /> Contact Us
          </a>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-5">
        To get started, contact us at meadowathleticassociation@gmail.com.
      </p>
    </div>
  );
}
