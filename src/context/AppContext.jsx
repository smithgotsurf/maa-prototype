import { createContext, useContext, useState } from 'react';
import { INIT_PLAYERS } from '../data';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [players, setPlayers] = useState(INIT_PLAYERS);

  const addToCart = (item) => setCart(prev => [...prev, item]);
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);
  const addPlayer = (p) => setPlayers(prev => [...prev, p]);

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, players, addPlayer }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
