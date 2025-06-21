import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaExchangeAlt, FaHeart, FaEye } from "react-icons/fa";
import { addToWishlist } from "../../../../store/wishlistSlice";
import { addToCartAsync } from "../../../../store/cartSlice";
import { addToCompare } from "../../../../store/compareSlice";
import toast, { Toaster } from "react-hot-toast";
import QuickViewModal from "../../product/QuickViewModal";

const NetworkViewCard = ({
  id,
  imagea,
  category,
  name,
  datatransferrate,
  regularprice,
  specialprice,
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
      if (
        isMobile &&
        showMobileIcons &&
        iconsRef.current &&
        !iconsRef.current.contains(e.target)
      ) {
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
      addToCartAsync({
        productDetailsId: id,
        quantity: 1,
        name,
        price: currentPrice,
        imagea,
      })
    )
      .then(() => {
        toast.success("Added to cart!", { position: "top-right" });
      })
      .catch(() => {});
  });

  const handleAddToWishlist = handleIconAction(() => {
    if (!authState.user) {
      toast.warn("Please log in to add to wishlist!", {
        position: "top-right",
      });
      return;
    }
    dispatch(
      addToWishlist({
        id,
        imagea,
        category,
        name,
        regularprice,
        specialprice,
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
        imagea,
        category,
      })
    );
    toast.success("Added to compare!", { position: "top-right" });
  });

  const handleQuickView = handleIconAction(() => {
    setIsQuickViewOpen(true);
  });

  return (
    <>
      <Link to={`/network/${id}`} style={{ textDecoration: "none" }} onClick={handleProductClick}>
        <div
          className={`border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-300 bg-white relative ${
            isHovered ? "md:scale-105" : "scale-100"
          }`}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
        >
          <div className="relative p-1 overflow-hidden rounded-md">
            <img
              src={imagea}
              alt={name}
              className={`w-full h-40 md:h-48 object-cover rounded-md transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
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
                    className="p-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 rounded-full shadow-sm hover:text-gray-800 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      switch (idx) {
                        case 0:
                          handleAddToCart(e);
                          break;
                        case 1:
                          handleAddToCompare(e);
                          break;
                        case 2:
                          handleAddToWishlist(e);
                          break;
                        case 3:
                          handleQuickView(e);
                          break;
                      }
                    }}
                    aria-label={`${action} ${name}`}
                  >
                    {[
                      <FaShoppingCart />,
                      <FaExchangeAlt />,
                      <FaHeart />,
                      <FaEye />,
                    ][idx]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-3 space-y-1">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 min-h-[2rem]">
              {category}
            </p>
            <p className="text-xs text-gray-500 line-clamp-2 min-h-[1.5rem]">
              {datatransferrate || "N/A"}
            </p>
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-gray-900">
                {formatPrice(currentPrice)}
              </span>
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

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={{ id, imagea, category, name, datatransferrate, regularprice, specialprice }}
      />
      <Toaster position="top-right" />
    </>
  );
};

export default NetworkViewCard;
