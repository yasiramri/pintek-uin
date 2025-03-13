import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import gaya Quill

export default function DashboardNews() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [categories, setCategories] = useState([]); // State untuk menyimpan kategori
  const [categoryId, setCategoryId] = useState(''); // State untuk menyimpan kategori yang dipilih

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect ke login jika tidak ada token
    }
    fetchNews();
  }, [navigate]);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/news', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ambil kategori dari response berita
      const categories = response.data.map((item) => item.category); // Ekstrak kategori dari setiap berita
      setCategories([...new Set(categories.map((category) => category.id))]); // Hanya menyimpan ID kategori yang unik

      setNews(response.data); // Menyimpan berita
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!title || !content || !selectedFile || !categoryId) {
      Swal.fire(
        'Error',
        'Harap isi semua bidang termasuk gambar, judul, konten, dan kategori.',
        'error'
      );
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content); // Mengirimkan konten yang sudah diproses oleh Quill
    formData.append('image', selectedFile);
    formData.append('categoryId', categoryId); // Mengirimkan categoryId

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire('Berhasil', 'Berita berhasil ditambahkan!', 'success');
      fetchNews();
      resetForm();
    } catch (error) {
      Swal.fire('Error', 'Gagal menambahkan berita.', 'error');
      console.error('Error adding news:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (id) => {
    const newsToEdit = news.find((item) => item.id === id);
    setEditingNews(newsToEdit);
    setTitle(newsToEdit.title);
    setContent(newsToEdit.content);
    setCategoryId(newsToEdit.category.id); // Set categoryId saat edit
  };

  const handleUpdate = async () => {
    if (!editingNews || !title || !content || !categoryId) {
      Swal.fire(
        'Error',
        'Harap isi semua bidang judul, konten, dan kategori.',
        'error'
      );
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content); // Mengirimkan konten yang sudah diproses oleh Quill
    formData.append('categoryId', categoryId); // Mengirimkan categoryId
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/news/${editingNews.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire('Berhasil', 'Berita berhasil diperbarui!', 'success');
      fetchNews();
      resetForm();
    } catch (error) {
      Swal.fire('Error', 'Gagal memperbarui berita.', 'error');
      console.error('Error updating news:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Berita akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:8080/news/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire('Dihapus!', 'Berita telah dihapus.', 'success');
          fetchNews();
        } catch (error) {
          Swal.fire('Error', 'Gagal menghapus berita.', 'error');
          console.error('Error deleting news:', error);
        }
      }
    });
  };

  const resetForm = () => {
    setEditingNews(null);
    setTitle('');
    setContent('');
    setCategoryId('');
    setSelectedFile(null);
  };

  return (
    <div>
      <DashboardNavbar />
      <div className="container mt-5">
        <h2>Dashboard - Kelola Berita</h2>
        <div className="card p-4 mt-3">
          <h4>{editingNews ? 'Edit Berita' : 'Tambah Berita'}</h4>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="Konten Berita"
            className="mb-2"
          />
          <select
            className="form-control mb-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Pilih Kategori</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="">Tidak ada kategori tersedia</option>
            )}
          </select>
          <input
            type="file"
            className="form-control mb-2"
            onChange={handleFileChange}
            accept="image/*"
          />
          <div className="d-flex">
            <button
              className="btn btn-primary me-2"
              onClick={editingNews ? handleUpdate : handleSubmit}
              disabled={uploading}
            >
              {uploading
                ? 'Processing...'
                : editingNews
                ? 'Update Berita'
                : 'Tambah Berita'}
            </button>
            {editingNews && (
              <button className="btn btn-secondary" onClick={resetForm}>
                Batal Edit
              </button>
            )}
          </div>
        </div>
        <div className="row mt-4">
          {news.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card">
                <img
                  src={`http://localhost:8080/uploads/newsImages/${item.imagePath
                    .split('/')
                    .pop()}`}
                  className="card-img-top"
                  alt={item.title}
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.content}</p>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
