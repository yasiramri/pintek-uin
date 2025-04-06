import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import StrukturOrganisasi from './pages/StrukturOrganisasi';
import axios from 'axios';
import Swal from 'sweetalert2';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin = location.pathname === '/login';

  useEffect(() => {
    const protectDashboardRoutes = async () => {
      if (isDashboard) {
        const accessToken = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          navigate('/login');
          return;
        }

        try {
          await axios.get('https://pintek-rest-production.up.railway.app', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch (error) {
          if (error.response?.status === 401) {
            try {
              const res = await axios.post(
                'https://pintek-rest-production.up.railway.app/auth/token',
                {
                  refreshToken,
                }
              );

              const newAccessToken = res.data.data.accessToken;
              localStorage.setItem('token', newAccessToken);
            } catch (refreshError) {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              Swal.fire('Sesi habis', 'Silakan login kembali.', 'info');
              navigate('/login');
            }
          }
        }
      }
    };

    protectDashboardRoutes();
  }, [location.pathname, navigate, isDashboard]);

  return (
    <div className="app-container">
      {!isDashboard && !isLogin && <Navbar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentangkami" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/struktur-organisasi" element={<StrukturOrganisasi />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />

          {/* Proteksi halaman dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/news"
            element={
              <PrivateRoute>
                <NewsDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/struktur-organisasi"
            element={
              <PrivateRoute>
                <StrukturOrganisasiDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/salam-direktur"
            element={
              <PrivateRoute>
                <SalamDirekturDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/edit-news/:id"
            element={
              <PrivateRoute>
                <EditNews />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      {!isDashboard && !isLogin && <Footer />}
    </div>
  );
}

export default App;
