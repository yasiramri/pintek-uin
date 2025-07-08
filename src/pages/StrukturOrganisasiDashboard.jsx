import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SidebarDashboard from '../components/DashboardNavbar';
import api from '../utils/axios';

const avatarColors = [
  'bg-blue-300',
  'bg-purple-300',
  'bg-green-300',
  'bg-yellow-300',
  'bg-pink-300',
  'bg-red-300',
  'bg-indigo-300',
  'bg-orange-300',
];

const Card = ({
  id,
  jabatan,
  nama,
  profileImage,
  color,
  onConfirmSave,
  onImageChange,
  onNameChange,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center bg-white px-5 py-4 rounded-lg shadow-md w-full max-w-lg">
      <div className="flex items-center gap-x-4 mr-6">
        {!imgError && profileImage ? (
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
            <img
              src={
                profileImage.startsWith('blob:')
                  ? profileImage
                  : `https://pintek-rest-production.up.railway.app${profileImage}`
              }
              alt={nama}
              className="w-full h-full object-cover aspect-square"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div
            className={`w-20 h-20 rounded-full ${color} flex items-center justify-center text-white text-2xl font-semibold`}
          >
            {nama.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-col w-full space-y-3">
        <h3 className="text-sm font-medium text-gray-800 text-center">
          {jabatan}
        </h3>

        <input
          type="text"
          value={nama}
          onChange={(e) => onNameChange(id, e.target.value)}
          className="text-xs text-gray-600 border-b border-gray-300 py-2 w-full text-center mb-2"
          placeholder="Edit Nama"
        />

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImgError(false);
              onImageChange(id, e);
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="border border-gray-300 rounded-lg py-2 px-4 text-gray-600 flex justify-between items-center mb-2">
            <span>Upload Foto</span>
            <span className="text-sm text-gray-400">Klik untuk ganti</span>
          </div>
        </div>

        <button
          onClick={() => onConfirmSave(id)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg w-full"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

const StrukturOrganisasiDashboard = () => {
  const [struktur, setStruktur] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [editedNames, setEditedNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchStruktur(token);
    }
  }, [navigate]);

  const fetchStruktur = (token) => {
    api
      .get('/struktur-organisasi')
      .then((res) => {
        const sorted = res.data.sort((a, b) => a.id - b.id);
        setStruktur(sorted);

        const namesMap = {};
        sorted.forEach((item) => {
          namesMap[item.id] = item.nama;
        });
        setEditedNames(namesMap);
      })
      .catch((err) => {
        console.error('Gagal mengambil data struktur:', err);
        if (err.response?.status === 401) {
          Swal.fire('Sesi Habis', 'Silakan login ulang.', 'warning');
          navigate('/login');
        }
      });
  };

  const handleImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImages((prev) => ({
        ...prev,
        [id]: {
          preview: previewUrl,
          file,
        },
      }));
    }
  };

  const handleNameChange = (id, newName) => {
    setEditedNames((prev) => ({
      ...prev,
      [id]: newName,
    }));
  };

  const handleConfirmSave = (id) => {
    Swal.fire({
      title: 'Simpan Perubahan?',
      text: 'Apakah kamu yakin ingin menyimpan perubahan ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Simpan',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSave(id);
      }
    });
  };

  const handleSave = (id) => {
    const selected = selectedImages[id];
    const file = selected?.file;
    const nama = editedNames[id];
    const existing = struktur.find((item) => item.id === id);
    const jabatan = existing?.jabatan || '';
    const token = localStorage.getItem('token');

    const isNameChanged = nama !== existing.nama;
    const isImageChanged = file instanceof File;

    if (!isNameChanged && !isImageChanged) {
      Swal.fire({
        icon: 'info',
        title: 'Tidak Ada Perubahan',
        text: 'Silakan edit nama atau unggah foto terlebih dahulu.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('jabatan', jabatan);

    if (isImageChanged) {
      formData.append('profileImage', file);
    } else {
      formData.append('profileImage', existing.profileImage || '');
    }

    api
      .put(`/struktur-organisasi/${id}`, formData)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data berhasil diperbarui.',
          timer: 2000,
          showConfirmButton: false,
        });

        setStruktur((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  profileImage: res.data.profileImage || item.profileImage,
                  nama,
                }
              : item
          )
        );

        setSelectedImages((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menyimpan perubahan.',
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <SidebarDashboard />
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Dashboard Admin - Struktur Organisasi
      </h1>
      <p className="text-center mb-8 text-gray-600 max-w-xl">
        Berikut adalah struktur organisasi yang dapat diupdate.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        {struktur.map((item, idx) => (
          <Card
            key={item.id}
            id={item.id}
            jabatan={item.jabatan}
            nama={editedNames[item.id] || item.nama}
            profileImage={
              selectedImages[item.id]?.file
                ? selectedImages[item.id].preview
                : item.profileImage
            }
            color={avatarColors[idx % avatarColors.length]}
            onConfirmSave={handleConfirmSave}
            onImageChange={handleImageChange}
            onNameChange={handleNameChange}
          />
        ))}
      </div>
    </div>
  );
};

export default StrukturOrganisasiDashboard;
