
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import useFetchDetails from '../hooks/useFetchDetails';

const VideoPlay = ({ data, close, media_type }) => {
  const { data: videoData, loading, error } = useFetchDetails(`/${media_type}/${data?.id}/videos`);
  const [videoUrl, setVideoUrl] = useState('');

  // Set video URL when videoData changes
  const getVideoUrl = useCallback(() => {
    console.log("videoData:", videoData); // Debug video data
    if (videoData?.results?.length > 0) {
      const videoKey = videoData.results.find(
        (video) => video.site === 'YouTube' && video.type === 'Trailer'
      )?.key || videoData.results[0].key;
      return `https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=0`;
    }
    // Fallback to a sample YouTube video if no video is available
    return 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0';
  }, [videoData]);

  useEffect(() => {
    const url = getVideoUrl();
    console.log("videoUrl:", url); // Debug video URL
    setVideoUrl(url);
  }, [getVideoUrl]);

  // Handle close with keyboard support
  const handleClose = useCallback(
    (e) => {
      if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
        close();
      }
    },
    [close]
  );

  // Close on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [close]);

  return (
    <section
      className="fixed inset-0 bg-neutral-900 bg-opacity-70 z-50 flex justify-center items-center p-4"
      role="dialog"
      aria-labelledby="video-title"
      aria-modal="true"
    >
      <div className="bg-black w-full max-w-4xl max-h-[80vh] aspect-video rounded-lg shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          onKeyDown={handleClose}
          className="absolute top-2 right-2 text-white text-3xl p-1 rounded-full hover:bg-neutral-700 transition-colors z-50"
          aria-label="Close video player"
        >
          <IoClose />
        </button>

        {/* Video Title for Accessibility */}
        <h2 id="video-title" className="sr-only">
          {data?.title || data?.name || 'Video Player'}
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="w-full h-full flex justify-center items-center bg-neutral-800 text-white text-lg animate-pulse">
            Loading video...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full h-full flex justify-center items-center bg-neutral-800 text-red-500 text-lg">
            Error loading video: {error}
          </div>
        )}

        {/* Video Player or Fallback */}
        {!loading && !error && (
          <>
            {videoUrl ? (
              <iframe
                title={data?.title || data?.name || 'Video Player'}
                src={videoUrl}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center bg-neutral-800 text-white text-lg">
                No video available
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default VideoPlay;
