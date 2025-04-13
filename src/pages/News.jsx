import NewsComponent from '../components/News';
import NewsByCategorySlider from '../components/NewsByCategorySlider';
import NewsFeatured from '../components/NewsFeatured';

/* pages/News.js */
export default function News() {
  return (
    <div className="container mt-5">
      <div>
        <NewsComponent />
        <NewsByCategorySlider categoryName={'IoT'} />
        <NewsByCategorySlider categoryName={'Science'} />
        <NewsByCategorySlider categoryName={'Artificial Intelligence'} />
      </div>
    </div>
  );
}
