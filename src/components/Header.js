/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import logo from "../assets/logo.png";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from "../contant/navigation";
import { debounce } from "lodash";
import clsx from "clsx";
import { ThemeToggle } from "../ThemeContext/ThemeContext";

const Header = () => {
  const location = useLocation();
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
  const [searchInput, setSearchInput] = useState(removeSpace || "");
  const [isSearchOpen, setIsSearchOpen] = useState(false); // For mobile search toggle
  const navigate = useNavigate();

  const debouncedNavigate = useCallback(
    debounce((value) => {
      if (value) {
        navigate(`/search?q=${value}`);
      }
    }, 300),
    [navigate]
  );

  useEffect(() => {
    debouncedNavigate(searchInput);
    return () => {
      debouncedNavigate.cancel();
    };
  }, [searchInput, debouncedNavigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false); // Close search input on submit (mobile)
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <header
  className={clsx(
    "fixed w-full h-16 z-40 transition-all duration-300 animate-fade-in",
    "bg-white/15 dark:bg-neutral-900/15 backdrop-blur-lg",
    "bg-gradient-to-b from-black/10 to-transparent"
  )}
>
  <div className="container mx-auto px-4 sm:px-6 flex items-center h-full">
    <Link to="/" aria-label="Home">
      <img
        src={logo}
        alt="Logo"
        width={140}
        height={40}
        className="object-contain"
        loading="lazy"
      />
    </Link>

    <nav className="hidden text-white sm:flex items-center gap-3 ml-6">
      {navigation.map((nav, index) => (
        <div key={nav.label + "header" + index}>
          <NavLink
            to={nav.href}
            className={({ isActive }) =>
              clsx(
                "px-3 py-1 rounded-md transition-all duration-200",
                "text-white dark:text-white",
                isActive
                  ? "bg-orange-500/20 text-orange-500 dark:text-orange-500"
                  : "hover:text-orange-500 dark:hover:text-orange-500 hover:bg-orange-500/10"
              )
            }
            aria-label={`Navigate to ${nav.label}`}
          >
            {nav.label}
          </NavLink>
        </div>
      ))}
    </nav>

    <div className="ml-auto flex items-center gap-4">
      <form
        className={clsx(
          "flex items-center gap-2 transition-all duration-300",
          isSearchOpen ? "flex w-full sm:w-auto" : "hidden sm:flex"
        )}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Search here..."
          className={clsx(
            "px-4 py-1.5 w-full sm:w-48 rounded-full outline-none border border-neutral-500/50",
            "bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400",
            "focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          )}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          aria-label="Search input"
        />
        <button
          className={clsx(
            "text-2xl p-1 rounded-full transition-all duration-200",
            "text-neutral-900 dark:text-white hover:bg-orange-500/20 hover:text-orange-500 dark:hover:text-orange-500"
          )}
          type="submit"
          aria-label="Search button"
          onClick={toggleSearch}
        >
          <IoSearchOutline />
        </button>
      </form>

      <ThemeToggle />
    </div>
  </div>
</header>

  );
};

export default Header;