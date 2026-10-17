import { Link } from 'react-router-dom';
import { Ic, icons, PAGE_PATHS } from '../utils';
import { contactEmail, facebookUrl } from '../content';

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-12">
      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-serif text-[19px]">
            <span className="text-primary font-bold">M</span>eadow{' '}
            <span className="text-primary font-bold">A</span>thletic{' '}
            <span className="text-primary font-bold">A</span>ssociation
          </div>
          <p className="text-sm text-neutral-content/60 mt-2 leading-relaxed">
            Youth sports for the Meadow, NC community since 1976.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-content/50 mb-2">
            Site
          </h4>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <Link to={PAGE_PATHS.about} className="text-neutral-content/80 hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to={PAGE_PATHS.faq} className="text-neutral-content/80 hover:text-primary">
                FAQ
              </Link>
            </li>
            <li>
              <Link to={PAGE_PATHS.fields} className="text-neutral-content/80 hover:text-primary">
                Field Rentals
              </Link>
            </li>
            <li>
              <Link to={PAGE_PATHS.sponsors} className="text-neutral-content/80 hover:text-primary">
                Sponsorship
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-content/50 mb-2">
            Contact
          </h4>
          <p className="flex items-center gap-1.5 text-sm text-neutral-content/80 mb-2">
            <Ic d={icons.mail} s={14} />
            <a href={`mailto:${contactEmail}`} className="hover:text-primary">
              {contactEmail}
            </a>
          </p>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-content/80 hover:text-primary"
          >
            <Ic d={icons.fb} s={14} />
            Facebook
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-3 text-xs text-neutral-content/50">
          © {new Date().getFullYear()} Meadow Athletic Association
        </div>
      </div>
    </footer>
  );
}
