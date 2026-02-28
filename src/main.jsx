import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import App from './App'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import FaqPage from './pages/FaqPage'
import FieldsPage from './pages/FieldsPage'
import SponsorsPage from './pages/SponsorsPage'
import AdminPage from './pages/AdminPage'
import { RegPage, CartPage } from './Registration'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
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
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  </React.StrictMode>
)
