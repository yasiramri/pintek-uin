import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="/images/Logo-Pintek-outer-glow.png"
            alt="Lokal Influencer"
            height="40"
          />
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
              <Link className="nav-link biru" to="/">
                Beranda
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle biru"
                to="/tentangkami"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded={isDropdownOpen ? 'true' : 'false'}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Tentang Kami
              </Link>
              <ul
                className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
                aria-labelledby="navbarDropdown"
              >
                <li>
                  <a className="dropdown-item" href="#visi-misi">
                    Visi Misi
                  </a>
                </li>
                <li>
                  <Link className="dropdown-item biru" to="/salam-direktur">
                    Salam Direktur
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item biru"
                    to="/struktur-organisasi"
                  >
                    Struktur Organisasi
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link biru" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
