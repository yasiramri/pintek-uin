/* components/DashboardNavbar.js */
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
