import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Card = React.memo(({ data, trending, index, media_type }) => {
  const imageURL = useSelector((state) => state.movieo.imageURL)

  const mediaType = data.media_type ?? media_type

  const releaseDate = data.release_date ? moment(data.release_date).format("MMMM Do YYYY") : 'Release date not available'

  // Fallback for title or name
  const title = data?.title || data?.name || 'Untitled'

  return (
    <Link
      to={`/${mediaType}/${data.id}`}
      className="w-full min-w-[230px] max-w-[230px] h-80 overflow-hidden block rounded relative hover:scale-105 transition-all"
    >
      {/* Poster Image or Fallback */}
      {data?.poster_path ? (
        <img
          src={imageURL + data?.poster_path}
          alt={title}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="bg-neutral-800 h-full w-full flex justify-center items-center text-white text-lg">
          No image found
        </div>
      )}

      {/* Trending Badge */}
      {trending && (
        <div className="absolute top-4">
          <div className="py-1 px-4 backdrop-blur-3xl rounded-r-full bg-black/60 overflow-hidden">
            #{index} Trending
          </div>
        </div>
      )}

      {/* Card Details */}
      <div className="absolute bottom-0 h-16 backdrop-blur-3xl w-full bg-black/60 p-2">
        <h2 className="text-ellipsis line-clamp-1 text-lg font-semibold text-white">{title}</h2>
        <div className="text-sm text-neutral-400 flex justify-between items-center">
          <p>{releaseDate}</p>
          <p className="bg-black px-1 rounded-full text-xs text-white">
            Rating : {Number(data.vote_average).toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  )
})

export default Card
