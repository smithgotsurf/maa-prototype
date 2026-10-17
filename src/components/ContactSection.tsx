import { Ic, icons } from '../utils';
import { contactEmail, facebookUrl } from '../content';

export default function ContactSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="card bg-white border border-base-300 rounded-[10px] p-5">
        <h3 className="text-base font-bold mb-1">Get in Touch</h3>
        <p className="flex items-center gap-1.5 text-sm text-base-content/50">
          <Ic d={icons.mail} s={14} />
          {contactEmail}
        </p>
      </div>
      <div className="card bg-white border border-base-300 rounded-[10px] p-5">
        <h3 className="text-base font-bold mb-1">Follow Us</h3>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#1877F2] font-semibold text-sm no-underline"
        >
          <Ic d={icons.fb} s={16} />
          Join us on Facebook
        </a>
      </div>
    </div>
  );
}
