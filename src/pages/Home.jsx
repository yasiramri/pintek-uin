import React from 'react';
import NewsFeatured from '../components/NewsFeatured';

function Home() {
  return (
    <div>
      <div className="image-container">
        <img
          src="/public/images/image 2.png"
          alt="background"
          className="background-image"
        />
        <div className="text-overlay">
          Pusat Inovasi dan Teknologi UIN Syarifhidayatullah Jakarta
        </div>
      </div>
      <div className="container mt-5">
        <NewsFeatured />
      </div>
    </div>
  );
}

export default Home;
