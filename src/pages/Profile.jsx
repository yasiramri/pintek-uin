import React, { useEffect } from 'react';
import Sejarah from '../components/Sejarah';
import Visi from '../components/Visi';
import SalamDirektur from '../components/SalamDirektur';
import { useLocation } from 'react-router-dom';

function Profile() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div>
      <div className="image-container">
        <img
          src="/images/image-2.png"
          alt="background"
          className="background-image"
        />
        <div className="text-overlay">Tentang PINTEK UIN Jakarta</div>
      </div>
      <div className="profile-judul">
        <h1>Tentang Kami</h1>
      </div>
      <div className="profile-item">
        <Sejarah />
      </div>
      <div id="visi-misi" className="profile-item">
        <Visi />
      </div>
      <div id="salam-direktur" className="profile-item">
        <SalamDirektur />
      </div>
    </div>
  );
}

export default Profile;
