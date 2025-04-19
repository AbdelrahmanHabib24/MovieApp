
import React, { useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import Divider from "../components/Divider";
import HorizontalScrollCard from "../components/HorizontalScollCard";
import VideoPlay from "../components/VideoPlay";
import useFetchDetails from "../hooks/useFetchDetails";
import useFetch from "../hooks/useFetch";

// Utility function to format date
const formatDate = (date) => {
  if (!date || date === "TBA" || !moment(date, "YYYY-MM-DD", true).isValid()) {
    return "Release date not available";
  }
  return moment(date).format("MMMM Do, YYYY");
};

const DetailsPage = () => {
  const params = useParams();
  const imageURL = useSelector((state) => state.movieo.imageURL);
  const { data, loading: detailsLoading, error: detailsError } = useFetchDetails(`/${params?.explore}/${params?.id}`);
  const { data: castData, loading: castLoading, error: castError } = useFetchDetails(`/${params?.explore}/${params?.id}/credits`);
  const { data: similarData, loading: similarLoading, error: similarError } = useFetch(`/${params?.explore}/${params?.id}/similar`);
  const { data: recommendationData, loading: recommendationLoading, error: recommendationError } = useFetch(`/${params?.explore}/${params?.id}/recommendations`);
  const [playVideo, setPlayVideo] = useState(false);
  const [playVideoId, setPlayVideoId] = useState(null);

  // Memoize computed values
  const duration = useMemo(() => {
    if (!data?.runtime) return null;
    const hours = Math.floor(data.runtime / 60);
    const minutes = data.runtime % 60;
    return { hours, minutes };
  }, [data?.runtime]);

  // Compute writers (multiple possible)
  const writer = useMemo(() => {
    if (!castData?.crew || !Array.isArray(castData.crew)) return "N/A";
    const writers = castData.crew
      .filter((member) => member?.job === "Writer" && member?.name)
      .map((member) => member.name);
    return writers.length > 0 ? writers.join(", ") : "N/A";
  }, [castData]);

  // Compute director (single expected)
  const director = useMemo(() => {
    if (!castData?.crew || !Array.isArray(castData.crew)) return "N/A";
    const directorMember = castData.crew.find(
      (member) => member?.job === "Director" && member?.name
    );
    return directorMember ? directorMember.name : "N/A";
  }, [castData]);

  // Handle video playback with validation
  const handlePlayVideo = useCallback((data) => {
    console.log("handlePlayVideo data:", data);
    setPlayVideoId(data);
    setPlayVideo(true);
  }, []);

  // Handle loading state with skeleton
  if (detailsLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-blue-400 via-orange-500 to-blue-200 dark:bg-black w-[calc(100%+2rem)] -mx-4 bg-cover bg-center"
        style={{
          backgroundImage: data?.backdrop_path
            ? `url(${imageURL + data.backdrop_path})`
            : "none",
        }}
      >
        <div className="absolute inset-0 bg-white/20 dark:bg-neutral-900/20 backdrop-blur-lg z-10" />
        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 lg:gap-12 relative z-20">
          {/* Poster Skeleton */}
          <div className="relative mx-auto lg:mx-0 w-fit min-w-[200px] sm:min-w-[240px] animate-pulse">
            <div className="h-72 sm:h-80 w-52 sm:w-60 bg-neutral-700 rounded-xl" />
            <div className="mt-4 w-full h-12 bg-neutral-700 rounded-lg" />
          </div>
          {/* Details Skeleton */}
          <div className="flex-1 bg-white/10 dark:bg-neutral-900/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
            <div className="h-8 w-3/4 bg-neutral-700 rounded" />
            <div className="h-4 w-1/2 bg-neutral-700 rounded" />
            <div className="flex gap-4">
              <div className="h-4 w-16 bg-neutral-700 rounded" />
              <div className="h-4 w-16 bg-neutral-700 rounded" />
            </div>
            <div className="h-1 w-full bg-neutral-700 rounded" />
            <div className="space-y-2">
              <div className="h-6 w-1/4 bg-neutral-700 rounded" />
              <div className="h-4 w-full bg-neutral-700 rounded" />
              <div className="h-4 w-3/4 bg-neutral-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (detailsError) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center  dark:bg-black w-[calc(100%+2rem)] -mx-4 bg-cover bg-center"
        style={{
          backgroundImage: data?.backdrop_path
            ? `url(${imageURL + data.backdrop_path})`
            : "none",
        }}
      >
        <div className="absolute inset-0 bg-white/20 dark:bg-neutral-900/20 backdrop-blur-lg z-10" />
        <div className="text-red-500 text-lg relative z-20">
          Error: {detailsError}
        </div>
      </div>
    );
  }

  // Determine the correct date field based on media type
  const dateToUse = params.explore === "tv" ? data?.first_air_date : data?.release_date;
  console.log(`DetailsPage (${params.explore}/${params?.id}):`, {
    release_date: data?.release_date,
    first_air_date: data?.first_air_date,
    dateToUse,
  });
  const releaseDate = formatDate(dateToUse);

  return (
    <div
      className="m-0 p-0 transition-all  duration-500 ease-in-out bg-gradient-to-b from-blue-400 via-orange-500 to-blue-200 dark:bg-black overflow-x-hidden min-h-screen w-[calc(100%+2rem)] -mx-4 bg-cover bg-center"
      style={{
        backgroundImage: data?.backdrop_path
          ? `url(${imageURL + data.backdrop_path})`
          : "none",
      }}
    >
      {/* Frosted Glass Overlay with Gradient */}

      {/* Main Content */}
      <div className="container mx-auto px-4  pt-24 pb-8 flex flex-col lg:flex-row gap-8 lg:gap-16 animate-fade-in relative z-20">
        {/* Poster Section */}
        <div className="relative  mx-auto h-[420px] lg:mx-0 w-fit min-w-[200px] sm:min-w-[240px] dark:bg-neutral-900/10 backdrop-blur-lg rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
          {data?.poster_path ? (
            <img
              src={imageURL + data.poster_path}
              alt={`Poster for ${data?.title || data?.name}`}
              className="h-72 sm:h-80 w-52 sm:w-60 object-fill rounded-lg shadow-md border border-neutral-800/50 transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/240x360?text=No+Poster";
              }}
            />
          ) : (
            <div className="h-72 sm:h-80 w-52 sm:w-60 bg-neutral-800 flex items-center justify-center text-neutral-400 rounded-lg">
              No poster available
            </div>
          )}
          <button
            onClick={() => handlePlayVideo(data)}
            className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label={`Play ${data?.title || data?.name}`}
          >
            Play Now
          </button>
        </div>

        {/* Details Section */}
        <div className="flex-1  bg-white/10 dark:bg-neutral-900/10 backdrop-blur-lg rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg leading-tight">
            {data?.title || data?.name}
          </h2>
          {data?.tagline && (
            <p className="text-black dark:text-neutral-300 italic mt-2 text-sm sm:text-base leading-relaxed">
              {data?.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-white  mt-4">
            <p className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>{" "}
              {Number(data?.vote_average).toFixed(1)}/10
            </p>
            <span className="text-black dark:text-neutral-300">|</span>
            <p>Views: {Number(data?.vote_count).toLocaleString()}</p>
            {duration && (
              <>
                <span className="text-black dark:text-neutral-300">|</span>
                <p>
                  Duration: {duration.hours}h {duration.minutes}m
                </p>
              </>
            )}
          </div>

          <Divider className="my-6" />

          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">
              Overview
            </h3>
            <p className="text-white dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
              {data?.overview || "No overview available."}
            </p>
          </div>

          <Divider className="my-6" />

          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-200">
            <p className="">Status: {data?.status || "N/A"}</p>
            <span className="text-black dark:text-neutral-300">|</span>
            <p>Release: {releaseDate}</p>
            {data?.revenue > 0 && (
              <>
                <span className="text-neutral-500">|</span>
                <p>Revenue: ${Number(data?.revenue).toLocaleString()}</p>
              </>
            )}
          </div>

          <Divider className="my-6" />

          <div>
            <p className="text-sm sm:text-base">
              <span className="font-semibold text-white">Director:</span>{" "}
              <span className="text-neutral-200">{director}</span>
            </p>
            <Divider className="my-4" />
            <p className="text-sm sm:text-base">
              <span className="font-semibold text-white">Writer:</span>{" "}
              <span className="text-neutral-200">{writer}</span>
            </p>
          </div>

          <Divider className="my-6" />

          <h2 className="font-semibold text-lg sm:text-xl mb-4 text-white">
            Cast
          </h2>
          {castLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 sm:gap-6 animate-pulse">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-700 rounded-full" />
                  <div className="h-4 w-16 mt-2 bg-neutral-700 rounded mx-auto" />
                </div>
              ))}
            </div>
          ) : castError ? (
            <div className="text-red-500 text-sm">
              Error loading cast: {castError}
            </div>
          ) : (
            <div
              className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 sm:gap-6"
              role="list"
            >
              {castData?.cast
                ?.filter((el) => el?.profile_path)
                .slice(0, 10)
                .map((starCast) => (
                  <div
                    key={starCast.id}
                    className="text-center group"
                    role="listitem"
                  >
                    <div className="relative">
                      <img
                        src={imageURL + starCast?.profile_path}
                        alt={`Profile of ${starCast?.name}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-fill rounded-full shadow-md border border-neutral-800/50 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/96x96?text=No+Image";
                        }}
                      />
                    </div>
                    <p className="font-medium text-xs sm:text-sm text-neutral-200 mt-2 group-hover:text-white transition-colors duration-300">
                      {starCast?.name}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Similar and Recommendations */}
      <div className="container mx-auto px-4 py-12 relative z-20">
        <HorizontalScrollCard
          data={similarData}
          heading={`Similar ${params.explore}`}
          media_type={params.explore}
          loading={similarLoading}
          error={similarError}
        />
        <HorizontalScrollCard
          data={recommendationData}
          heading={`Recommended ${params.explore}`}
          media_type={params.explore}
          loading={recommendationLoading}
          error={recommendationError}
        />
      </div>

      {/* Video Player */}
      {playVideo && playVideoId && (
        <VideoPlay
          data={playVideoId}
          close={() => setPlayVideo(false)}
          media_type={params.explore}
        />
      )}
    </div>
  );
};

export default DetailsPage;
