/* pages/StrukturOrganisasi.js */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function StrukturOrganisasi() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState({});
  const [uploading, setUploading] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  const jabatanList = [
    { id: 2, jabatan: 'Pembina' },
    { id: 3, jabatan: 'Penanggung Jawab' },
    { id: 4, jabatan: 'Direktur' },
    { id: 5, jabatan: 'Wakil Direktur' },
    { id: 6, jabatan: 'Bendahara' },
    { id: 7, jabatan: 'Sekretaris' },
    { id: 8, jabatan: 'Marketing' },
    { id: 9, jabatan: 'Vokasi' },
    { id: 10, jabatan: 'Pelatihan' },
    { id: 11, jabatan: 'Konsultan' },
    { id: 12, jabatan: 'R&D' },
    { id: 13, jabatan: 'Kerjasama' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect ke login jika tidak ada token
    }
    fetchAllProfiles();
  }, [navigate]);

  const fetchAllProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedProfiles = {};
      for (const { id, jabatan } of jabatanList) {
        const response = await axios.get(
          `http://localhost:8080/struktur-organisasi/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        updatedProfiles[jabatan] = response.data;
      }
      setProfiles(updatedProfiles);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleFileChange = (event, jabatan) => {
    setSelectedFiles({ ...selectedFiles, [jabatan]: event.target.files[0] });
  };

  const handleUpdate = async (id, jabatan) => {
    if (!profiles[jabatan]?.nama || !selectedFiles[jabatan]) {
      Swal.fire(
        'Error',
        'Harap isi semua bidang termasuk nama dan gambar.',
        'error'
      );
      return;
    }

    setUploading({ ...uploading, [jabatan]: true });
    const formData = new FormData();
    formData.append('nama', profiles[jabatan].nama);
    formData.append('profileImage', selectedFiles[jabatan]);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/struktur-organisasi/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire('Berhasil', 'Profil berhasil diperbarui!', 'success');
      fetchAllProfiles();
    } catch (error) {
      Swal.fire('Error', 'Gagal memperbarui profil.', 'error');
      console.error('Update Error:', error);
    } finally {
      setUploading({ ...uploading, [jabatan]: false });
    }
  };

  return (
    <div>
      <DashboardNavbar />
      <div className="container mt-5">
        <h2>Dashboard - Struktur Organisasi</h2>
        <div className="row mt-4">
          {jabatanList.map(({ id, jabatan }) => (
            <div className="col-md-4 mb-4" key={id}>
              <div className="card" style={{ width: '100%' }}>
                <img
                  src={
                    profiles[jabatan]?.profileImage
                      ? `http://localhost:8080/uploads/strukturOrganisasi/${profiles[
                          jabatan
                        ].profileImage
                          .split('/')
                          .pop()}`
                      : 'https://via.placeholder.com/250'
                  }
                  className="card-img-top"
                  alt="Profile"
                  style={{ maxHeight: '250px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{jabatan}</h5>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={profiles[jabatan]?.nama || ''}
                    onChange={(e) => {
                      setProfiles({
                        ...profiles,
                        [jabatan]: {
                          ...profiles[jabatan],
                          nama: e.target.value,
                        },
                      });
                    }}
                    placeholder={`Nama ${jabatan}`}
                  />
                  <input
                    type="file"
                    className="form-control mb-2"
                    onChange={(event) => handleFileChange(event, jabatan)}
                    accept="image/*"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdate(id, jabatan)}
                    disabled={uploading[jabatan]}
                  >
                    {uploading[jabatan] ? 'Updating...' : 'Update Profil'}
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
