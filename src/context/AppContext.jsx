import { createContext, useContext, useState, useEffect } from 'react';
import { INIT_PLAYERS, SEED_SEASONS } from '../data';

const AppContext = createContext();
const LS_KEY = 'maa_seasons';

function loadSeasons() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return SEED_SEASONS;
}

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [players, setPlayers] = useState(INIT_PLAYERS);
  const [seasons, setSeasons] = useState(loadSeasons);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(seasons));
  }, [seasons]);

  const activeSeason = seasons.find(s => s.status === 'active') || null;

  const addToCart = (item) => setCart(prev => [...prev, item]);
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);
  const addPlayer = (p) => setPlayers(prev => [...prev, p]);

  const addSeason = (season) => setSeasons(prev => [...prev, season]);
  const updateSeason = (id, updates) => setSeasons(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSeason = (id) => setSeasons(prev => prev.filter(s => s.id !== id));
  const activateSeason = (id) => setSeasons(prev => prev.map(s => ({ ...s, status: s.id === id ? 'active' : 'inactive' })));
  const deactivateSeason = (id) => setSeasons(prev => prev.map(s => s.id === id ? { ...s, status: 'inactive' } : s));

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

export function useAppContext() {
  return useContext(AppContext);
}
