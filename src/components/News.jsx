import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllNews();
  }, []);

  const fetchAllNews = async () => {
    try {
      const response = await axios.get(
        'https://pintek-rest-production.up.railway.app/news'
      );
      const sorted = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNewsList(sorted);
    } catch (error) {
      console.error('Gagal mengambil berita:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Memuat berita...</p>;
  if (newsList.length === 0)
    return <p className="text-center mt-4">Belum ada berita.</p>;

  const highlight = newsList[0];
  const sideList = newsList.slice(1, 9); // Ambil 4 berita setelah highlight

  const getImage = (path) =>
    `https://pintek-rest-production.up.railway.app/uploads/newsImages/${
      path?.split('/').pop() || '404.png'
    }`;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Highlight */}
        <div className="col-md-8 mb-4">
          <Link
            to={`/news/${highlight.id}`}
            className="text-decoration-none text-dark"
          >
            <img
              src={getImage(highlight.imagePath)}
              alt={highlight.title}
              className="img-fluid rounded mb-3"
            />
            <p className="text-primary fw-bold">
              {highlight.category?.name || 'Kategori'}
            </p>
            <h3 className="fw-bold">{highlight.title}</h3>
          </Link>
        </div>

        {/* Side list */}
        {/* Side list */}
        <div
          className="col-md-4"
          style={{ maxHeight: '500px', overflowY: 'auto' }}
        >
          {sideList.map((item) => (
            <Link
              to={`/news/${item.id}`}
              key={item.id}
              className="d-flex mb-3 text-decoration-none text-dark"
            >
              <img
                src={getImage(item.imagePath)}
                alt={item.title}
                className="me-3 rounded"
                style={{ width: '100px', height: '70px', objectFit: 'cover' }}
              />
              <div>
                <p
                  className="text-primary fw-bold mb-1"
                  style={{ fontSize: '14px' }}
                >
                  {item.category?.name || 'Kategori'}
                </p>
                <p className="fw-semibold mb-0" style={{ fontSize: '15px' }}>
                  {item.title.length > 60
                    ? item.title.slice(0, 60) + '...'
                    : item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
