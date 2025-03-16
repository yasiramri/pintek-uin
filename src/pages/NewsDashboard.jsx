import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function DashboardNews() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const quillTitleModules = {
    toolbar: [['header', 'bold', 'italic', 'underline']], // Header memungkinkan pengguna memilih H1
  };

  const quillContentModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
    ],
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    fetchNews();
    fetchCategories();
  }, [navigate]);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/news', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    formData.append('title', `<h1>${title}</h1>`); // Pastikan judul tersimpan dalam format H1
    formData.append('content', content);
    formData.append('image', selectedFile);
    formData.append('categoryId', categoryId);
    formData.append('isFeatured', isFeatured);

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

  const resetForm = () => {
    setEditingNews(null);
    setTitle('');
    setContent('');
    setCategoryId('');
    setIsFeatured(false);
    setSelectedFile(null);
  };

  return (
    <div>
      <DashboardNavbar />
      <div className="container mt-5">
        <h2>Dashboard - Kelola Berita</h2>

        <div className="card p-4 mt-3">
          <h4>{editingNews ? 'Edit Berita' : 'Tambah Berita'}</h4>

          {/* Quill Editor untuk Judul dengan format H1 */}
          <label className="fw-bold">Judul Berita</label>
          <ReactQuill
            value={title}
            onChange={setTitle}
            modules={quillTitleModules}
            className="mb-2"
          />

          {/* Quill Editor untuk Konten Berita */}
          <label className="fw-bold">Konten Berita</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={quillContentModules}
            className="mb-2"
          />

          <select
            className="form-control mb-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Pilih Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            className="form-control mb-2"
            onChange={handleFileChange}
            accept="image/*"
          />

          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={isFeatured}
              onChange={() => setIsFeatured(!isFeatured)}
            />
            <label className="form-check-label">
              Tampilkan sebagai berita unggulan
            </label>
          </div>

          <button
            className="btn btn-primary me-2"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading
              ? 'Processing...'
              : editingNews
              ? 'Update Berita'
              : 'Tambah Berita'}
          </button>
        </div>
      </div>
    </div>
  );
}
