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
import NewsDetail from './components/NewsDetail';
import EditNews from './pages/EditNews';

function App() {
  return (
    <div className="app-container">
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
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/dashboard/edit-news/:id" element={<EditNews />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
