/* components/DashboardNavbar.js */
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.error('No refresh token found');
        navigate('/login');
        return;
      }

      await axios.delete('http://localhost:8080/auth/logout', {
        data: { refreshToken }, // ⬅️ Kirim refresh token ke backend
        headers: { 'Content-Type': 'application/json' },
      });

      // Hapus token dari localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      // Redirect ke halaman login
      navigate('/login');
    } catch (error) {
      console.error(
        'Logout error:',
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: '#0a6fba' }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/dashboard">
          Dashboard
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard/news">
                News
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="/dashboard/struktur-organisasi"
              >
                Struktur Organisasi
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="/dashboard/salam-direktur"
              >
                Salam Direktur
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-danger"
                onClick={handleLogout}
                disabled={loading} // Nonaktifkan tombol saat logout
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
