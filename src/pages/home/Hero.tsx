import { hero } from './copy';

export default function Hero() {
  return (
    <div
      className="relative bg-cover bg-center text-white text-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${hero.backgroundImage}')`,
        padding: '64px 28px 180px',
      }}
    >
      <h1 className="text-3xl md:text-[42px] font-bold leading-tight mb-1.5">
        <span className="text-primary">M</span>eadow <span className="text-primary">A</span>
        thletic <span className="text-primary">A</span>ssociation
      </h1>
      <p className="text-base opacity-55 max-w-[440px] mx-auto mb-8 leading-relaxed">
        {hero.subhead}
      </p>
    </div>
  );
}
