import NewsComponent from '../components/News';

/* pages/News.js */
export default function News() {
  return (
    <div className="container mt-5">
      <h2>Public News</h2>
      <p>Berita yang dapat diakses oleh semua orang.</p>

      <div>
        <NewsComponent />
      </div>
    </div>
  );
}
