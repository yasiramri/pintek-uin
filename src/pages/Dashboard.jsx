import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <DashboardNavbar />
      <div className="container mt-5">
        <h2>Dashboard</h2>
        <p>Selamat datang di Dashboard!</p>
      </div>
    </div>
  );
}