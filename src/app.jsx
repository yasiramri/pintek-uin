import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewsDashboard from './pages/NewsDashboard';
import StrukturOrganisasiDashboard from './pages/StrukturOrganisasiDashboard';
import SalamDirekturDashboard from './pages/SalamDirekturDashboard';
import News from './pages/News';

function App() {
  return (
    <div className="app-container">
      {/* Menampilkan Navbar hanya di halaman yang bukan bagian dari Dashboard */}
      {window.location.pathname.startsWith('/dashboard') ? null : <Navbar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentangkami" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/news" element={<NewsDashboard />} />
          <Route
            path="/dashboard/struktur-organisasi"
            element={<StrukturOrganisasiDashboard />}
          />
          <Route
            path="/dashboard/salam-direktur"
            element={<SalamDirekturDashboard />}
          />
          <Route path="/news" element={<News />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
