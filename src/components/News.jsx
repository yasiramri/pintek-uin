import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export default function NewsComponent() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:8080/news');
      const sortedNews = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNews(sortedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading news...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row" style={{ fontSize: '16px' }}>
        {news.slice(0, 2).map((item, index) => (
          <div
            className="col-12 col-md-6"
            key={item.id}
            style={{ fontSize: '16px' }}
          >
            <div className="row" style={{ fontSize: '16px' }}>
              <div
                className="col mb-2 card-top-news"
                style={{ fontSize: '16px' }}
              >
                <h2 className="title mb-3" style={{ fontSize: '12.8px' }}>
                  {index === 0 ? 'Sambutan Rektor' : 'Sorotan'}
                </h2>
                <div
                  className="text-black bg-body-secondary mb-3 text-center post-images header-images"
                  style={{ fontSize: '16px' }}
                >
                  <a
                    href={`/news/${item.id}`}
                    title={item.title}
                    style={{ fontSize: '16px' }}
                  >
                    <img
                      className="img-fluid news-image"
                      src={`http://localhost:8080/uploads/newsImages/${item.imagePath
                        .split('/')
                        .pop()}`}
                      alt={item.title}
                    />
                  </a>
                </div>
                <h3 className="fs-6 fw-semibold" style={{ fontSize: '16px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '14.24px' }}>
                  {item.content.substring(0, 300)}...
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
