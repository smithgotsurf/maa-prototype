import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import App from './App';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import FaqPage from './pages/faq';
import FieldsPage from './pages/fields';
import SponsorsPage from './pages/sponsors';
import NotFoundPage from './pages/not-found';
import AdminPage from './pages/AdminPage';
import { RegPage, CartPage } from './Registration';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="field-rentals" element={<FieldsPage />} />
            <Route path="sponsorship" element={<SponsorsPage />} />
            <Route path="register" element={<RegPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  </StrictMode>,
);
