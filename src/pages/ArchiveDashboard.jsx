import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap for styling
import DashboardNavbar from '../components/DashboardNavbar'; // Mengimpor Navbar

const ArchiveDashboard = () => {
  const [archivedArticles, setArchivedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const imageBaseUrl = 'https://pintek-rest-production.up.railway.app';

  // Ambil URL API yang tepat berdasarkan lingkungan
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fungsi untuk mendapatkan artikel yang diarsipkan
  useEffect(() => {
    const fetchArchivedArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://pintek-rest-production.up.railway.app/archive`
        );
        if (response.data.status === 'success') {
          setArchivedArticles(response.data.data.archivedArticles);
        }
      } catch (error) {
        console.error('Error fetching archived articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedArticles();
  }, [apiUrl]);

  // Fungsi untuk mengembalikan artikel (restore)
  const restoreArticle = async (id, title) => {
    const result = await Swal.fire({
      title: `Restore article "${title}"?`,
      text: 'Are you sure you want to restore this article?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        await axios.post(
          `https://pintek-rest-production.up.railway.app/archive/restore/${id}`
        );
        setArchivedArticles(
          archivedArticles.filter((article) => article.id !== id)
        );
        Swal.fire('Restored!', 'The article has been restored.', 'success');
      } catch (error) {
        console.error('Error restoring article:', error);
        Swal.fire('Error!', 'Failed to restore the article.', 'error');
      }
    }
  };

  // Fungsi untuk menghapus artikel secara permanen
  const hardDeleteArticle = async (id, title) => {
    const result = await Swal.fire({
      title: `Delete article "${title}" permanently?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://pintek-rest-production.up.railway.app/archive/hard-delete/${id}`
        );
        setArchivedArticles(
          archivedArticles.filter((article) => article.id !== id)
        );
        Swal.fire(
          'Deleted!',
          'The article has been permanently deleted.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting article:', error);
        Swal.fire('Error!', 'Failed to delete the article.', 'error');
      }
    }
  };

  return (
    <div className="container mt-5">
      <DashboardNavbar /> {/* Menampilkan NavbarDashboard */}
      <h1 className="mb-4">Archived Articles</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {archivedArticles.length > 0 ? (
            archivedArticles.map((article) => (
              <div className="col-md-4 mb-4" key={article.id}>
                <div className="card">
                  <img
                    src={`${imageBaseUrl}${article.imagePath}`}
                    alt="Article"
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{article.title}</h5>
                    <div
                      className="card-text"
                      dangerouslySetInnerHTML={{
                        __html: article.content.slice(0, 100) + '...',
                      }}
                    />
                    <div className="d-flex justify-content-between">
                      <button
                        onClick={() =>
                          restoreArticle(article.id, article.title)
                        }
                        className="btn btn-success"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() =>
                          hardDeleteArticle(article.id, article.title)
                        }
                        className="btn btn-danger"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No archived articles found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ArchiveDashboard;
