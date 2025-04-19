import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import axios from 'axios';
import { useEffect , useState } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { setBannerData,setImageURL } from './store/movieoSlice';

function App() {
  const dispatch = useDispatch()
  const [currentImage] = useState(1); // Hardcoded for now, can be dynamic later

  const bannerData = useSelector((state) => state.movieo.bannerData);
  const imageURL = useSelector((state) => state.movieo.imageURL) || 'https://image.tmdb.org/t/p/original';

  // Dynamic backdrop image with fallback
  const backgroundImage =
    bannerData?.[currentImage]?.backdrop_path
      ? `${imageURL}${bannerData[currentImage].backdrop_path}`
      : 'https://via.placeholder.com/1280x720?text=No+Image';

  const fetchTrendingData = async()=>{
    try {
        const response = await axios.get('/trending/all/week')

        dispatch(setBannerData(response.data.results))
    } catch (error) {
        console.log("error",error)
    }
  }

  const fetchConfiguration = async()=>{
    try {
        const response = await axios.get("/configuration")

        dispatch(setImageURL(response.data.images.secure_base_url+"original"))
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    fetchTrendingData()
    fetchConfiguration()
  },[])
  
  return (
   <> <div
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    className="fixed inset-0 bg-gradient-to-t blur-lg from-black/80 via-black/40 to-transparent backdrop-blur-sm pointer-events-none transition-all duration-500 z-0"
    data-aos="fade"
  />
    <main className='pb-0 lg:pb-0'>
        <Header className=''/>
        <div className='min-h-[90vh] '>
            <Outlet  />
        </div>
        <MobileNavigation/>
    </main>
    </>
  );
}

export default App