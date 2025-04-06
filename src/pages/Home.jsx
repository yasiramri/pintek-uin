import React from 'react';
import NewsFeatured from '../components/NewsFeatured';
import NewsByCategorySlider from '../components/NewsByCategorySlider';

function Home() {
  return (
    <div>
      <div className="image-container">
        <img
          src="/images/image-2.png"
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
      <div className="container mt-3">
        <NewsByCategorySlider categoryName={'IoT'} />
      </div>
    </div>
  );
}

export default Home;
