import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { setBannerData, setImageURL } from '../store/movieoSlice'; // Adjust path
import LoadingSpinner from '../Loading/LoadingSpinner';
import ErrorMessage from '../Loading/ErrorMessage';

const BannerHome = () => {
  const dispatch = useDispatch();
  const bannerData = useSelector((state) => state.movieo.bannerData);
  const imageURL = useSelector((state) => state.movieo.imageURL);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  // Fetch TMDB data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const configResponse = await axios.get(
          'https://api.themoviedb.org/3/configuration',
          { params: { api_key: process.env.REACT_APP_TMDB_API_KEY } }
        );
        dispatch(setImageURL(configResponse.data.images.secure_base_url + 'original'));

        const bannerResponse = await axios.get(
          'https://api.themoviedb.org/3/trending/all/day',
          { params: { api_key: process.env.REACT_APP_TMDB_API_KEY } }
        );
        dispatch(setBannerData(bannerResponse.data.results));
      } catch (err) {
        console.error('Failed to fetch TMDB data:', err);
        setError(err.response?.data?.status_message || 'Failed to load banner data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // Dynamically set dimensions with responsive adjustments
  useEffect(() => {
    const updateDimensions = () => {
      const containers = document.querySelectorAll('.banner-image-container');
      const overlays = document.querySelectorAll('.banner-overlay');
      const width = window.innerWidth;
      const height = window.innerHeight;

      containers.forEach((container) => {
        if (container) {
          container.style.width = `${width}px`;
          container.style.height = `${height}px`;
        }
      });

      overlays.forEach((overlay) => {
        if (overlay) {
          overlay.style.width = `${width}px`;
          overlay.style.height = `${height}px`;
        }
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleNext = useCallback(() => {
    if (!bannerData?.length) return;
    setCurrentImage((prev) => (prev < bannerData.length - 1 ? prev + 1 : 0));
  }, [bannerData?.length]);

  const handlePrevious = useCallback(() => {
    if (!bannerData?.length) return;
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : bannerData.length - 1));
  }, [bannerData?.length]);

  useEffect(() => {
    if (!bannerData?.length) return;
    intervalRef.current = setInterval(handleNext, 5000);
    return () => clearInterval(intervalRef.current);
  }, [handleNext, bannerData?.length]);

  const handleMouseEnter = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!bannerData?.length) return;
    intervalRef.current = setInterval(handleNext, 5000);
  }, [handleNext, bannerData?.length]);

  const handleTouchStart = useCallback((e) => {
    if (!containerRef.current) return;
    containerRef.current.dataset.touchStartX = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!containerRef.current?.dataset.touchStartX) return;
      const touchStartX = parseFloat(containerRef.current.dataset.touchStartX);
      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchCurrentX - touchStartX;

      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) handlePrevious();
        else handleNext();
        containerRef.current.dataset.touchStartX = '';
      }
    },
    [handleNext, handlePrevious]
  );

  const handleTouchEnd = useCallback(() => {
    if (containerRef.current) containerRef.current.dataset.touchStartX = '';
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
    };
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  if (error) {
    return (
      <section className="w-full min-h-screen flex justify-center items-center bg-white/20 dark:bg-neutral-900/20 backdrop-blur-glass">
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (loading) {
    return (
      <section className="w-full min-h-screen flex justify-center items-center bg-white/20 dark:bg-neutral-900/20 backdrop-blur-glass">
        <LoadingSpinner />
      </section>
    );
  }

  if (!bannerData || !Array.isArray(bannerData) || !bannerData.length || !imageURL) {
    return (
      <section className="w-full min-h-screen flex justify-center items-center bg-white/20 dark:bg-neutral-900/20 backdrop-blur-glass">
        <ErrorMessage message="No banner data available." />
      </section>
    );
  }

  return (
    <section
      className="  w-full h-screen m-0 p-0 overflow-hidden relative"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative flex h-full overflow-hidden">
        {bannerData.map((data, index) => {
          const isActive = currentImage === index;
          const imageSrc = data.backdrop_path
            ? `${imageURL}${data.backdrop_path}`
            : 'https://via.placeholder.com/1280x720?text=No+Image';

          return (
            <div
              key={`${data.id}-banner-${index}`}
              className={`min-w-full h-full  relative transition-opacityduration-300 ease-in-out ${
                isActive ? 'opacity-100 ' : 'opacity-0 z-0 hidden'
              }`}
              data-aos="fade"
              data-aos-delay={index * 100}
            >
              <div className="absolute top-0 left-0 w-full h-full ">
                <img
                  src={imageSrc}
                  alt={data.title || data.name || 'Banner'}
                  className="w-full h-full object-fill block"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full banner-overlay  dark:bg-neutral-900/20 z-10" />
              <button
                onClick={handlePrevious}
                className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 p-2 sm:p-3 rounded-full z-20 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-glass text-neutral-800 dark:text-white hover:bg-white/60 hover:scale-110 transition-all duration-300"
                aria-label="Previous banner"
              >
                <FaAngleLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 p-2 sm:p-3 rounded-full z-20 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-glass text-neutral-800 dark:text-white hover:bg-white/60 hover:scale-110 transition-all duration-300"
                aria-label="Next banner"
              >
                <FaAngleRight size={20} />
              </button>
              <div
                className="container mx-auto absolute bottom-4 sm:bottom-8 px-4 sm:px-6 z-20"
                data-aos="fade-up"
              >
                <div className="max-w-full sm:max-w-md bg-white/20 dark:bg-neutral-900/20 backdrop-blur-glass rounded-xl p-4 sm:p-6">
                  <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-white drop-shadow-xl">
                    {data.title || data.name || 'Untitled'}
                  </h2>
                  <p className="text-ellipsis line-clamp-2 sm:line-clamp-3 my-2 sm:my-4 text-neutral-100 text-sm sm:text-base">
                    {data.overview || 'No description available.'}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-200">
                    <p>Rating: {Number(data.vote_average || 0).toFixed(1)}/10</p>
                    <span>|</span>
                    <p>Popularity: {Number(data.popularity || 0).toFixed(0)}</p>
                  </div>
                  <Link
                    to={`/${data.media_type || 'movie'}/${data.id}`}
                    className="inline-block mt-2 sm:mt-4"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <button className="bg-white/30 dark:bg-neutral-900/30 backdrop-blur-glass text-white px-4 sm:px-5 py-1.5 sm:py-2 font-semibold rounded-lg hover:bg-gradient-to-r from-red-500 to-orange-500 hover:scale-105 transition-all duration-300">
                      Play Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        <div
          className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {bannerData.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 backdrop-blur-glass ${
                currentImage === index
                  ? 'bg-white/60 dark:bg-neutral-900/60 scale-125'
                  : 'bg-white/30 dark:bg-neutral-900/30 hover:bg-white/40'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerHome;