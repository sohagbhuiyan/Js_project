import { NavLink } from "react-router-dom";

const TopBar = ()=> {

    return (
        <>
      <div className="flex items-center justify-center space-x-6 md:space-x-9 md:font-medium px-6 mt-1.5 text-xs md:text-sm">
      <NavLink
          to="/exclusive-offers"
          className={({ isActive }) =>
            isActive ? "text-gray-300 cursor-pointer" : "hover:text-gray-300 cursor-pointer"
          }
        >
          Exclusive Offers!
        </NavLink>
        <NavLink
          to="/news-media"
          className={({ isActive }) =>
            isActive ? "text-gray-300 cursor-pointer" : "hover:text-gray-300 cursor-pointer"
          }
        >
          News & Media
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "text-gray-300 cursor-pointer" : "hover:text-gray-300 cursor-pointer"
          }
        >
          Contact
        </NavLink>
      </div>
        </>
      );
    }
    
export default TopBar;
