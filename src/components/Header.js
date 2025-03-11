/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import logo from "../assets/logo.png";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import userIcon from "../assets/user.png";
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from "../contant/navigation";
import { debounce } from "lodash"; // npm install lodash
import clsx from "clsx"; // npm install clsx

const Header = () => {
  const location = useLocation();
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
  const [searchInput, setSearchInput] = useState(removeSpace);
  const navigate = useNavigate();

  // Debounced navigate to search page
  const debouncedNavigate = useCallback(
    debounce((value) => {
      if (value) {
        navigate(`/search?q=${value}`);
      }
    }, 300), // 300ms debounce delay
    [navigate]
  );

  // Effect hook to trigger debounced function
  useEffect(() => {
    debouncedNavigate(searchInput);
    return () => {
      debouncedNavigate.cancel(); // Clean up debounced function on unmount
    };
  }, [searchInput, debouncedNavigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <header className="fixed top-0 w-full h-16 bg-black bg-opacity-50 z-40">
      <div className="container mx-auto px-3 flex items-center h-full">
        {/* Logo */}
        <Link to="/" aria-label="Home">
          <img src={logo} alt="logo" width={120} />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 ml-5">
          {navigation.map((nav, index) => (
            <div key={nav.label + "header" + index}>
              <NavLink
                to={nav.href}
                className={({ isActive }) =>
                  clsx(
                    "px-2 hover:text-neutral-100",
                    isActive && "text-neutral-100"
                  )
                }
                aria-label={`Navigate to ${nav.label}`}
              >
                {nav.label}
              </NavLink>
            </div>
          ))}
        </nav>

        {/* Search & User Icon */}
        <div className="ml-auto flex items-center gap-5">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search here..."
              className="bg-transparent px-4 py-1 outline-none border-none hidden lg:block"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              aria-label="Search input"
            />
            <button
              className="text-2xl text-white"
              type="submit"
              aria-label="Search button"
            >
              <IoSearchOutline />
            </button>
          </form>

          {/* User Icon */}
          <div
            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all"
            aria-label="User Profile"
          >
            <img
              src={userIcon}
              alt="User profile icon"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
