/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

// Utility function to format date
const formatDate = (date) => {
  if (!date || date === 'TBA' || !moment(date, 'YYYY-MM-DD', true).isValid()) {
    return 'Release date not available';
  }
  return moment(date).format('MMMM Do YYYY');
};

const Card = React.memo(({ data, trending, index, media_type }) => {
  const imageURL = useSelector((state) => state.movieo.imageURL) || 'https://image.tmdb.org/t/p/original';

  if (!data || !data.id) return null;

  const mediaType = data.media_type ?? media_type ?? 'movie';
  const dateToUse = mediaType === 'tv' ? data.first_air_date : data.release_date;
  const releaseDate = formatDate(dateToUse);
  const title = data.title || data.name || 'Untitled';
  const rating = Number(data.vote_average || 0).toFixed(1);

  const handleImageError = useCallback((e) => {
    e.target.src = 'https://via.placeholder.com/230x345?text=No+Image';
    e.target.alt = `Poster unavailable for ${title}`;
  }, [title]);

  return (
    <Link
      to={`/${mediaType}/${data.id}`}
      className="w-full min-w-[180px] max-w-[180px] h-72 sm:min-w-[230px] sm:max-w-[230px] sm:h-80 overflow-hidden block rounded-xl relative group transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md border border-neutral-800/50"
      aria-label={`View details for ${title}`}
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-offset="50"
    >
      {/* Poster Image with Gradient Overlay */}
      <div className="w-full h-[200px] sm:h-[240px] overflow-hidden relative">
        {data?.poster_path ? (
          <img
            src={`${imageURL}${data.poster_path}`}
            alt={`Poster for ${title}`}
            className="object-fill w-full h-full transition-all duration-300 group-hover:brightness-75"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="bg-neutral-800 h-full w-full flex justify-center items-center text-white text-base sm:text-lg">
            No image found
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Trending Badge */}
      {trending && (
        <div className="absolute top-3 left-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          <div className="py-1 px-3 backdrop-blur-xl rounded-r-full bg-black/70 border border-white/20 text-white text-xs sm:text-sm font-medium">
            #{index} Trending
          </div>
        </div>
      )}

      {/* Card Details */}
      <div className="absolute bottom-0 h-20 lg:h-20 sm:h-20 w-full bg-white/15 dark:bg-neutral-900/15 backdrop-blur-lg border-t border-white/10 p-3 flex flex-col justify-between opacity-90 group-hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-ellipsis line-clamp-1 text-base sm:text-lg font-semibold text-white drop-shadow-md">
          {title}
        </h2>
        <div className="text-xs sm:text-sm text-neutral-300 flex justify-between items-center gap-2">
          <p className="text-ellipsis line-clamp-1 flex-1">{releaseDate}</p>
          <div className="bg-black/50 px-2 py-1 rounded-full text-xs text-white flex items-center gap-1 flex-shrink-0">
            <span className="text-yellow-400">★</span>
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default Card;
