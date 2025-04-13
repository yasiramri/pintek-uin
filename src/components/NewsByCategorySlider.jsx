import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NewsByCategorySlider = ({ categoryName }) => {
  const [categoryNews, setCategoryNews] = useState([]);

  useEffect(() => {
    fetchCategoryNews();
  }, [categoryName]);

  const fetchCategoryNews = async () => {
    try {
      const response = await axios.get(
        'https://pintek-rest-production.up.railway.app/news'
      );
      const filteredNews = response.data.filter(
        (item) =>
          item.category &&
          item.category.name.toLowerCase() === categoryName.toLowerCase()
      );
      setCategoryNews(filteredNews);
    } catch (error) {
      console.error('Error fetching category news:', error);
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600, // Mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    arrows: true,
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">{categoryName}</h2>
      {categoryNews.length === 0 ? (
        <p>Tidak ada berita dalam kategori ini.</p>
      ) : (
        <Slider {...sliderSettings}>
          {categoryNews.map((item) => (
            <div key={item.id} className="p-2">
              <div
                className="rounded shadow-sm p-3 bg-white h-100 d-flex flex-column"
                style={{ height: '100%' }}
              >
                {/* Gambar */}
                <Link to={`/news/${item.id}`} className="mb-2 text-center">
                  <img
                    src={`https://pintek-rest-production.up.railway.app/uploads/newsImages/${
                      item.imagePath?.split('/').pop() || '404.png'
                    }`}
                    alt={item.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: '180px', objectFit: 'cover' }}
                  />
                </Link>

                {/* Kategori */}
                <span className="text-primary fw-bold mt-2">
                  {item.category?.name}
                </span>

                {/* Judul */}
                <h5 className="fw-bold mt-1" style={{ fontSize: '16px' }}>
                  {item.title.replace(/<[^>]+>/g, '')}
                </h5>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default NewsByCategorySlider;
