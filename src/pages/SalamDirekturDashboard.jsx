/* pages/SalamDirektur.js */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

export default function SalamDirekturDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect ke login jika tidak ada token
    }
  }, [navigate]);

  return (
    <div>
      <DashboardNavbar />
      <div className="container mt-5">
        <h2>Salam Direktur</h2>
        <p>Halaman Salam Direktur.</p>
      </div>
    </div>
  );
}
