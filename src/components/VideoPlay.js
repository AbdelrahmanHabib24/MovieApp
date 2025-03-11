import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import useFetchDetails from '../hooks/useFetchDetails';

const VideoPlay = ({ data, close, media_type }) => {
  const { data: videoData, loading, error } = useFetchDetails(`/${media_type}/${data?.id}/videos`);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (videoData?.results?.length > 0) {
      setVideoUrl(`https://www.youtube.com/embed/${videoData.results[0]?.key}`);
    }
  }, [videoData]);

  if (loading) {
    return (
      <section className="fixed bg-neutral-700 top-0 right-0 bottom-0 left-0 z-40 bg-opacity-50 flex justify-center items-center">
        <div className="text-white">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="fixed bg-neutral-700 top-0 right-0 bottom-0 left-0 z-40 bg-opacity-50 flex justify-center items-center">
        <div className="text-white">Failed to load video</div>
      </section>
    );
  }

  return (
    <section className='fixed bg-neutral-700 top-0 right-0 bottom-0 left-0 z-40 bg-opacity-50 flex justify-center items-center'> 
      <div className='bg-black w-full max-h-[80vh] max-w-screen-lg aspect-video rounded relative'>
        
        <button
          onClick={close}
          className='absolute -right-1 -top-6 text-3xl z-50'
          aria-label="Close video"
        >
          <IoClose />
        </button>

        {videoUrl ? (
          <iframe
            title="Video Player"
            src={videoUrl}
            className='w-full h-full rounded'
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="text-white text-center">No video available</div>
        )}
      </div>
    </section>
  );
}

export default VideoPlay;
