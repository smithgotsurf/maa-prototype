import { Link } from 'react-router-dom';
import { B_URL, PAGE_PATHS } from '../../utils';
import { teasers } from './copy';

export default function MoreOnTheSite() {
  return (
    <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link
        to={PAGE_PATHS.fields}
        className="card bg-white border border-base-300 rounded-[10px] overflow-hidden no-underline text-base-content hover:opacity-90 transition-opacity"
      >
        <img
          src={B_URL + 'static/fields-aerial.webp'}
          alt="MAA fields"
          className="w-full h-[140px] object-cover"
        />
        <div className="p-5">
          <h3 className="text-lg font-bold mb-1">{teasers.fields.heading}</h3>
          <p className="text-sm text-base-content/60 leading-relaxed mb-3">{teasers.fields.body}</p>
          <span className="text-sm font-semibold text-primary">{teasers.fields.cta} →</span>
        </div>
      </Link>

      <Link
        to={PAGE_PATHS.sponsors}
        className="card bg-white border border-base-300 rounded-[10px] overflow-hidden no-underline text-base-content hover:opacity-90 transition-opacity"
      >
        <img
          src={B_URL + 'static/sports-balls.jpg'}
          alt="Baseball, basketball, soccer ball, and volleyball"
          className="w-full h-[140px] object-contain bg-base-100"
        />
        <div className="p-5">
          <h3 className="text-lg font-bold mb-1">{teasers.sponsors.heading}</h3>
          <p className="text-sm text-base-content/60 leading-relaxed mb-3">
            {teasers.sponsors.body}
          </p>
          <span className="text-sm font-semibold text-primary">{teasers.sponsors.cta} →</span>
        </div>
      </Link>
    </section>
  );
}
