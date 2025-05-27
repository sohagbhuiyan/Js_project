import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaExchangeAlt, FaHeart, FaEye, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../../store/wishlistSlice";
import { addToCompare } from "../../../store/compareSlice";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../../store/api";
import FilteredProducts from "../body/FilteredProducts";
import { addCCItemToCartAsync } from "../../../store/cartSlice";


const FALLBACK_IMAGE = "/images/placeholder.png";

const CCItemDetailsCard = ({
  id,
  imagea,
  name,
  regularprice,
  specialprice,
  description,
  performance,
  ability,
  quantity,
  benefits,
  moralqualities,
  opportunity,
  warranty,
  ccBuilder,
  item,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showMobileIcons, setShowMobileIcons] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iconsRef = useRef(null);
  const dispatch = useDispatch();
  const cartStatus = useSelector((state) => state.cart.status);
  const cartError = useSelector((state) => state.cart.error);
  const authState = useSelector((state) => state.auth);

  const discount = regularprice - specialprice;
  const hasDiscount = specialprice > 0 && discount > 0;
  const currentPrice = hasDiscount ? specialprice : regularprice;

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 })
      .format(amount)
      .replace(/(\d+)/, "Tk $1");

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && showMobileIcons && iconsRef.current && !iconsRef.current.contains(e.target)) {
        setShowMobileIcons(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, showMobileIcons]);

  useEffect(() => {
    if (cartStatus === "failed" && cartError) {
      toast.error(cartError, { position: "top-right" });
    }
  }, [cartStatus, cartError]);

  const handleProductClick = (e) => {
    if (isMobile && !showMobileIcons) {
      e.preventDefault();
      e.stopPropagation();
      setShowMobileIcons(true);
    }
  };

  const handleIconAction = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback(e);
    if (isMobile) setShowMobileIcons(false);
  };
  const handleAddToCart = handleIconAction(() => {
  dispatch(
    addCCItemToCartAsync({
      ccBuilderItemDitels: id , // Changed to ccItemBuilderId for clarity
      quantity: 1,
      name,
      price: currentPrice,
      imagea: imagea ? `${API_BASE_URL}/images/${imagea}` : FALLBACK_IMAGE,
    })
  );
});

  const handleAddToWishlist = handleIconAction(() => {
    if (!authState.user) {
      toast.warn("Please log in to add to wishlist!", { position: "top-right" });
      return;
    }
    dispatch(
      addToWishlist({
        id,
        imagea: imagea ? `${API_BASE_URL}/images/${imagea}` : FALLBACK_IMAGE,
        name,
        regularprice,
        specialprice,
        description,
      })
    );
    toast.success("Added to wishlist!", { position: "top-right" });
  });

  const handleAddToCompare = handleIconAction(() => {
    dispatch(
      addToCompare({
        id,
        name,
        regularprice,
        specialprice,
        imagea: imagea ? `${API_BASE_URL}/images/${imagea}` : FALLBACK_IMAGE,
        description,
        specifications: { performance, ability, quantity, benefits, moralqualities, opportunity },
      })
    );
    toast.success("Added to compare!", { position: "top-right" });
  });

  const handleQuickView = handleIconAction(() => {
    setIsQuickViewOpen(true);
  });

  return (
    <>
      
      <Link to={`/cc-builder/item-details/${id}`} className="block" onClick={handleProductClick}>
      
        <div
          className={`border border-gray-400 rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-400 bg-white relative ${
            isHovered ? "md:scale-105" : "scale-100"
          }`}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
        >
          <div className="relative p-1 md:p-2 overflow-hidden rounded-md">
            <img
              src={imagea ? `${API_BASE_URL}/images/${imagea}` : FALLBACK_IMAGE}
              alt={name}
              className={`w-full h-40 md:h-48 object-contain rounded-md transition-transform duration-600 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
              loading="lazy"
            />
            {(isHovered || (isMobile && showMobileIcons)) && (
              <div
                ref={iconsRef}
                className="absolute top-2 right-2 flex flex-col gap-2 rounded-lg"
              >
                {["cart", "compare", "wishlist", "view"].map((action, idx) => (
                  <button
                    key={action}
                    className="p-1 bg-white text-gray-600 border border-gray-600 hover:cursor-pointer rounded-full shadow-sm hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    onClick={
                      idx === 0
                        ? handleAddToCart
                        : idx === 1
                        ? handleAddToCompare
                        : idx === 2
                        ? handleAddToWishlist
                        : handleQuickView
                    }
                    aria-label={`${action} ${name}`}
                  >
                    {[<FaShoppingCart />, <FaExchangeAlt />, <FaHeart />, <FaEye />][idx]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-1 text-center space-y-1">
            <h3 className="text-sm font-semibold text-gray-700 truncate">{name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 min-h-[1.5rem]">
              {ability || "No ability available"}
            </p>
            <p className="text-sm text-gray-500">
              {ccBuilder ? `Category: ${ccBuilder.name}` : "No category"}
            </p>
            {item && (
              <p className="text-xs text-gray-500">Item: {item.name}</p>
            )}
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-gray-900">{formatPrice(currentPrice)}</span>
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-xs line-through text-gray-400">
                    {formatPrice(regularprice)}
                  </span>
                  <span className="text-xs text-green-600 font-medium">
                    Save {formatPrice(discount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {isQuickViewOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsQuickViewOpen(false)}
                aria-label="Close quick view"
              >
                <FaTimes className="text-2xl cursor-pointer" />
              </button>

              <div className="grid md:grid-cols-2 gap-6 mt-2">
                <div className="space-y-3">
                  <img
                    src={imagea ? `${API_BASE_URL}/images/${imagea}` : FALLBACK_IMAGE}
                    alt={name}
                    className="w-full h-64 object-contain rounded-lg"
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(currentPrice)}
                      {hasDiscount && (
                        <span className="ml-3 text-sm line-through text-gray-400">
                          {formatPrice(regularprice)}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Quick OverView</h3>
                    <p className="text-sm text-gray-600">
                    <strong>Category:</strong> {ccBuilder ? ccBuilder.name : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Item:</strong> {item ? item.name : "None"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Description:</strong> {description || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Performance:</strong> {performance || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Ability:</strong> {ability || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Benefits:</strong> {benefits || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Moral Qualities:</strong> {moralqualities || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Opportunity:</strong> {opportunity || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Quantity:</strong> {quantity || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Warranty:</strong> {warranty ? `${warranty} years` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Toaster />
        </div>
      )}
    </>
  );
};

export default CCItemDetailsCard;
