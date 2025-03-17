import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewsFeatured = () => {
  const [featuredNews, setFeaturedNews] = useState([]);

  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  const fetchFeaturedNews = async () => {
    try {
      const response = await axios.get('http://localhost:8080/news');
      const filteredNews = response.data
        .filter((item) => item.isFeatured) // Hanya berita unggulan
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Urutkan dari terbaru
        .slice(0, 2); // Ambil 2 berita unggulan terbaru

      setFeaturedNews(filteredNews);
    } catch (error) {
      console.error('Error fetching featured news:', error);
    }
  };

  // Fungsi untuk mengekstrak hanya tag <p> dari konten berita
  const extractParagraphs = (htmlContent) => {
    const matches = htmlContent.match(/<p[^>]*>.*?<\/p>/g); // Ambil semua tag <p>
    return matches ? matches.join(' ') : ''; // Gabungkan hasilnya jika ada
  };

  return (
    <div className="container mt-5">
      <div className="row" style={{ fontSize: '16px' }}>
        {featuredNews.length === 0 ? (
          <p className="text-center">Tidak ada berita unggulan.</p>
        ) : (
          featuredNews.map((item) => (
            <div
              className="col-12 col-md-6"
              key={item.id}
              style={{ fontSize: '16px' }}
            >
              <div className="row" style={{ fontSize: '16px' }}>
                <div
                  className="col mb-2 card-top-news p-3"
                  style={{ fontSize: '16px' }}
                >
                  {/* Badge Kategori Bootstrap */}
                  {item.category && (
                    <span className="badge bg-dark mb-2">
                      {item.category.name}
                    </span>
                  )}

                  {/* Gambar berita dengan efek hover */}
                  <div className="text-black bg-body-secondary mb-3 text-center post-images header-images news-image-container">
                    <Link to={`/news/${item.id}`} title={item.title}>
                      <img
                        className="news-image"
                        src={`http://localhost:8080/uploads/newsImages/${item.imagePath
                          .split('/')
                          .pop()}`}
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  {/* Judul berita (Menggunakan H1) */}
                  <h1
                    className="fw-bold text-dark mt-3"
                    style={{ fontSize: '24px' }}
                  >
                    {item.title.replace(/<[^>]+>/g, '')}{' '}
                    {/* Hapus tag HTML dari title */}
                  </h1>

                  {/* Konten berita (Hanya menampilkan <p> dari Quill) */}
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#444',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3, // Batasi 3 baris agar tidak terlalu panjang
                    }}
                    dangerouslySetInnerHTML={{
                      __html: extractParagraphs(item.content),
                    }}
                  />

                  {/* Tombol Baca Selengkapnya */}
                  <Link
                    to={`/news/${item.id}`}
                    className="btn btn-primary mt-2"
                    style={{ fontSize: '14px' }}
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeatured;
