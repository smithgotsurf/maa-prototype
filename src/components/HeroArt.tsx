import { B_URL } from '../utils';
import type { HeroArtId } from './theme';

// 5px shorter than CurvedBand's own clip, which leaves the gold rim showing
const ART_CLIP = 'ellipse(125% calc(100% - 5px) at 50% 0)';

const PANELS = [
  { file: 'fields-soccer.svg', position: '50% 100%' },
  { file: 'fields-basketball.svg', position: '50% 0' },
  { file: 'fields-baseball.svg', position: 'center' },
  { file: 'fields-volleyball.svg', position: 'center' },
];

// Slanted strip, overhanging both edges so the lean never shows a gap
const STRIP = 'absolute inset-y-0 -left-15 -right-15 flex -skew-x-10';

function FourFields() {
  return (
    <>
      <div className={STRIP}>
        {PANELS.map(({ file, position }) => (
          <div key={file} className="relative flex-1 overflow-hidden">
            <img
              src={B_URL + 'static/' + file}
              alt=""
              className="absolute top-0 -left-[12%] h-full w-[124%] max-w-none skew-x-10 object-cover saturate-[.78]"
              style={{ objectPosition: position }}
            />
          </div>
        ))}
      </div>
      <div
        className="absolute inset-0 max-md:bg-[rgba(12,11,9,.2)]"
        style={{
          backgroundImage: `url('${B_URL}static/grain-dark.svg'), radial-gradient(ellipse 44% 56% at 50% 30%, rgba(12,11,9,.6), rgba(12,11,9,0) 78%), linear-gradient(180deg, rgba(12,11,9,.56) 0%, rgba(12,11,9,.42) 50%, rgba(12,11,9,.74) 100%)`,
        }}
      />
      <div className={STRIP}>
        {PANELS.map(({ file }, i) => (
          <div
            key={file}
            className={
              i === 0
                ? 'flex-1'
                : 'flex-1 border-l-[3px] border-primary/80 max-md:border-l-2 max-md:border-primary/40'
            }
          />
        ))}
      </div>
    </>
  );
}

/** The art behind a CurvedBand: the infield photo, the four playing surfaces, or the gold ball pattern. */
export default function HeroArt({ art }: { art: HeroArtId }) {
  if (art === 'photo') {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          clipPath: ART_CLIP,
          backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${B_URL}static/field-1.webp')`,
        }}
      />
    );
  }
  if (art === 'lines') {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          clipPath: ART_CLIP,
          backgroundImage: `radial-gradient(ellipse 46% 60% at 50% 26%, rgba(197,160,78,.2), rgba(197,160,78,0) 72%), url('${B_URL}static/ball-pattern.svg'), linear-gradient(180deg, #282521 0%, #151514 100%)`,
          backgroundSize: 'auto, 180px 180px, auto',
        }}
      />
    );
  }
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-neutral" style={{ clipPath: ART_CLIP }}>
      <FourFields />
    </div>
  );
}
