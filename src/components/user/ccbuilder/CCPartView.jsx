// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import toast, { Toaster } from "react-hot-toast";
// import { fetchAllCCItemDetailsById, clearCCBError } from "../../../store/ccbuilderSlice";
// import { addToCartAsync } from "../../../store/cartSlice";
// import { addToWishlist } from "../../../store/wishlistSlice";
// import { addToCompare } from "../../../store/compareSlice";
// import { FaShoppingCart, FaHeart, FaExchangeAlt } from "react-icons/fa";
// import { API_BASE_URL } from "../../../store/api";
// import ProductDetails from "../product/ProductDetails";

// const FALLBACK_IMAGE = "/images/placeholder.png";

// const CCPartView = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { currentItemDetails: currentItem, loading, error } = useSelector((state) => state.ccBuilder);
//   const { user, profile, token, status: authStatus } = useSelector((state) => state.auth);
//   const cartStatus = useSelector((state) => state.cart.status);
//   const cartError = useSelector((state) => state.cart.error);
//   const [quantity, setQuantity] = useState(1);
//   const [mainImage, setMainImage] = useState(FALLBACK_IMAGE);
//   const [zoomStyle, setZoomStyle] = useState({ display: "none" });

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchAllCCItemDetailsById(id));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (currentItem?.imagea) {
//       setMainImage(`${API_BASE_URL}/images/${currentItem.imagea}`);
//     } else {
//       setMainImage(FALLBACK_IMAGE);
//     }
//   }, [currentItem]);

//   useEffect(() => {
//     if (cartStatus === "failed" && cartError) {
//       toast.error(cartError, { position: "top-right" });
//     }
//   }, [cartStatus, cartError]);

//   const increaseQuantity = () =>
//     setQuantity((prev) => (prev < (currentItem?.quantity || 0) ? prev + 1 : prev));
//   const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   const handleMouseMove = (e) => {
//     const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
//     const x = ((e.pageX - left) / width) * 100;
//     const y = ((e.pageY - top) / height) * 100;
//     setZoomStyle({
//       backgroundImage: `url(${mainImage})`,
//       backgroundSize: "200%",
//       backgroundPosition: `${x}% ${y}%`,
//       display: "block",
//     });
//   };

//   const handleMouseLeave = () => setZoomStyle({ display: "none" });

//   const handlePlaceOrderClick = () => {
//     if (!user?.id || !profile?.email || !token) {
//       toast.error("Please log in to place an order.", { position: "top-right", duration: 1000 });
//       navigate("/login", { state: { from: `/cc-builder/item-details/${id}` } });
//       return;
//     }
//     if (!currentItem) {
//       toast.error("Item not available.", { position: "top-right" });
//       return;
//     }
//     const product = {
//       id: currentItem.id,
//       productid: currentItem.id,
//       name: currentItem.name,
//       quantity: currentItem.quantity,
//       regularprice: currentItem.regularprice,
//       specialprice: currentItem.specialprice,
//       title: currentItem.name,
//       details: currentItem.description || "No description available",
//       specification: {
//         performance: currentItem.performance || "N/A",
//         ability: currentItem.ability || "N/A",
//         benefits: currentItem.benefits || "N/A",
//         moralqualities: currentItem.moralqualities || "N/A",
//         opportunity: currentItem.opportunity || "N/A",
//         warranty: currentItem.warranty ? `${currentItem.warranty} years` : "N/A",
//       },
//       imagea: currentItem.imagea,
//       ccBuilder: currentItem.ccBuilder,
//       item: currentItem.item,
//     };
//     navigate("/checkout", { state: { product, quantity } });
//   };

//   const handleAddToCart = () => {
//     if (!user?.id || !profile?.email || !token) {
//       toast.error("Please log in to add to cart.", { position: "top-right", duration: 1000 });
//       navigate("/login", { state: { from: `/cc-builder/item-details/${id}` } });
//       return;
//     }
//     if (!currentItem) {
//       toast.error("Item not available.", { position: "top-right" });
//       return;
//     }
//     dispatch(
//       addToCartAsync({
//         productDetailsId: id,
//         quantity,
//         name: currentItem.name,
//         price: currentItem.specialprice > 0 ? currentItem.specialprice : currentItem.regularprice,
//         imagea: mainImage,
//       })
//     )
//       .then(() => {
//         toast.success("Added to cart!", { position: "top-right" });
//       })
//       .catch(() => {
//         // Error handled in useEffect
//       });
//   };

//   const handleAddToWishlist = () => {
//     if (!user?.id || !profile?.email || !token) {
//       toast.error("Please log in to add to wishlist.", { position: "top-right", duration: 1000 });
//       navigate("/login", { state: { from: `/cc-builder/item-details/${id}` } });
//       return;
//     }
//     if (!currentItem) {
//       toast.error("Item not available.", { position: "top-right" });
//       return;
//     }
//     dispatch(
//       addToWishlist({
//         id,
//         imagea: mainImage,
//         name: currentItem.name,
//         regularprice: currentItem.regularprice,
//         specialprice: currentItem.specialprice,
//         description: currentItem.description,
//       })
//     );
//     toast.success("Added to wishlist!", { position: "top-right" });
//   };

//   const handleAddToCompare = () => {
//     if (!currentItem) {
//       toast.error("Item not available.", { position: "top-right" });
//       return;
//     }
//     dispatch(
//       addToCompare({
//         id,
//         name: currentItem.name,
//         regularprice: currentItem.regularprice,
//         specialprice: currentItem.specialprice,
//         imagea: mainImage,
//         description: currentItem.description,
//         specifications: {
//           performance: currentItem.performance,
//           ability: currentItem.ability,
//           quantity: currentItem.quantity,
//           benefits: currentItem.benefits,
//           moralqualities: currentItem.moralqualities,
//           opportunity: currentItem.opportunity,
//           warranty: currentItem.warranty,
//         },
//       })
//     );
//     toast.success("Added to compare!", { position: "top-right" });
//   };

//   const handleRetry = () => {
//     dispatch(clearCCBError());
//     dispatch(fetchAllCCItemDetailsById(id));
//   };

//   const formatPrice = (amount) =>
//     new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 })
//       .format(amount)
//       .replace(/(\d+)/, "Tk $1");

//   if (loading.itemDetails || authStatus === "loading") {
//     return (
//       <div className="flex justify-center items-center my-8">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error.itemDetails) {
//     return (
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error.itemDetails}</div>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           onClick={handleRetry}
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!currentItem) {
//     return (
//       <div className="max-w-5xl mx-auto px-4 py-8 text-center">
//         <p className="text-xl text-gray-700">Item Not Found</p>
//       </div>
//     );
//   }

//   const discount = currentItem.regularprice - currentItem.specialprice;
//   const hasDiscount = currentItem.specialprice > 0 && discount > 0;
//   const currentPrice = hasDiscount ? currentItem.specialprice : currentItem.regularprice;

//   return (
//     <>
//       <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 animate-fade-in">
//         {/* Item Image */}
//         <div className="flex-1 flex justify-center">
//           <div
//             className="relative w-full max-w-[400px] h-[200px] sm:h-[300px] md:h-[400px] border border-gray-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
//             onMouseMove={handleMouseMove}
//             onMouseLeave={handleMouseLeave}
//           >
//             <img
//               src={mainImage}
//               alt={currentItem.name}
//               className="w-full h-full object-contain"
//               onError={(e) => (e.target.src = FALLBACK_IMAGE)}
//             />
//             <div
//               className="absolute inset-0 cursor-zoom-in"
//               style={zoomStyle}
//             />
//           </div>
//         </div>

//         {/* Item Details */}
//         <div className="flex-1 space-y-4">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{currentItem.name}</h1>
//           <p className="text-sm text-gray-600">Item ID: {currentItem.id}</p>
//           <p className="text-sm text-gray-600">
//             <strong>Category:</strong> {currentItem.ccBuilder ? currentItem.ccBuilder.name : "N/A"}
//           </p>
//           {currentItem.item && (
//             <p className="text-sm text-gray-600">
//               <strong>Item:</strong> {currentItem.item.name}
//             </p>
//           )}
//           <div className="space-y-2">
//             <p className="text-lg font-semibold text-gray-900">
//               {formatPrice(currentPrice)}
//               {hasDiscount && (
//                 <span className="ml-3 text-sm line-through text-gray-400">
//                   {formatPrice(currentItem.regularprice)}
//                 </span>
//               )}
//             </p>
//             {hasDiscount && (
//               <p className="text-sm text-green-600">
//                 Save {formatPrice(discount)} on online order
//               </p>
//             )}
//           </div>
//           <div className="space-y-2">
//             <h3 className="text-lg font-semibold text-gray-900">Quick Overview</h3>
//             <p className="text-sm text-gray-600">{currentItem.description || "No description available."}</p>
//             {currentItem.performance && (
//               <p className="text-sm text-gray-600">
//                 <strong>Performance:</strong> {currentItem.performance}
//               </p>
//             )}
//             {currentItem.ability && (
//               <p className="text-sm text-gray-600">
//                 <strong>Ability:</strong> {currentItem.ability}
//               </p>
//             )}
//             {currentItem.benefits && (
//               <p className="text-sm text-gray-600">
//                 <strong>Benefits:</strong> {currentItem.benefits}
//               </p>
//             )}
//             {currentItem.moralqualities && (
//               <p className="text-sm text-gray-600">
//                 <strong>Moral Qualities:</strong> {currentItem.moralqualities}
//               </p>
//             )}
//             {currentItem.opportunity && (
//               <p className="text-sm text-gray-600">
//                 <strong>Opportunity:</strong> {currentItem.opportunity}
//               </p>
//             )}
//             {currentItem.warranty > 0 ? (
//               <p className="text-sm text-gray-600">
//                 <strong>Warranty:</strong> {currentItem.warranty} years
//               </p>
//             ) : (
//               <p className="text-sm text-gray-600">
//                 <strong>Warranty:</strong> None
//               </p>
//             )}
//             <p className="text-sm text-gray-600">
//               <strong>Stock:</strong> {currentItem.quantity > 0 ? `${currentItem.quantity} available` : "Out of Stock"}
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
//               onClick={decreaseQuantity}
//               disabled={quantity <= 1 || loading.itemDetails || currentItem.quantity === 0}
//             >
//               -
//             </button>
//             <span className="text-sm font-medium">{quantity}</span>
//             <button
// ivt              className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
//               onClick={increaseQuantity}
//               disabled={quantity >= currentItem.quantity || loading.itemDetails || currentItem.quantity === 0}
//             >
//               +
//             </button>
//             <button
//               className="bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-900 transition-all duration-300 disabled:opacity-50"
//               onClick={handlePlaceOrderClick}
//               disabled={loading.itemDetails || currentItem.quantity === 0}
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               className="flex items-center gap-2 bg-white text-sm text-gray-600 border border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
//               onClick={handleAddToCart}
//               disabled={loading.itemDetails || currentItem.quantity === 0}
//             >
//               <FaShoppingCart /> Add to Cart
//             </button>
//             <button
//               className="flex items-center gap-2 bg-white text-sm text-gray-600 border border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
//               onClick={handleAddToWishlist}
//             >
//               <FaHeart /> Add to Wishlist
//             </button>
//             <button
//               className="flex items-center gap-2 bg-white text-sm text-gray-600 border border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
//               onClick={handleAddToCompare}
//             >
//               <FaExchangeAlt /> Add to Compare
//             </button>
//           </div>
//         </div>
//       </div>
//       <Toaster />
//       <ProductDetails />
//     </>
//   );
// };

// // Animation styles
// const animationStyles = `
//   @keyframes fade-in {
//     from { opacity: 0; }
//     to { opacity: 1; }
//   }
//   .animate-fade-in {
//     animation: fade-in 0.5s ease-in;
//   }
// `;

// const styleSheet = document.createElement("style");
// styleSheet.innerText = animationStyles;
// document.head.appendChild(styleSheet);

// export default CCPartView;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { fetchCCItemDetailsById, clearCCBError } from "../../../store/ccbuilderSlice";
import { addToCartAsync } from "../../../store/cartSlice";
import { addToWishlist } from "../../../store/wishlistSlice";
import { addToCompare } from "../../../store/compareSlice";
import { FaShoppingCart, FaHeart, FaExchangeAlt } from "react-icons/fa";
import { API_BASE_URL } from "../../../store/api";
import ProductDetails from "../product/ProductDetails";

const FALLBACK_IMAGE = "/images/placeholder.png";

const CCPartView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentItemDetails: currentItem, loading, error } = useSelector((state) => state.ccBuilder);
  const { user, profile, token, status: authStatus } = useSelector((state) => state.auth);
  const cartStatus = useSelector((state) => state.cart.status);
  const cartError = useSelector((state) => state.cart.error);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(FALLBACK_IMAGE);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  useEffect(() => {
    if (id) {
      dispatch(fetchCCItemDetailsById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentItem?.imagea) {
      setMainImage(`${API_BASE_URL}/images/${currentItem.imagea}`);
    } else {
      setMainImage(FALLBACK_IMAGE);
    }
  }, [currentItem]);

  useEffect(() => {
    if (cartStatus === "failed" && cartError) {
      toast.error(cartError, { position: "top-right" });
    }
  }, [cartStatus, cartError]);

  const increaseQuantity = () =>
    setQuantity((prev) => (prev < (currentItem?.quantity || 0) ? prev + 1 : prev));
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${mainImage})`,
      backgroundSize: "200%",
      backgroundPosition: `${x}% ${y}%`,
      display: "block",
    });
  };

  const handleMouseLeave = () => setZoomStyle({ display: "none" });

  const handlePlaceOrderClick = () => {
    if (!user?.id || !profile?.email || !token) {
      toast.error("Please log in to place an order.", { position: "top-right", duration: 1000 });
      navigate("/login", { state: { from: `/cc-builder/item-details/${id}` } });
      return;
    }
    if (!currentItem) {
      toast.error("Item not available.", { position: "top-right" });
      return;
    }
    const product = {
      id: currentItem.id,
      productid: currentItem.id.toString(), // Use id as productid
      name: currentItem.name,
      quantity: quantity, // Use user-selected quantity
      regularprice: currentItem.regularprice,
      specialprice: currentItem.specialprice,
      imagea: currentItem.imagea,
      description: currentItem.description || "No description available",
      performance: currentItem.performance || "N/A",
      ability: currentItem.ability || "N/A",
      benefits: currentItem.benefits || "N/A",
      moralqualities: currentItem.moralqualities || "N/A",
      opportunity: currentItem.opportunity || "N/A",
      warranty: currentItem.warranty ? `${currentItem.warranty} years` : "N/A",
      ccBuilder: currentItem.ccBuilder, // Category equivalent
      item: currentItem.item,
    };
    navigate("/checkout", {
      state: {
        products: [product],
        orderType: "ccpart", // Indicate CC Builder order
      },
    });
  };

  // const handleAddToCart = () => {
  //   if (!user?.id || !profile?.email || !token) {
  //     toast.error("Please log in to add to cart.", { position: "top-right", duration: 1000 });
  //     navigate("/login", { state: { from: `/cc-builder/item-details/${id}` } });
  //     return;
  //   }
  //   if (!currentItem) {
  //     toast.error("Item not available.", { position: "top-right" });
  //     return;
  //   }
  //   dispatch(
  //     addToCartAsync({
  //       productDetailsId: id,
  //       quantity,
  //       name: currentItem.name,
  //       price: currentItem.specialprice > 0 ? currentItem.specialprice : currentItem.regularprice,
  //       imagea: mainImage,
  //     })
  //   )
  //     .then(() => {
  //       toast.success("Added to cart!", { position: "top-right" });
  //     })
  //     .catch(() => {
  //       // Error handled in useEffect
  //     });
  // };

  // const handleAddToWishlist = () => {
  //   if (!user?.id || !profile?.email || !token) {
  //     toast.error("Please log in to add to wishlist.", { position: "top-right", duration: 1000 });
  //     navigate("/login", { state: { from: `/cc-builder/item-details/${id}` } });
  //     return;
  //   }
  //   if (!currentItem) {
  //     toast.error("Item not available.", { position: "top-right" });
  //     return;
  //   }
  //   dispatch(
  //     addToWishlist({
  //       id,
  //       imagea: mainImage,
  //       name: currentItem.name,
  //       regularprice: currentItem.regularprice,
  //       specialprice: currentItem.specialprice,
  //       description: currentItem.description,
  //     })
  //   );
  //   toast.success("Added to wishlist!", { position: "top-right" });
  // };

  // const handleAddToCompare = () => {
  //   if (!currentItem) {
  //     toast.error("Item not available.", { position: "top-right" });
  //     return;
  //   }
  //   dispatch(
  //     addToCompare({
  //       id,
  //       name: currentItem.name,
  //       regularprice: currentItem.regularprice,
  //       specialprice: currentItem.specialprice,
  //       imagea: mainImage,
  //       description: currentItem.description,
  //       specifications: {
  //         performance: currentItem.performance,
  //         ability: currentItem.ability,
  //         quantity: currentItem.quantity,
  //         benefits: currentItem.benefits,
  //         moralqualities: currentItem.moralqualities,
  //         opportunity: currentItem.opportunity,
  //         warranty: currentItem.warranty,
  //       },
  //     })
  //   );
  //   toast.success("Added to compare!", { position: "top-right" });
  // };

  const handleRetry = () => {
    dispatch(clearCCBError());
    dispatch(fetchCCItemDetailsById(id));
  };

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 })
      .format(amount)
      .replace(/(\d+)/, "Tk $1");

  if (loading.itemDetails || authStatus === "loading") {
    return (
      <div className="flex justify-center items-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error.itemDetails) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error.itemDetails}</div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-700">Item Not Found</p>
      </div>
    );
  }

  const discount = currentItem.regularprice - currentItem.specialprice;
  const hasDiscount = currentItem.specialprice > 0 && discount > 0;
  const currentPrice = hasDiscount ? currentItem.specialprice : currentItem.regularprice;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 animate-fade-in">
        {/* Item Image */}
        <div className="flex-1 flex justify-center">
          <div
            className="relative w-full max-w-[400px] h-[200px] sm:h-[300px] md:h-[400px] border border-gray-400 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={mainImage}
              alt={currentItem.name}
              className="w-full h-full object-contain"
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            />
            <div className="absolute inset-0 cursor-zoom-in" style={zoomStyle} />
          </div>
        </div>

        {/* Item Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{currentItem.name}</h1>
          <p className="text-sm text-gray-600">Item ID: {currentItem.id}</p>
          <p className="text-sm text-gray-600">
            <strong>Category:</strong> {currentItem.ccBuilder ? currentItem.ccBuilder.name : "N/A"}
          </p>
          {currentItem.item && (
            <p className="text-sm text-gray-600">
              <strong>Item:</strong> {currentItem.item.name}
            </p>
          )}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(currentPrice)}
              {hasDiscount && (
                <span className="ml-3 text-sm line-through text-gray-400">
                  {formatPrice(currentItem.regularprice)}
                </span>
              )}
            </p>
            {hasDiscount && (
              <p className="text-sm text-green-600">
                Save {formatPrice(discount)} on online order
              </p>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Quick Overview</h3>
            <p className="text-sm text-gray-600">
              {currentItem.description || "No description available."}
            </p>
            {currentItem.performance && (
              <p className="text-sm text-gray-600">
                <strong>Performance:</strong> {currentItem.performance}
              </p>
            )}
            {currentItem.ability && (
              <p className="text-sm text-gray-600">
                <strong>Ability:</strong> {currentItem.ability}
              </p>
            )}
            {currentItem.benefits && (
              <p className="text-sm text-gray-600">
                <strong>Benefits:</strong> {currentItem.benefits}
              </p>
            )}
            {currentItem.moralqualities && (
              <p className="text-sm text-gray-600">
                <strong>Moral Qualities:</strong> {currentItem.moralqualities}
              </p>
            )}
            {currentItem.opportunity && (
              <p className="text-sm text-gray-600">
                <strong>Opportunity:</strong> {currentItem.opportunity}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Warranty:</strong>{" "}
              {currentItem.warranty > 0 ? `${currentItem.warranty} years` : "None"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Stock:</strong>{" "}
              {currentItem.quantity > 0 ? `${currentItem.quantity} available` : "Out of Stock"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || loading.itemDetails || currentItem.quantity === 0}
            >
              -
            </button>
            <span className="text-sm font-medium">{quantity}</span>
            <button
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
              onClick={increaseQuantity}
              disabled={quantity >= currentItem.quantity || loading.itemDetails || currentItem.quantity === 0}
            >
              +
            </button>
            <button
              className="bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-900 transition-all duration-300 disabled:opacity-50"
              onClick={handlePlaceOrderClick}
              disabled={loading.itemDetails || currentItem.quantity === 0}
            >
              Proceed to Order
            </button>
          </div>

        </div>
      </div>
      <Toaster />
      <ProductDetails />
    </>
  );
};

// Animation styles
const animationStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-in;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = animationStyles;
document.head.appendChild(styleSheet);

export default CCPartView;
