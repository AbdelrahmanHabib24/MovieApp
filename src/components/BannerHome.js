/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const BannerHome = () => {
  const bannerData = useSelector((state) => state.movieo.bannerData);
  const imageURL = useSelector((state) => state.movieo.imageURL);
  const [currentImage, setCurrentImage] = useState(0);
  const intervalRef = useRef(null);

  const handleNext = useCallback(() => {
    setCurrentImage((prev) => (prev < bannerData.length - 1 ? prev + 1 : 0)); // Looping
  }, [bannerData]);

  const handlePrevious = useCallback(() => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : bannerData.length - 1)); // Looping
  }, [bannerData]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set a new interval
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalRef.current);
  }, [handleNext]);

  return (
    <section className="w-full h-full">
      <div className="flex min-h-full max-h-[95vh] overflow-hidden relative">
        {bannerData.map((data, index) => {
          const isActive = currentImage === index;

          return (
            <div
              key={data.id + 'bannerHome' + index}
              className={`min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative group transition-all ${isActive ? 'block' : 'hidden'}`}
            >
              <div className="w-full h-full">
                <img
                  src={imageURL + data.backdrop_path}
                  className="h-full w-full object-cover"
                  alt={data?.title || data?.name || 'Banner Image'}
                />
              </div>

              {/* Next and Previous buttons */}
              <div
                className="absolute top-0 w-full h-full hidden lg:flex items-center justify-between px-4 group-hover:lg:flex"
              >
                <button
                  onClick={handlePrevious}
                  aria-label="Previous Image"
                  className="bg-white p-1 rounded-full text-xl z-10 text-black"
                >
                  <FaAngleLeft />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next Image"
                  className="bg-white p-1 rounded-full text-xl z-10 text-black"
                >
                  <FaAngleRight />
                </button>
              </div>

              {/* Overlay Gradient */}
              <div className="absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent"></div>

              {/* Banner Text and Play Button */}
              <div className="container mx-auto">
                <div className="w-full absolute bottom-0 max-w-md px-3">
                  <h2 className="font-bold text-2xl lg:text-4xl text-white drop-shadow-2xl">
                    {data?.title || data?.name}
                  </h2>
                  <p className="text-ellipsis line-clamp-3 my-2">{data.overview}</p>
                  <div className="flex items-center gap-4">
                    <p>Rating : {Number(data.vote_average).toFixed(1)}+</p>
                    <span>|</span>
                    <p>View : {Number(data.popularity).toFixed(0)}</p>
                  </div>
                  <Link to={`/${data?.media_type}/${data.id}`}>
                    <button className="bg-white px-4 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-red-700 to-orange-500 shadow-md transition-all hover:scale-105">
                      Play Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BannerHome;
