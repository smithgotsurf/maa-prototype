import { B_URL } from '../utils';
import { THEMES, setTheme, useTheme, type HeroArtId } from './theme';

// A tiny preview of each theme's hero art
const SWATCH: Record<HeroArtId, string> = {
  photo: `linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.4)), url('${B_URL}static/field-1.webp') 50% 62% / 280% auto`,
  fields: 'linear-gradient(100deg, #3e7334 0 25%, #c4945b 25% 50%, #3d6c30 50% 75%, #2f4e79 75%)',
  lines:
    'radial-gradient(circle, transparent 0 2.3px, rgba(197,160,78,.85) 2.6px 3.3px, transparent 3.6px) 1px 0 / 9px 9px, #1e1d1b',
};

/** Footer buttons that switch the homepage hero; the choice is remembered on this device. */
export default function ThemeSwitch() {
  const theme = useTheme();
  return (
    <div role="group" aria-label="Homepage theme" className="flex flex-wrap items-center gap-1.5">
      <span>Theme</span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-pressed={t.id === theme.id}
          onClick={() => setTheme(t.id)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/12 bg-white/5 py-[3px] pl-1 pr-2.5 text-xs text-neutral-content/70 hover:border-primary/50 hover:text-neutral-content aria-pressed:border-primary aria-pressed:bg-primary/12 aria-pressed:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span
            aria-hidden="true"
            className="block h-3.5 w-[22px] rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,.15)]"
            style={{ background: SWATCH[t.art] }}
          />
          {t.label}
        </button>
      ))}
    </div>
  );
}
