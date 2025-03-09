import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-sections">
        {/* Section 1 */}
        <div className="footer-section footer-logo-text">
          <div className="foot-logo">
            <img
              src="/public/images/logo-footer.png"
              alt="Logo"
              className="footer-logo"
            />
            <p className="footer-text">
              PUSAT INOVASI SAINS DAN TEKNOLOGI UIN <br />
              SYARIF HIDAYATULLAH JAKARTA
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="footer-section">
          <h5>PROFILE</h5>
          <ul className="section-listul">
            <li>
              <a href="#visi-misi">Visi & Misi</a>
            </li>
            <li className="section-list">
              <a href="#salam-direktur">Salam Direktur</a>
            </li>
            <li className="section-list">
              <a href="#struktur-organisasi">Struktur Organisasi</a>
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="footer-section">
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
        <div className="footer-section">
          <h5>Kontak</h5>
          <ul className="section-listul">
            <li>
              <a
                href="https://maps.google.com/?q=Gedung FST UIN Jakarta, Lantai 1, Jl. Lkr. Kampus 1, Cempaka Putih, Ciputat Timur, South Tangerarang City, Banten 15412"
                target="_blank"
                rel="noopener noreferrer"
              >
                Alamat: <br></br> Gedung FST UIN Jakarta, Lantai 1, Jl. Lkr.
                Kampus 1, Cempaka Putih, Ciputat Timur, South Tangerarang City,
                Banten 15412
              </a>
            </li>
            <li className="section-listul">
              <a href="mailto:pintekuin@gmail.com">
                Email: <br></br>pintekuin@gmail.com
              </a>
            </li>
            <li className="section-listul">
              <a href="tel:+6281234567890">
                Telepon: <br></br>(021) 7401925
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>Copyright &copy; 2024 PINTEK UIN</p>
      </div>
    </footer>
  );
};

export default Footer;
