import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

const Card = ({ jabatan, nama, profileImage, color }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow w-fit max-w-xs min-w-[260px]">
      <div className="flex items-center gap-x-4">
        {!imgError && profileImage ? (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            <img
              src={`https://pintek-rest-production.up.railway.app${profileImage}`}
              alt={nama}
              className="w-full h-full object-cover aspect-square"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div
            className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white text-base font-semibold`}
          >
            {nama.charAt(0)}
          </div>
        )}
        <div className="space-y-0.5 mt-2">
          <h7 className="text-sm font-semibold text-gray-800 leading-tight">
            {jabatan}
          </h7>
          <p className="text-xs text-gray-600">{nama}</p>
        </div>
      </div>
    </div>
  );
};

const Connector = ({ vertical = true, length = 4 }) =>
  vertical ? (
    <div className={`w-0.5 h-${length} bg-gray-300`}></div>
  ) : (
    <div className={`h-0.5 w-${length} bg-gray-300`}></div>
  );

const Struktur = () => {
  const [struktur, setStruktur] = useState([]);

  useEffect(() => {
    axios
      .get('https://pintek-rest-production.up.railway.app/struktur-organisasi')
      .then((res) => setStruktur(res.data))
      .catch((err) => console.error('Gagal mengambil data struktur:', err));
  }, []);

  const findByJabatan = (title) =>
    struktur.find((item) => item.jabatan.toLowerCase() === title.toLowerCase());
  const findAllByPrefix = (prefix) =>
    struktur.filter((item) =>
      item.jabatan.toLowerCase().includes(prefix.toLowerCase())
    );

  const pembina = findByJabatan('Pembina');
  const penanggungJawab = findByJabatan('Penanggung Jawab');
  const direktur = findByJabatan('Direktur');
  const wakilDirektur = findByJabatan('Wakil Direktur');
  const sekretaris = findByJabatan('Sekretaris');
  const bendahara = findByJabatan('Bendahara');

  const timPendukung = findAllByPrefix('Kadiv');

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 mt-4">
        Struktur Organisasi
      </h1>
      <p className="text-center mb-6 text-gray-600 max-w-xl">
        Berikut adalah struktur organisasi dari Pusat Inovasi dan Teknologi UIN
        Syarifhidayatullah Jakarta.
      </p>

      <div className="flex flex-col items-center space-y-2 mb-5">
        {pembina && <Card {...pembina} color={avatarColors[0]} />}
        {penanggungJawab && (
          <>
            <Connector />
            <Card {...penanggungJawab} color={avatarColors[1]} />
          </>
        )}
        {direktur && (
          <>
            <Connector />
            <Card {...direktur} color={avatarColors[2]} />
          </>
        )}
        {wakilDirektur && (
          <>
            <Connector />
            <Card {...wakilDirektur} color={avatarColors[3]} />
          </>
        )}

        {/* Sekretaris dan Bendahara */}
        {(sekretaris || bendahara) && (
          <>
            {/* Garis vertikal dari Wakil Direktur ke bawah */}
            <div className="w-0.5 h-6 bg-gray-300 mx-auto" />

            {/* Garis horizontal dan dua card */}
            <div className="relative flex flex-col items-center mb-6">
              <div className="relative flex items-center gap-x-6">
                {/* Garis horizontal */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-[260px] h-0.5 bg-gray-300 z-0" />

                {/* Sekretaris */}
                <div className="relative z-10">
                  <Card {...sekretaris} color={avatarColors[4]} />
                </div>

                {/* Bendahara */}
                <div className="relative z-10">
                  <Card {...bendahara} color={avatarColors[5]} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <h2 className="text-xl font-semibold mt-10z">Tim Pendukung</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {timPendukung.map((item, idx) => (
          <Card
            key={item.id}
            {...item}
            color={avatarColors[(idx + 6) % avatarColors.length]}
          />
        ))}
      </div>
    </div>
  );
};

export default Struktur;
