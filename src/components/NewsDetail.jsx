import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';

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
      const response = await axios.get(`http://localhost:8080/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news detail:', error);
      navigate('/'); // Redirect jika berita tidak ditemukan
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!news) return <p className="text-center mt-5">Berita tidak ditemukan.</p>;

  return (
    <div>
      <DashboardNavbar />
      <div className="container mt-5">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ⬅ Kembali
        </button>
        <div className="card p-4">
          <h1
            className="fw-bold"
            dangerouslySetInnerHTML={{ __html: news.title }}
          />
          <img
            src={`http://localhost:8080/uploads/newsImages/${news.imagePath
              .split('/')
              .pop()}`}
            alt={news.title}
            className="img-fluid rounded mb-3"
          />
          <p>
            <strong>Kategori:</strong> {news.category.name}
          </p>
          <p className="text-muted">
            Diposting pada: {new Date(news.createdAt).toLocaleDateString()}
          </p>
          <div dangerouslySetInnerHTML={{ __html: news.content }} />{' '}
          {/* Render konten berita */}
        </div>
      </div>
    </div>
  );
}
