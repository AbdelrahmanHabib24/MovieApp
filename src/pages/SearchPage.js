import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { debounce } from 'lodash';  // To debounce the input for search

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(location?.search?.slice(3) || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests

    setIsLoading(true);
    try {
      const response = await axios.get(`search/multi`, {
        params: {
          query: query,
          page: page,
        },
      });

      setData((prev) => [
        ...prev,
        ...response.data.results,
      ]);
      setError(null); // Reset error if the request is successful
    } catch (err) {
      setError("Failed to load data. Please try again later.");
      console.log('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for handling URL change
  useEffect(() => {
    setPage(1);
    setData([]);
    setQuery(location?.search?.slice(3) || "");
  }, [location?.search]);

  // Debounce the input search to avoid rapid API calls
  const handleSearchChange = debounce((e) => {
    navigate(`/search?q=${e.target.value}`);
  }, 500);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !isLoading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); 
    };
  }, [isLoading]);

  useEffect(() => {
    if (query) {
      fetchData();
    }
  }, [query, page]);

  return (
    <div className="py-16">
      <div className="lg:hidden my-2 mx-1 sticky top-[70px] z-30">
        <input
          type="text"
          placeholder="Search here..."
          onChange={handleSearchChange}
          value={query?.split('%20')?.join(' ')}
          className="px-4 py-1 text-lg w-full bg-white rounded-full text-neutral-900"
        />
      </div>

      <div className="container mx-auto">
        <h3 className="capitalize text-lg lg:text-xl font-semibold my-3">Search Results</h3>

        {error && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start">
          {data.map((searchData) => (
            <Card data={searchData} key={searchData.id + "search"} media_type={searchData.media_type} />
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <span>Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
