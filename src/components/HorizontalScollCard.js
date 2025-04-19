import React, { useRef, useState, useEffect } from 'react';
import Card from './Card';
import '../App.css';
import '../index.css';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';

const HorizontalScrollCard = ({ data = [], heading, trending, media_type }) => {
  const containerRef = useRef();
  const [isScrollEnd, setIsScrollEnd] = useState(false);
  const [isScrollStart, setIsScrollStart] = useState(true);

  // Dynamically check if the scroll position reached the end
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      const isEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;
      const isStart = container.scrollLeft === 0;
      setIsScrollEnd(isEnd);
      setIsScrollStart(isStart);
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNext = () => {
    containerRef.current.scrollLeft += containerRef.current.clientWidth - 50; // Adjust scroll width dynamically
  };

  const handlePrevious = () => {
    containerRef.current.scrollLeft -= containerRef.current.clientWidth - 50; // Adjust scroll width dynamically
  };

  return (
    <div className="container mx-auto px-3 my-10">
      <h2 className="text-xl lg:text-2xl font-bold mb-3 text-white capitalize">{heading}</h2>

      <div className="relative">
        {/* Cards container */}
        <div
          ref={containerRef}
          className="grid grid-cols-[repeat(auto-fit,180px)]  sm:grid-cols-[repeat(auto-fit,230px)] lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] grid-flow-col gap-4 sm:gap-6 overflow-auto md:overflow-auto lg:overflow-hidden relative z-10 scroll-smooth transition-all"
        >
          {data.map((data, index) => (
            <Card
              key={data.id + 'heading' + index}
              data={data}
              index={index + 1}
              trending={trending}
              media_type={media_type}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="absolute top-0 hidden lg:flex justify-between w-full h-full items-center">
          <button
            onClick={handlePrevious}
            className="bg-white p-2 text-black rounded-full -ml-2 z-10"
            disabled={isScrollStart}
            aria-label="Scroll left"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleNext}
            className="bg-white p-2 text-black rounded-full -mr-2 z-10"
            disabled={isScrollEnd}
            aria-label="Scroll right"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollCard;