// src/components/NavIcons.jsx
import {
  FaShoppingCart,
  FaHeart,
  FaExchangeAlt,
  FaTools,
} from "react-icons/fa";
import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CartDropdown } from "./CartDropdown";
import WishList from "./WishList";
import CompareDropdown from "./CompareDropdown";
import { UserDropdown } from "./UserDropdown";
import NavIcon from "./NavIcon";
import { Button } from "@mui/material";

const DROPDOWNS = {
  cart: "cart",
  wishlist: "wishlist",
  compare: "compare",
  pcBuilder: "pcBuilder", // Added pcBuilder key
};

const NavIcons = ({ variant = "desktop" }) => {
  const isMobile = variant === "mobile";
  const wrapperClasses = isMobile
    ? "fixed z-50 bottom-0 w-full bg-[#CF212B] p-2 flex justify-around items-center text-white"
    : "flex items-center justify-center space-x-4";

  const [openDropdown, setOpenDropdown] = useState(null);
  const navIconsRef = useRef(null);
  const navigate = useNavigate();

  const cartCount = useSelector((state) => state.cart.count);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const closeDropdown = () => setOpenDropdown(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navIconsRef.current && !navIconsRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Define icon order for mobile and desktop
  const iconOrder = isMobile
    ? ["cart", "wishlist", "pcBuilder", "compare", "user"]
    : ["cart", "wishlist", "compare", "user", "pcBuilder"];

  // Define components for each icon
  const iconComponents = {
    cart: (
      <div className="relative" key="cart">
        <NavIcon
          icon={FaShoppingCart}
          label="Cart"
          count={cartCount}
          isMobile={isMobile}
          onClick={() => toggleDropdown(DROPDOWNS.cart)}
        />
        <CartDropdown
          isOpen={openDropdown === DROPDOWNS.cart}
          onClose={closeDropdown}
          position={variant}
        />
      </div>
    ),
    wishlist: (
      <div className="relative" key="wishlist">
        <NavIcon
          icon={FaHeart}
          label="Wishlist"
          count={wishlistItems.length}
          isMobile={isMobile}
          onClick={() => toggleDropdown(DROPDOWNS.wishlist)}
        />
        <WishList
          isOpen={openDropdown === DROPDOWNS.wishlist}
          onClose={closeDropdown}
          isMobile={isMobile}
        />
      </div>
    ),
    compare: (
      <div className="relative" key="compare">
        <NavIcon
          icon={FaExchangeAlt}
          label="Compare"
          isMobile={isMobile}
          onClick={() => toggleDropdown(DROPDOWNS.compare)}
        />
        <CompareDropdown
          isOpen={openDropdown === DROPDOWNS.compare}
          onClose={closeDropdown}
          isMobile={isMobile}
        />
      </div>
    ),
    user: (
      <div className="relative" key="user">
        <UserDropdown position={variant} />
      </div>
    ),
    pcBuilder: (
      <div
        className="relative"
        key="pcBuilder"
        onMouseEnter={() => !isMobile && toggleDropdown(DROPDOWNS.pcBuilder)}
        onMouseLeave={() => !isMobile && closeDropdown()}
      >
        <Button
          variant="contained"
          startIcon={isMobile ? <FaTools /> : null}
          onClick={() => toggleDropdown(DROPDOWNS.pcBuilder)}
          sx={{
            fontSize: isMobile ? "0.6rem" : "0.75rem",
            fontWeight: 600,
            padding: isMobile ? "6px" : "5px 8px",
            minWidth: isMobile ? "40px" : "auto",
            display: "flex",
            justifyContent: "center",
            borderRadius: "10px",
            background: "linear-gradient(45deg, #FF416C, #FF4B2B, #FF8E53, #FFD700)",
            color: "#fff",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(45deg, #E0FFFF, #F0FFF0)",
              color: "#CF212B",
            },
            "& .MuiButton-startIcon": {
              margin: isMobile ? "0" : "inherit",
            },
          }}
          aria-haspopup="true"
          aria-expanded={openDropdown === DROPDOWNS.pcBuilder}
        >
          {isMobile ? null : "Building A System"}
        </Button>
        {openDropdown === DROPDOWNS.pcBuilder && (
        <div
          className={`absolute ${
            isMobile ? "bottom-full mb-2" : "top-full mt-0.5"
          } left-0 w-32 bg-gray-100 border border-gray-400 rounded-lg shadow-xl z-50`}
        >
          <ul className="py-1">
            <li>
              <button
                className="w-full text-left px-4 py-1 cursor-pointer font-medium text-sm text-gray-800 hover:bg-gray-300 transition-colors"
                onClick={() => {
                  closeDropdown();
                  navigate("/pc-builder");
                }}
                aria-label="Navigate to PC Builder"
              >
                PC Builder
              </button>
            </li>
            <li className="border-t border-gray-300">
              <button
                className="w-full text-left px-4 py-1 cursor-pointer font-medium text-sm text-gray-800  hover:bg-gray-300 transition-colors"
                onClick={() => {
                  closeDropdown();
                  navigate("/cc-builder");
                }}
                aria-label="Navigate to CC Builder"
              >
                CC Builder
              </button>
            </li>
          </ul>
        </div>
        )}
      </div>
    ),
  };

  return (
    <div className={isMobile ? "md:hidden" : "hidden md:flex justify-around"} ref={navIconsRef}>
      <div className={wrapperClasses}>
        {iconOrder.map((key) => iconComponents[key])}
      </div>
    </div>
  );
};

export default NavIcons;