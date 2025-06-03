// import { useSelector, useDispatch } from "react-redux";
// import { removeFromWishlist, initializeWishlist } from "../../../store/wishlistSlice";
// import { addToCartAsync } from "../../../store/cartSlice";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useEffect } from "react";

// const WishlistPage = () => {
//   const wishlistItems = useSelector((state) => state.wishlist.items);
//   const user = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(initializeWishlist({ userId: user?.id }));
//   }, [dispatch, user]);

//   const handleAddToCart = (item) => {
//     dispatch(
//       addToCartAsync({
//         productDetailsId: item.id,
//         name: item.name,
//         price: item.specialprice || item.regularprice,
//         imagea: item.imagea,
//         quantity: 1,
//       })
//     ).then(() => {
//       toast.success(`${item.title || item.name} added to cart!`, {
//         position: "top-right",
//         duration: 2000,
//       });
//     });
//   };

//   const handleRemove = (id) => {
//     dispatch(removeFromWishlist({ id, userId: user?.id }));
//     toast.success("Removed from wishlist!", {
//       position: "top-right",
//       duration: 2000,
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-6">
//         <nav className="flex mb-4" aria-label="Breadcrumb">
//           <ol className="flex items-center space-x-2 text-sm">
//             <li>
//               <Link to="/" className="text-gray-500 hover:text-gray-700">
//                 Home
//               </Link>
//             </li>
//             <li>
//               <span className="text-gray-400 mx-2">→</span>
//             </li>
//             <li className="text-gray-700 font-medium" aria-current="page">
//               Wishlist
//             </li>
//           </ol>
//         </nav>

//         <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
//           My Wishlist
//         </h1>
//         <p className="text-gray-600">{wishlistItems.length} items in wishlist</p>
//       </div>

//       {wishlistItems.length === 0 ? (
//         <div className="text-center py-16">
//           <div className="max-w-md mx-auto">
//             <svg
//               className="mx-auto h-12 w-12 md:h-24 md:w-24 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//               />
//             </svg>
//             <h2 className="mt-4 md:text-2xl font-bold text-gray-900">
//               Your wishlist is empty
//             </h2>
//             <p className="mt-2 text-gray-600">Start adding items you love to your wishlist</p>
//             <Link
//               to="/"
//               className="mt-6 inline-block p-2 md:p-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {wishlistItems.map((item) => (
//             <div
//               key={item.id}
//               className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
//             >
//               <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
//                 <img
//                   src={item.imagea || "/placeholder-image.jpg"}
//                   alt={item.title || item.name}
//                   className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
//                 />
//               </div>

//               <div className="p-1.5 md:p-4">
//                 <h2 className="md:text-lg font-semibold text-gray-900 mb-1">
//                   {item.title || item.name}
//                 </h2>
//                 <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mb-3">
//                   {item.category || "No category"}
//                 </p>

//                 <div className="flex items-center justify-between mt-4">
//                   <div>
//                     <p className="text-sm md:text-lg font-bold text-gray-900">
//                       Tk {item.specialprice || item.regularprice || "N/A"}
//                     </p>
//                     {item.regularprice && item.specialprice && item.specialprice < item.regularprice && (
//                       <p className="text-sm text-gray-500 line-through">
//                         Tk {item.regularprice}
//                       </p>
//                     )}
//                   </div>

//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleRemove(item.id)}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                       title="Remove from wishlist"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => handleAddToCart(item)}
//                       className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
//                       title="Add to cart"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {item.specialprice && item.regularprice && item.specialprice < item.regularprice && (
//                 <span className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
//                   {Math.round(((item.regularprice - item.specialprice) / item.regularprice) * 100)}% OFF
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WishlistPage;