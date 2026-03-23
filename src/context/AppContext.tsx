import { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Player, Season, AppContextValue } from '../types';
import { INIT_PLAYERS, SEED_SEASONS } from '../data';

const AppContext = createContext<AppContextValue | null>(null);
const LS_KEY = 'maa_seasons';

function loadSeasons(): Season[] {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (_e) { /* ignore */ }
  return SEED_SEASONS;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [players, setPlayers] = useState<Player[]>(INIT_PLAYERS);
  const [seasons, setSeasons] = useState<Season[]>(loadSeasons);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(seasons));
  }, [seasons]);

  const activeSeason = seasons.find(s => s.status === 'active') || null;

  const addToCart = (item: CartItem) => setCart(prev => [...prev, item]);
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);
  const addPlayer = (p: Player) => setPlayers(prev => [...prev, p]);

  const addSeason = (season: Season) => setSeasons(prev => [...prev, season]);
  const updateSeason = (id: string, updates: Partial<Season>) => setSeasons(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSeason = (id: string) => setSeasons(prev => prev.filter(s => s.id !== id));
  const activateSeason = (id: string) => setSeasons(prev => prev.map(s => ({ ...s, status: s.id === id ? 'active' as const : 'inactive' as const })));
  const deactivateSeason = (id: string) => setSeasons(prev => prev.map(s => s.id === id ? { ...s, status: 'inactive' as const } : s));

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart,
      players, addPlayer,
      seasons, activeSeason, addSeason, updateSeason, deleteSeason, activateSeason, deactivateSeason
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
