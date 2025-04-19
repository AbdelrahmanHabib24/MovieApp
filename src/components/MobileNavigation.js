// MobileNavigation.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { mobileNavigation } from "../contant/navigation";

const MobileNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-black/70 backdrop-blur-md z-50 lg:hidden border-t border-white/10">
      <div className="flex items-center justify-around h-full text-neutral-400">
        {mobileNavigation.map((nav) => (
          <NavLink
            key={nav.href}
            to={nav.href}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center gap-0.5 text-xs transition duration-200",
                isActive ? "text-white" : "hover:text-white/80"
              )
            }
          >
            {nav.icon}
            <span>{nav.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
