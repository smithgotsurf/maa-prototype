import CurvedBand from '../../components/CurvedBand';
import { useTheme } from '../../components/theme';
import { hero } from './copy';

export default function Hero() {
  const theme = useTheme();
  return (
    <CurvedBand art={theme.art} className="px-7 pt-16 pb-45">
      <h1 className="text-3xl md:text-[42px] font-bold leading-tight mb-1.5">
        <span className="text-primary">M</span>eadow <span className="text-primary">A</span>
        thletic <span className="text-primary">A</span>ssociation
      </h1>
      <p className="text-base opacity-85 [text-shadow:0_1px_2px_rgba(0,0,0,.75),0_0_14px_rgba(0,0,0,.6)] max-w-[440px] mx-auto mb-8 leading-relaxed">
        {hero.subhead}
      </p>
    </CurvedBand>
  );
}
