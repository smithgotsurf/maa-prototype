import CurvedBand from './CurvedBand';
import type { HeroArtId } from './theme';

interface PageBandProps {
  title: string;
  /** Set per page, not by the visitor's theme. Field Rentals uses 'photo'. */
  art?: HeroArtId;
}

/** A subpage's header: its title on a short curved band, shorter on phones. */
export default function PageBand({ title, art = 'lines' }: PageBandProps) {
  return (
    <CurvedBand art={art} className="px-4 pt-[22px] pb-[34px] md:px-7 md:pt-9 md:pb-13">
      <h1 className="text-2xl md:text-[34px] font-bold leading-tight text-balance [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">
        {title}
      </h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mx-auto mt-2 md:mt-2.5" />
    </CurvedBand>
  );
}
