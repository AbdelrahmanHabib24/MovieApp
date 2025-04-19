/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { debounce } from 'lodash'; // npm install lodash
import { FiSearch, FiX } from 'react-icons/fi'; // npm install react-icons

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(decodeURIComponent(location?.search?.slice(3) || ""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (isLoading || !query) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`search/multi`, {
        params: {
          query: query,
          page: page,
        },
      });

      setData((prev) => (page === 1 ? response.data.results : [...prev, ...response.data.results]));
      setError(null);
    } catch (err) {
      setError("Failed to load search results. Please try again.");
      setData([]);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle URL change
  useEffect(() => {
    const newQuery = decodeURIComponent(location?.search?.slice(3) || "");
    setQuery(newQuery);
    setPage(1);
    setData([]);
  }, [location?.search]);

  // Debounced search input
  const handleSearchChange = debounce((value) => {
    navigate(`/search?q=${encodeURIComponent(value)}`);
  }, 500);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && query) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [isLoading, query]);

  // Fetch data on query or page change
  useEffect(() => {
    fetchData();
  }, [query, page]);

  const handleRetry = () => {
    setError(null);
    setPage(1);
    fetchData();
  };

  const handleClearSearch = () => {
    setQuery("");
    navigate("/search");
  };

  return (
    <div className="py-12 sm:py-16">
      {/* Search Input */}
      <div
        className="my-4 mx-4 sm:mx-6 lg:mx-auto max-w-2xl sticky top-12 sm:top-14 md:top-16 lg:top-[4.5rem] z-30"
        data-aos="fade-down"
        data-aos-delay="100"
      >
        <div className=" xl:hidden relative flex py-2 items-center">
          <FiSearch className="fixed  text-neutral-500 text-lg" />
          <input
            type="text"
            placeholder="Search movies, TV shows, or people..."
            onChange={(e) => {
              setQuery(e.target.value);
              handleSearchChange(e.target.value);
            }}
            value={query}
            className="w-full pl-12 pr-10 py-2 sm:py-3 text-base sm:text-lg bg-black bg-opacity-70 backdrop-blur-2xl text-white rounded-full border border-neutral-700 focus:outline-none focus:border-white transition-all duration-300"
            aria-label="Search"
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 text-neutral-500 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <FiX className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-container">
        <h3 className="capitalize text-lg sm:text-xl lg:text-2xl font-semibold my-6 px-6 lg:px-0" data-aos="fade-up">
          {query ? `Search Results for "${query}"` : "Search Results"}
        </h3>

        {error && (
          <div
            className="bg-red-500/80 backdrop-blur-sm text-white p-4 mx-6 lg:mx-0 mb-6 rounded-lg flex items-center justify-between"
            data-aos="fade-up"
          >
            <span>{error}</span>
            <button
              onClick={handleRetry}
              className="btn_white_rounded ml-4 hover:bg-neutral-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {data.length === 0 && !isLoading && !error && query && (
          <div className="text-center text-neutral-500 my-10 px-6 lg:px-0" data-aos="fade-up">
            No results found for "{query}". Try a different search term.
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fit,180px)] sm:grid-cols-[repeat(auto-fit,230px)] gap-4 sm:gap-6 justify-center lg:justify-start px-6 lg:px-0">
          {isLoading && data.length === 0
            ? // Skeleton for initial load
              Array(8)
                .fill()
                .map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="w-[180px] sm:w-[230px] h-[270px] sm:h-[345px] bg-neutral-800/50 backdrop-blur-sm rounded-lg animate-pulse"
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  />
                ))
            : // Render actual cards
              data.map((searchData, index) => (
                <Card
                  data={searchData}
                  key={searchData.id + "search"}
                  media_type={searchData.media_type}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                />
              ))}
        </div>

        <div ref={loadMoreRef} className="h-1" />

        {isLoading && data.length > 0 && (
          <div className="text-center py-6 flex justify-center" data-aos="fade-in">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;