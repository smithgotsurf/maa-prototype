import type { ReactNode } from 'react';
import HeroArt from './HeroArt';
import type { HeroArtId } from './theme';

interface CurvedBandProps {
  art: HeroArtId;
  /** Padding classes; the band's height comes from its content plus this. */
  className: string;
  children: ReactNode;
}

/** Dark art block with a curved bottom edge. The gold background shows as the rim along the curve. */
export default function CurvedBand({ art, className, children }: CurvedBandProps) {
  return (
    <div
      className={`relative z-[1] overflow-hidden bg-primary text-center text-white ${className}`}
      style={{ clipPath: 'ellipse(125% 100% at 50% 0)' }}
    >
      <HeroArt art={art} />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
