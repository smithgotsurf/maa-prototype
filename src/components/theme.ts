import { useSyncExternalStore } from 'react';

export type HeroArtId = 'photo' | 'fields' | 'lines';
export type ThemeId = 'home-plate' | 'four-fields' | 'gold-lines';
export type Theme = { id: ThemeId; label: string; art: HeroArtId };

export const THEMES: Theme[] = [
  { id: 'home-plate', label: 'Home Plate', art: 'photo' },
  { id: 'four-fields', label: 'Four Fields', art: 'fields' },
  { id: 'gold-lines', label: 'Gold Lines', art: 'lines' },
];

export const DEFAULT_THEME: ThemeId = 'four-fields';

const STORAGE_KEY = 'maa_theme';

/** The visitor's saved homepage theme; storage can be missing, stale, or throw (private browsing). */
function readSaved(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.find((t) => t.id === saved)?.id ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

let current: ThemeId = readSaved();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return THEMES.find((t) => t.id === current)!;
}

export function setTheme(id: ThemeId): void {
  current = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Not saved, but the choice still applies for this visit.
  }
  listeners.forEach((listener) => listener());
}

/** The homepage theme, shared by every component that reads it. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot);
}
