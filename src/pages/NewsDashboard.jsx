import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../utils/axios';
import Select from 'react-select';

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
  const [addingCategory, setAddingCategory] = useState(false); // Menampilkan input tambah kategori
  const [editCategory, setEditCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    setFilteredNews(
      news.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, news]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    fetchNews();
    fetchCategories();
  }, [navigate]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'image',
    'video',
  ];

  const fetchNews = async () => {
    try {
      const response = await api.get('/news');
      setNews(response.data);
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

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Swal.fire('Error', 'Nama kategori tidak boleh kosong.', 'error');
      return;
    }

    try {
      const response = await api.post('/categories', { name: newCategory });

      Swal.fire('Berhasil', 'Kategori berhasil ditambahkan!', 'success');
      fetchCategories();
      setCategoryId(response.data.id); // Pilih kategori baru yang baru ditambahkan
      setAddingCategory(false); // Sembunyikan input
      setNewCategory(''); // Reset input kategori baru
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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!title || !content || !categoryId) {
      Swal.fire(
        'Error',
        'Harap isi judul, konten, dan kategori. (Gambar opsional)',
        'error'
      );
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', categoryId);
    formData.append('isFeatured', isFeatured ? 'true' : 'false');

    // Hanya kirim image jika dipilih
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      await api.post('/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-news/${id}`);
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
          await api.delete(`/news/${id}`);

          Swal.fire('Dihapus!', 'Berita telah dihapus.', 'success');
          fetchNews();
        } catch (error) {
          Swal.fire('Error', 'Gagal menghapus berita.', 'error');
          console.error('Error deleting news:', error);
        }
      }
    });
  };

  return (
    <div className="d-flex">
      <DashboardNavbar />
      <div className="container mt-5">
        <h2>Dashboard - Kelola Berita</h2>

        {/* Form Tambah Berita */}
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
            modules={quillModules}
            formats={quillFormats}
            className="mb-2"
          />

          {/* Dropdown Kategori + Tambah, Edit, & Hapus Kategori */}
          {addingCategory ? (
            <div className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Nama Kategori Baru"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button className="btn btn-success" onClick={handleAddCategory}>
                Simpan
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => setAddingCategory(false)}
              >
                Batal
              </button>
            </div>
          ) : (
            <div className="mb-2">
              <div className="d-flex gap-2 mb-2">
                <div style={{ flex: 1 }}>
                  <Select
                    options={[
                      { value: '', label: 'Pilih Kategori' },
                      ...categories.map((category) => ({
                        value: category.id,
                        label: category.name,
                      })),
                      { value: 'new', label: '+ Tambah Kategori Baru' },
                    ]}
                    value={
                      categories.find((cat) => cat.id === categoryId)
                        ? {
                            value: categoryId,
                            label: categories.find(
                              (cat) => cat.id === categoryId
                            )?.name,
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      if (selectedOption.value === 'new') {
                        setAddingCategory(true);
                      } else {
                        setCategoryId(selectedOption.value);
                      }
                    }}
                    placeholder="Pilih Kategori"
                    styles={{
                      control: (base) => ({
                        ...base,
                        height: 40,
                        borderRadius: 8,
                        paddingLeft: 4,
                        borderColor: '#ced4da',
                        boxShadow: 'none',
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>

                <button
                  className="btn btn-warning btn-sm"
                  disabled={!categoryId}
                  onClick={() => {
                    const selectedCategory = categories.find(
                      (cat) => cat.id == categoryId
                    );
                    setEditCategory(selectedCategory);
                    setNewCategoryName(selectedCategory.name);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={!categoryId}
                  onClick={() => handleDeleteCategory(categoryId)}
                >
                  Hapus
                </button>
              </div>
            </div>
          )}

          {/* Modal Edit Kategori */}
          {editCategory && (
            <div className="modal show d-block">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Kategori</h5>
                    <button
                      className="btn-close"
                      onClick={() => setEditCategory(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditCategory(null)}
                    >
                      Batal
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={handleUpdateCategory}
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            onClick={editingNews ? handleUpdate : handleSubmit}
            disabled={uploading}
          >
            {uploading
              ? 'Processing...'
              : editingNews
              ? 'Update Berita'
              : 'Tambah Berita'}
          </button>
        </div>

        {/* Input Search */}
        <div className="mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Cari berita berdasarkan judul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List Berita dalam bentuk Card */}
        <div className="row">
          {filteredNews.length === 0 ? (
            <p className="text-center">Tidak ada berita ditemukan.</p>
          ) : (
            filteredNews.map((item) => (
              <div className="col-md-4 mb-4" key={item.id}>
                <div className="card shadow-sm">
                  <img
                    src={`https://pintek-rest-production.up.railway.app/uploads/newsImages/${
                      item.imagePath?.split('/').pop() || '404.png'
                    }`}
                    className="card-img-top"
                    alt={item.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />

                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">
                      {item.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                      ...
                    </p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
