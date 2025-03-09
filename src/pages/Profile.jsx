import React from "react";
import Sejarah from "../components/Sejarah";
import Visi from "../components/Visi";
import SalamDirektur from "../components/SalamDirektur";

function Profile() {
  return (
    <div>
      <div className="image-container">
        <img
          src="/public/images/image 2.png"
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
      <div>
        <SalamDirektur />
      </div>
    </div>
  );
}

export default Profile;
