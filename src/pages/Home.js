import React, { useState, useEffect } from 'react';
import BannerHome from '../components/BannerHome';
import { useSelector } from 'react-redux';
import HorizontalScollCard from '../components/HorizontalScollCard';
import useFetch from '../hooks/useFetch';
import Footer from '../components/Footer';

const Home = () => {
  const trendingData = useSelector(state => state.movieo.bannerData);

  // Fetch different data types for movies and TV shows
  const { data: nowPlayingData, loading: loadingNowPlaying } = useFetch('/movie/now_playing');
  const { data: topRatedData, loading: loadingTopRated } = useFetch('/movie/top_rated');
  const { data: popularTvShowData, loading: loadingPopularTvShows } = useFetch('/tv/popular');
  const { data: onTheAirShowData, loading: loadingOnTheAirShows } = useFetch('/tv/on_the_air');

  // Create a combined loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if any data is still loading
    if (
      loadingNowPlaying ||
      loadingTopRated ||
      loadingPopularTvShows ||
      loadingOnTheAirShows
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingNowPlaying, loadingTopRated, loadingPopularTvShows, loadingOnTheAirShows]);

  return (
    <div className=''>
      {/* Banner Section */}
      <BannerHome />

      {/* Loading State */}
      {isLoading && <div className="text-center text-white">Loading...</div>}

      {/* Trending Section */}
      <HorizontalScollCard data={trendingData} heading="Trending"  trending={true} />

      {/* Now Playing Section */}
      <HorizontalScollCard
        data={nowPlayingData}
        heading="Now Playing"
        media_type="movie"
      />

      {/* Top Rated Movies Section */}
      <HorizontalScollCard
        data={topRatedData}
        heading="Top Rated Movies"
        media_type="movie"
      />

      {/* Popular TV Shows Section */}
      <HorizontalScollCard
        data={popularTvShowData}
        heading="Popular TV Show"
        media_type="tv"
      />

      {/* On The Air Shows Section */}
      <HorizontalScollCard
        data={onTheAirShowData}
        heading="On The Air"
        media_type="tv"
      />

      <Footer/>
    </div>
  );
};

export default Home;