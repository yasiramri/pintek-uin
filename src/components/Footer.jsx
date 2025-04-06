import React from 'react';

const Footer = () => {
  return (
    <footer className="footer px-4 py-8">
      <div className="footer-sections flex flex-wrap gap-6 justify-between">
        {/* Section 1 */}
        <div className="footer-section footer-logo-text w-full sm:w-1/2 lg:w-1/4">
          <div className="foot-logo">
            <img
              src="/images/logo-footer.png"
              alt="Logo"
              className="footer-logo"
            />
            <p className="footer-text mt-2">
              PUSAT INOVASI SAINS DAN TEKNOLOGI UIN <br />
              SYARIF HIDAYATULLAH JAKARTA
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="footer-section w-full sm:w-1/2 lg:w-1/4">
          <h5>PROFILE</h5>
          <ul className="section-listul">
            <li>
              <a href="/tentangkami#visi-misi">Visi & Misi</a>
            </li>
            <li className="section-list">
              <a href="/tentangkami#salam-direktur">Salam Direktur</a>
            </li>
            <li className="section-list">
              <a href="/struktur-organisasi">Struktur Organisasi</a>
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="footer-section w-full sm:w-1/2 lg:w-1/4">
          <h5>Program Profesional</h5>
          <ul className="section-listul">
            <li>
              <a href="#keuangan-syariah">Teknologi Keuangan Syariah</a>
            </li>
            <li className="section-list">
              <a href="#digital-marketing">Digital Marketing</a>
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="footer-section w-full sm:w-1/2 lg:w-1/4">
          <h5>Kontak</h5>
          <ul className="section-listul">
            <li>
              <a
                href="https://maps.google.com/?q=Gedung FST UIN Jakarta, Lantai 1, Jl. Lkr. Kampus 1, Cempaka Putih, Ciputat Timur, South Tangerarang City, Banten 15412"
                target="_blank"
                rel="noopener noreferrer"
              >
                Alamat: <br />
                Gedung FST UIN Jakarta, Lantai 1, Jl. Lkr. Kampus 1, Cempaka
                Putih, Ciputat Timur, South Tangerang
              </a>
            </li>
            <li className="section-listul mt-2">
              <a href="mailto:pintekuin@gmail.com">
                Email: <br />
                pintekuin@gmail.com
              </a>
            </li>
            <li className="section-listul mt-2">
              <a href="tel:+6281234567890">
                Telepon: <br />
                (021) 7401925
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom text-center mt-8">
        <p>&copy; 2024 PINTEK UIN</p>
      </div>
    </footer>
  );
};

export default Footer;
