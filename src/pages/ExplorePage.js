import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/Card";

const Loader = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 border-4 sm:border-5 md:border-6 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </motion.div>
  );
};

const ExplorePage = () => {
  const { explore } = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_KEY = process.env.REACT_APP_ACCESS_TOKEN;

  const fetchData = useCallback(async () => {
    if (!API_KEY) {
      setError("API key is missing or invalid.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/${explore}`,
        {
          params: {
            api_key: API_KEY,
            page: pageNo,
          },
        }
      );
      setData((prevData) => {
        const newData = response.data.results.filter(
          (item) => !prevData.some((existing) => existing.id === item.id)
        );
        return [...prevData, ...newData];
      });
      setTotalPageNo(response.data.total_pages);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
      setError("Unable to fetch data. Please try again later.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [explore, pageNo, API_KEY, navigate]);

  useEffect(() => {
    setData([]);
    setPageNo(1);
    setTotalPageNo(0);
  }, [explore]);

  useEffect(() => {
    fetchData();
  }, [pageNo, fetchData]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        pageNo < totalPageNo &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200
      ) {
        setPageNo((prevPageNo) => prevPageNo + 1);
      }
    };

    let timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScroll, 150);
    };

    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [loading, pageNo, totalPageNo]);

  return (
    <div className="py-14 sm:py-10 md:py-12 lg:py-14 bg-gradient-to-b backdrop-blur-lg from-black/20 to-transparent min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {explore && data.length > 0 && (
          <h3
            className="capitalize text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold my-3 sm:my-4 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 inline-block transition-all duration-300 hover:bg-orange-500/20 hover:text-orange-500"
            data-aos="fade-down"
            data-aos-duration="600"
          >
            Popular {explore}
          </h3>
        )}

        {loading && !data.length && <Loader />}

        {error && (
          <div className="text-red-500 text-sm sm:text-base md:text-lg bg-black/50 backdrop-blur-sm rounded-lg px-4 py-3 my-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-10 lg:gap-12 px-3 sm:px-4 md:px-6 lg:px-8">
          {data.map((exploreData, index) => (
            <Card
              data={exploreData}
              key={exploreData.id + "exploreSection" + index}
              media_type={explore}
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-offset="50"
            />
          ))}
        </div>

        {loading && data.length > 0 && (
          <div className="text-center py-4 sm:py-5 md:py-6">
            <div className="inline-block w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 border-2 sm:border-3 md:border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
