// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { FaShoppingCart, FaExchangeAlt, FaHeart, FaEye, FaTimes } from "react-icons/fa";
// import { addToWishlist } from "../../../../store/wishlistSlice";
// import { addToCartAsync } from "../../../../store/cartSlice";
// import { addToCompare } from "../../../../store/compareSlice";
// import toast, { Toaster } from "react-hot-toast";

// const DesktopViewCard = ({
//   id,
//   imagea,
//   category,
//   name,
//   ram,
//   regularprice,
//   specialprice,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
//   const [showMobileIcons, setShowMobileIcons] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const iconsRef = useRef(null);
//   const dispatch = useDispatch();
//   const cartStatus = useSelector((state) => state.cart.status);
//   const cartError = useSelector((state) => state.cart.error);
//   const authState = useSelector((state) => state.auth);

//   const discount = regularprice - specialprice;
//   const hasDiscount = specialprice > 0 && discount > 0;
//   const currentPrice = hasDiscount ? specialprice : regularprice;

//   const formatPrice = (amount) =>
//     new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 })
//       .format(amount)
//       .replace(/(\d+)/, "Tk $1");

//   useEffect(() => {
//     const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
//     checkIsMobile();
//     window.addEventListener("resize", checkIsMobile);
//     return () => window.removeEventListener("resize", checkIsMobile);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (isMobile && showMobileIcons && iconsRef.current && !iconsRef.current.contains(e.target)) {
//         setShowMobileIcons(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isMobile, showMobileIcons]);

//   useEffect(() => {
//     if (cartStatus === "failed" && cartError) {
//       toast.error(cartError, { position: "top-right" });
//     }
//   }, [cartStatus, cartError]);

//   const handleProductClick = (e) => {
//     if (isMobile) {
//       if (!showMobileIcons) {
//         e.preventDefault();
//         e.stopPropagation();
//       }
//       setShowMobileIcons(!showMobileIcons);
//     }
//   };

//   const handleIconAction = (callback) => (e) => {
//     e.preventDefault();
//     callback(e);
//     if (isMobile) setShowMobileIcons(false);
//   };

//   const handleAddToCart = handleIconAction(() => {
//     dispatch(
//       addToCartAsync({
//         productDetailsId: id,
//         quantity: 1,
//         name,
//         price: currentPrice,
//         imagea,
//       })
//     )
//       .then(() => {
//         toast.success("Added to cart!", { position: "top-right" });
//       })
//       .catch(() => {
//         // Error toast is handled in the useEffect above
//       });
//   });

//   const handleAddToWishlist = handleIconAction(() => {
//     if (!authState.user) {
//       toast.warn("Please log in to add to wishlist!", { position: "top-right" });
//       return;
//     }
//     dispatch(
//       addToWishlist({
//         id,
//         imagea,
//         category,
//         name,
//         regularprice,
//         specialprice,
//       })
//     );
//     toast.success("Added to wishlist!", { position: "top-right" });
//   });

//   const handleAddToCompare = handleIconAction(() => {
//     dispatch(
//       addToCompare({
//         id,
//         name,
//         regularprice,
//         specialprice,
//         imagea,
//         category,
//       })
//     );
//     toast.success("Added to compare!", { position: "top-right" });
//   });

//   return (
//     <>
//       <Link to={`/desktop/${id}`} className="block" onClick={handleProductClick}>
//         <div
//           className={`border border-gray-400 rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-400 bg-white relative ${
//             isHovered ? "md:scale-105" : "scale-100"
//           }`}
//           onMouseEnter={() => !isMobile && setIsHovered(true)}
//           onMouseLeave={() => !isMobile && setIsHovered(false)}
//         >
//           <div className="relative p-1 overflow-hidden rounded-md">
//             <img
//               src={imagea}
//               alt={name}
//               className={`w-full h-40 md:h-48 object-cover rounded-md transition-transform duration-600 ${
//                 isHovered ? "scale-118" : "scale-100"
//               }`}
//               loading="lazy"
//             />
//             {(isHovered || (isMobile && showMobileIcons)) && (
//               <div
//                 ref={iconsRef}
//                 className="absolute top-2 right-2 flex flex-col gap-2 rounded-lg"
//               >
//                 {["cart", "compare", "wishlist", "view"].map((action, idx) => (
//                   <button
//                     key={action}
//                     className="p-1 bg-white text-gray-600 border border-gray-600 hover:cursor-pointer rounded-full shadow-sm hover:bg-gray-700 hover:text-white transition-colors duration-200"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       switch (idx) {
//                         case 0:
//                           handleAddToCart(e);
//                           break;
//                         case 1:
//                           handleAddToCompare(e);
//                           break;
//                         case 2:
//                           handleAddToWishlist(e);
//                           break;
//                         case 3:
//                           setIsQuickViewOpen(true);
//                           break;
//                       }
//                     }}
//                     aria-label={`${action} ${name}`}
//                   >
//                     {[<FaShoppingCart />, <FaExchangeAlt />, <FaHeart />, <FaEye />][idx]}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="text-center mt-2 space-y-1">
//             <h3 className="text-sm font-semibold text-gray-700 truncate">{name}</h3>
//             <p className="text-xs text-gray-600 line-clamp-2 min-h-[2rem]">{category}</p>
//             <p className="text-xs text-gray-600 line-clamp-2 min-h-[1.5rem]">{ram}</p>
//             <div className="flex flex-col items-center justify-center">
//               <span className="text-sm font-bold text-gray-900">{formatPrice(currentPrice)}</span>
//               {hasDiscount && (
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs line-through text-gray-400">{formatPrice(regularprice)}</span>
//                   <span className="text-xs text-green-600 font-medium">Save {formatPrice(discount)}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Link>

//       {isQuickViewOpen && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 relative">
//               <button
//                 className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//                 onClick={() => setIsQuickViewOpen(false)}
//                 aria-label="Close quick view"
//               >
//                 <FaTimes className="text-2xl cursor-pointer" />
//               </button>

//               <div className="grid md:grid-cols-2 gap-6 mt-4">
//                 <div className="space-y-3">
//                   <img src={imagea} alt={name} className="w-full h-64 object-contain rounded-lg" />
//                 </div>

//                 <div className="space-y-4">
//                   <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
//                   <div className="space-y-2">
//                     <p className="text-lg font-semibold text-gray-900">
//                       {formatPrice(currentPrice)}
//                       {hasDiscount && (
//                         <span className="ml-3 text-sm line-through text-gray-400">
//                           {formatPrice(regularprice)}
//                         </span>
//                       )}
//                     </p>
//                     <p className="text-sm text-gray-600">{category}</p>
//                     <p className="text-sm text-gray-600">{ram}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Toaster position="top-right" />
//         </div>
//       )}
//     </>
//   );
// };

// export default DesktopViewCard;

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaExchangeAlt, FaHeart, FaEye } from "react-icons/fa";
import { addToWishlist } from "../../../../store/wishlistSlice";
import { addToCompare } from "../../../../store/compareSlice";
import toast, { Toaster } from "react-hot-toast";
import QuickViewModal from "../../product/QuickViewModal";
import { desktopAddToCartAsync } from "../../../../store/static/desktopSlice";

const DesktopViewCard = ({
  id,
  imagea,
  category,
  name,
  ram,
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
      desktopAddToCartAsync({
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
      <Link to={`/desktop/${id}`} style={{ textDecoration: "none" }}>
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
              {ram}
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
        product={{ id, imagea, category, name, ram, regularprice, specialprice }}
      />
      <Toaster position="top-right" />
    </>
  );
};

export default DesktopViewCard;
