import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import DashboardNavbar from '../components/DashboardNavbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchNewsById();
    fetchCategories();
  }, []);

  const fetchNewsById = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { title, content, category, isFeatured, imagePath } = response.data;
      setTitle(title);
      setContent(content);
      setCategoryId(category.id);
      setIsFeatured(isFeatured);
      setImage(imagePath);
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
    setImage(event.target.files[0]);
  };

  const handleUpdate = async () => {
    if (!title || !content || !categoryId) {
      Swal.fire('Error', 'Harap isi semua bidang yang diperlukan.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', categoryId);
    formData.append('isFeatured', isFeatured);

    if (image instanceof File) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/news/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire('Berhasil', 'Berita berhasil diperbarui!', 'success');
      navigate('/dashboard');
    } catch (error) {
      Swal.fire('Error', 'Gagal memperbarui berita.', 'error');
      console.error('Error updating news:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Swal.fire('Error', 'Nama kategori tidak boleh kosong.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/categories',
        { name: newCategory },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire('Berhasil', 'Kategori berhasil ditambahkan!', 'success');
      fetchCategories();
      setCategoryId(response.data.id);
      setAddingCategory(false);
      setNewCategory('');
    } catch (error) {
      Swal.fire('Error', 'Gagal menambahkan kategori.', 'error');
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!newCategoryName.trim()) {
      Swal.fire('Error', 'Nama kategori tidak boleh kosong.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/categories/${editCategory.id}`,
        { name: newCategoryName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire('Berhasil', 'Kategori berhasil diperbarui!', 'success');
      setEditCategory(null);
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      Swal.fire('Error', 'Gagal memperbarui kategori.', 'error');
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Kategori ini akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:8080/categories/${categoryId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire('Dihapus!', 'Kategori telah dihapus.', 'success');
          fetchCategories();
        } catch (error) {
          Swal.fire('Error', 'Gagal menghapus kategori.', 'error');
          console.error('Error deleting category:', error);
        }
      }
    });
  };

  return (
    <div>
      <DashboardNavbar />
      <div className="container mt-5">
        <h2>Edit Berita</h2>

        <div className="card p-4 mt-3">
          {/* Judul */}
          <label className="fw-bold">Judul Berita</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Judul Berita"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Konten */}
          <label className="fw-bold">Konten Berita</label>
          <ReactQuill value={content} onChange={setContent} className="mb-2" />

          {/* Kategori */}
          <label className="fw-bold">Kategori</label>
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

          {/* Tombol Simpan & Batal */}
          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Batal Edit
            </button>
            <button className="btn btn-success" onClick={handleUpdate}>
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
