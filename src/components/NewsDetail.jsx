import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
  }, []);

  const fetchNewsDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://pintek-rest-production.up.railway.app/news/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news detail:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!news)
    return <p className="text-center mt-5">Artikel tidak ditemukan.</p>;

  const imageUrl = `https://pintek-rest-production.up.railway.app${news.imagePath}`;
  const authorName = news.author?.username || 'Admin';
  const initial = authorName.charAt(0).toUpperCase();
  const formattedDate = new Date(news.createdAt).toLocaleDateString();

  return (
    <div className="container my-5" style={{ maxWidth: '800px' }}>
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Kembali
      </button>

      <div className="text-muted small mb-2 d-flex gap-2 flex-wrap">
        <span>📂 {news.category?.name}</span>
        <span>•</span>
        <span>{formattedDate}</span>
      </div>

      <h1
        className="fw-bold mb-3"
        dangerouslySetInnerHTML={{ __html: news.title }}
      />

      {/* Author Section */}
      <div className="d-flex align-items-center mb-4">
        <div
          className="me-2 d-flex justify-content-center align-items-center text-white bg-primary"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          {initial}
        </div>
        <div>
          <strong>{authorName}</strong> <br />
          <span className="text-muted small">Pintek Author</span>
        </div>
      </div>

      <img src={imageUrl} alt={news.title} className="img-fluid rounded mb-4" />

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {/* {news.isFeatured && (
        <div className="alert alert-warning mt-4">
          🔥 <strong>Berita Unggulan</strong> – Artikel ini dipilih sebagai
          sorotan penting.
        </div>
      )} */}

      {/* Social Share */}
      {/* <div className="mt-3">
        <small className="text-muted me-2">Share:</small>
        <a href="#" className="me-2 text-decoration-none">
          🐦
        </a>
        <a href="#" className="me-2 text-decoration-none">
          📘
        </a>
        <a href="#" className="me-2 text-decoration-none">
          📌
        </a>
        <a href="#" className="text-decoration-none">
          💼
        </a>
      </div> */}
    </div>
  );
}
