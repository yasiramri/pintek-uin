import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axios';
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
      const response = await api.get(`/news/${id}`);

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
      const response = await api.get('/categories');
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
    formData.append('isFeatured', isFeatured ? 'true' : 'false');

    if (image instanceof File) {
      formData.append('image', image);
    } else if (typeof image === 'string') {
      formData.append('imagePath', image); // Kirim path lama sebagai pengganti
    }

    try {
      await api.put(`/news/${id}`, formData);
      Swal.fire('Berhasil', 'Berita berhasil diperbarui!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error response data:', error.response?.data);
      Swal.fire('Error', 'Gagal memperbarui berita.', 'error');
    }

    try {
      await api.put(`/news/${id}`, formData);

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
      const response = await api.post('/categories', { name: newCategory });

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
      await api.put(`/categories/${editCategory.id}`, {
        name: newCategoryName,
      });

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
          await api.delete(`/categories/${categoryId}`);

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

          {/* Gambar */}
          <label className="fw-bold">Gambar</label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-2"
            onChange={handleFileChange}
          />

          {/* Preview gambar lama atau yang dipilih */}
          {image && (
            <div className="mb-2">
              <label className="fw-bold">Preview Gambar</label>
              <div>
                <img
                  src={
                    image instanceof File
                      ? URL.createObjectURL(image)
                      : `http://localhost:8080${image}`
                  }
                  alt="Preview"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </div>
            </div>
          )}

          {/* Featured Toggle */}
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="featuredSwitch"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <label
              className="form-check-label fw-bold"
              htmlFor="featuredSwitch"
            >
              Tandai sebagai Berita Unggulan
            </label>
          </div>

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
