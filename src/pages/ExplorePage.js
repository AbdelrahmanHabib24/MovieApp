import axios from 'axios';  
import React, { useState, useEffect, useCallback } from 'react';  
import { useParams, useNavigate } from 'react-router-dom';  
import { motion } from 'framer-motion';  
import Card from '../components/Card';  

const Loader = () => {  
  return (  
    <motion.div  
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"  
      initial={{ opacity: 0 }}  
      animate={{ opacity: 1 }}  
      exit={{ opacity: 0 }}  
    >  
      <div className="w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>  
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
      setData((prevData) => [...prevData, ...response.data.results]);
      setTotalPageNo(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message);
      setError('Unable to fetch data. Please try again later.');
      navigate('/'); 
    } finally {  
      setLoading(false);  
    }  
  }, [explore, pageNo, navigate, API_KEY]);  
  console.log("params" , explore)

  useEffect(() => {  
    setData([]);  
    setPageNo(1); 
    fetchData();  
  }, [explore, fetchData]);  

  useEffect(() => {  
    if (pageNo > 1) { 
      fetchData();  
    }  
  }, [pageNo, fetchData]);  

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        pageNo <= totalPageNo &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200
      ) {
        setPageNo((prevPageNo) => prevPageNo + 1);
      }
    };


    let timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [loading, pageNo, totalPageNo]);

  return (  
    <div className="py-16">  
      <div className="container mx-auto px-3 sm:px-8 md:px-28 lg:px:36">  
        {explore && data.length > 0 && (  
          <h3 className="capitalize text-lg  lg:text-xl font-semibold my-3">  
            Popular {explore}  
          </h3>  
        )}  

        {loading && !data.length && <Loader />}  

        {error && <div className="text-red-500">{error}</div>}

        <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start">  
          {data.map((exploreData) => (  
            <Card  
              data={exploreData}  
              key={exploreData.id + 'exploreSection'}  
              media_type={explore}  
            />  
          ))}  
        </div>  
      </div>  
    </div>  
  );  
};  

export default ExplorePage;
