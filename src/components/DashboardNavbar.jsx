import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import {
  Home,
  LayoutDashboard,
  Newspaper,
  Users,
  LogOut,
  Menu,
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function SidebarDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        navigate('/login');
        return;
      }

      await axios.delete(
        'https://pintek-rest-production.up.railway.app/auth/logout',
        {
          data: { refreshToken },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className={`d-none d-lg-flex flex-column align-items-start bg-white border-end shadow-sm p-3 position-fixed ${
          isCollapsed ? 'px-2' : 'px-3'
        }`}
        style={{
          top: 0,
          left: 0,
          height: '100vh',
          width: isCollapsed ? '70px' : '250px',
          transition: 'width 0.3s ease',
          zIndex: 1030,
        }}
      >
        {/* Dashboard Icon - Toggle Collapse */}
        <div
          className={`d-flex align-items-center mb-4 text-primary ${
            isCollapsed ? 'justify-content-center' : ''
          }`}
          role="button"
          onClick={toggleCollapse}
          style={{
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease',
          }}
        >
          <LayoutDashboard size={24} className="me-2" title="Dashboard" />
          {!isCollapsed && <h5 className="mb-0 fw-bold">Dashboard</h5>}
        </div>

        {/* Navigation Menu */}
        <ul className="nav flex-column w-100">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-dark d-flex align-items-center"
          >
            <Home size={20} className="me-2" title="Home" />
            {!isCollapsed && 'Home'}
          </a>

          <li className="nav-item mb-2">
            <Link
              to="/dashboard/news"
              className="nav-link text-dark d-flex align-items-center"
            >
              <Newspaper size={20} className="me-2" title="News" />
              {!isCollapsed && 'News'}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/dashboard/struktur-organisasi"
              className="nav-link text-dark d-flex align-items-center"
            >
              <Users size={20} className="me-2" title="Struktur Organisasi" />
              {!isCollapsed && 'Struktur Organisasi'}
            </Link>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="mt-auto w-100">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
          >
            <LogOut size={20} className="me-2" title="Logout" />
            {!isCollapsed && (loading ? 'Logging out...' : 'Logout')}
          </button>
        </div>
      </aside>

      {/* Hamburger for Mobile */}
      <button
        className="btn btn-primary d-lg-none position-fixed top-0 start-0 m-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mobileSidebar"
        aria-controls="mobileSidebar"
        style={{ zIndex: 1040 }}
      >
        <Menu />
      </button>

      {/* Offcanvas Mobile Sidebar */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5
            className="offcanvas-title text-primary d-flex align-items-center"
            id="mobileSidebarLabel"
          >
            <LayoutDashboard size={24} className="me-2" />
            Dashboard
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column justify-content-between">
          <ul className="nav flex-column">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-dark d-flex align-items-center"
              data-bs-dismiss="offcanvas"
            >
              <Home size={20} className="me-2" />
              Home
            </a>

            <li className="nav-item mb-2">
              <Link
                to="/dashboard/news"
                className="nav-link text-dark d-flex align-items-center"
                data-bs-dismiss="offcanvas"
              >
                <Newspaper size={20} className="me-2" />
                News
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/dashboard/struktur-organisasi"
                className="nav-link text-dark d-flex align-items-center"
                data-bs-dismiss="offcanvas"
              >
                <Users size={20} className="me-2" />
                Struktur Organisasi
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="btn btn-outline-danger w-100 mt-4"
          >
            <LogOut size={20} className="me-2" />
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </>
  );
}
