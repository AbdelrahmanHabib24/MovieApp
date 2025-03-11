import React from "react";
import { mobileNavigation } from "../contant/navigation";
import { NavLink } from "react-router-dom";
import clsx from "clsx"; // npm install clsx

const MobileNavigation = () => {
  return (
    <section className="lg:hidden h-14 bg-black bg-opacity-70 backdrop-blur-2xl fixed bottom-0 w-full z-40">
      <div className="flex items-center justify-between h-full text-neutral-400">
        {mobileNavigation.map((nav) => (
          <NavLink
            key={nav.href}
            to={nav.href}
            className={({ isActive }) =>
              clsx(
                "px-3 flex h-full items-center flex-col justify-center",
                isActive && "text-white"
              )
            }
            aria-label={nav.label} // Adding aria-label for better accessibility
          >
            <div className="text-2xl">{nav.icon}</div>
            <p className="text-sm">{nav.label}</p>
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default MobileNavigation;
