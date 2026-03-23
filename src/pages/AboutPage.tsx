import { Ic, icons } from '../utils';

export default function AboutPage() {
  const board = [
    { n: 'Karla Parnell', r: 'President' },
    { n: 'Justin Massengill', r: 'Vice President' },
    { n: 'Parker Johnson', r: 'Secretary' },
    { n: 'Tiffany Adams', r: 'Treasurer' },
  ];
  const members = [
    'Blake Adams',
    'David Allen',
    'Johnathan Barefoot',
    'Waylon Dale Barefoot',
    'Drew Boyd',
    'Alex Dunn',
    'Craig Hardin',
    'Anthony Harrington',
    'Chris Hudson',
    'Chris Johnson',
    'Thomas Johnson',
    'Justin Knight',
    'Johnathan Lee',
    'Michael Poe',
    'Samantha Poe',
    'Josh Smith',
    'Keith Wall',
    'Brandon Williams',
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">About the Meadow Athletic Association</h1>
      <div className="border-t-2 border-primary w-16 mb-6" />
      <p className="mb-6 text-sm leading-relaxed">
        We are a multiple sport athletic association, serving the Meadow community. We are a
        non-profit organization and a part of our area since 1976. We are run by all volunteers,
        currently consisting of 21 members and a Treasurer.
      </p>
      <h2 className="text-xl font-bold mb-2">Our Board</h2>
      <p className="text-sm text-gray-500 mb-4">
        MAA is governed by a volunteer board of directors elected by the membership.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {board.map((b) => (
          <div className="card border border-base-300 p-4 text-center" key={b.n}>
            <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-2">
              <Ic d={icons.user} s={22} />
            </div>
            <h4 className="font-semibold text-sm">{b.n}</h4>
            <p className="text-xs text-gray-500">{b.r}</p>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-2">Members</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {members.map((m) => (
          <span key={m} className="badge badge-ghost">
            {m}
          </span>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-4">Contact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card border border-base-300 p-4">
          <h3 className="font-bold mb-1">Get in Touch</h3>
          <p className="flex items-center gap-1.5 text-sm">
            <Ic d={icons.mail} s={14} />
            meadowathleticassociation@gmail.com
          </p>
        </div>
        <div className="card border border-base-300 p-4">
          <h3 className="font-bold mb-1">Follow Us</h3>
          <a
            href="https://www.facebook.com/groups/169287900378142"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#1877F2] font-semibold text-sm no-underline"
          >
            <Ic d={icons.fb} s={16} />
            Join us on Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
