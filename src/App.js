import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import MobileNavigation from './components/MobileNavigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBannerData, setImageURL } from './store/movieoSlice';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [currentImage] = useState(1); // Hardcoded for now, can be dynamic later

  const bannerData = useSelector((state) => state.movieo.bannerData);
  const imageURL = useSelector((state) => state.movieo.imageURL) || 'https://image.tmdb.org/t/p/original';

  // Determine background image based on route
  const isExplorePage = location.pathname.includes('/explore');
  const backgroundImage = isExplorePage
    ? 'none'
    : bannerData?.[currentImage]?.backdrop_path
      ? `${imageURL}${bannerData[currentImage].backdrop_path}`
      : 'https://via.placeholder.com/1280x720?text=No+Image';

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/trending/all/week', {
        params: { api_key: process.env.REACT_APP_TMDB_API_KEY },
      });
      dispatch(setBannerData(response.data.results));
    } catch (error) {
      console.error('Error fetching trending data:', error);
    }
  };

  const fetchConfiguration = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/configuration', {
        params: { api_key: process.env.REACT_APP_TMDB_API_KEY },
      });
      dispatch(setImageURL(response.data.images.secure_base_url + 'original'));
    } catch (error) {
      console.error('Error fetching configuration:', error);
    }
  };

  useEffect(() => {
    fetchTrendingData();
    fetchConfiguration();
  }, [dispatch]);

  return (
    <>
      {/* Dynamic Backdrop with Frosted Glass Overlay */}
      <div
        style={{
          backgroundImage: backgroundImage === 'none' ? 'none' : `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className={`fixed inset-0 transition-all blur-lg first-line: duration-500 z-0 pointer-events-none ${
          backgroundImage === 'none'
            ? ''
            : 'bg-gradient-to-t from-black/80 via-black/40 to-transparent  backdrop-blur-lg'
        }`}
        data-aos="fade"
      />

      {/* Main Content */}
      <main className="relative z-10 text-neutral-900    dark:text-white transition-all duration-300 pb-0 lg:pb-0">
        <div className="min-h-[90vh]   ">
          <Header className="backdrop-blur-lg" />
          <Outlet  />
          <MobileNavigation />
        </div>
      </main>
    </>
  );
}

export default App;