// import { useRef, useEffect, useCallback, useMemo } from 'react';
// import { Trash } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaTimes } from 'react-icons/fa';
// import debounce from 'lodash.debounce';
// import toast from 'react-hot-toast';
// import {
//   removeFromCartAsync,
//   updateCartQuantityAsync,
//   clearError,
//   selectCartItems,
//   selectCartCount,
//   selectCartError,
// } from '../../../store/cartSlice';
// import { API_BASE_URL } from '../../../store/api';

// export const CartDropdown = ({ isOpen, onClose, position = 'desktop', cartIconRef }) => {

//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const items = useSelector(selectCartItems);
//   const count = useSelector(selectCartCount);
//   const error = useSelector(selectCartError);
//   const { profile, token } = useSelector(
//     (state) => state.auth,
//     (prev, next) => prev.profile?.id === next.profile?.id && prev.token === next.token
//   );

//   const containerClasses = useMemo(
//     () =>
//       position === 'desktop'
//         ? 'absolute md:-left-15 right-0 top-8 w-60 md:w-80 bg-white shadow-lg rounded-lg p-2 z-50 text-black'
//         : 'fixed bottom-14 left-8 right-8 bg-gray-100 shadow-lg rounded-lg p-2 z-50 text-black max-h-[80vh] overflow-y-auto',
//     [position]
//   );

//   const imageSize = useMemo(() => (position === 'desktop' ? 'w-16 h-16' : 'w-12 h-12'), [position]);
//   const fallbackImage = '/images/fallback-image.jpg';

//   // Memoize displayed items
//   const displayedItems = useMemo(() => items.slice(0, 5), [items]);
//   const hasMoreItems = useMemo(() => items.length > 5, [items]);

//   // Debounced quantity update
//   const debouncedQuantityChange = useMemo(
//     () =>
//       debounce((cartId, productId, quantity) => {
//         if (quantity >= 1) {
//           if (profile?.id && token && cartId) {
//             dispatch(updateCartQuantityAsync({ id: cartId, quantity }));
//           } else {
//             dispatch({ type: 'cart/updateQuantity', payload: { productId, quantity } });
//             toast.success('Quantity updated!', {
//               duration: 2000,
//               style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//             });
//           }
//         }
//       }, 500),
//     [dispatch, profile, token]
//   );

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         isOpen &&
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         cartIconRef.current &&
//         !cartIconRef.current.contains(event.target)
//       ) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isOpen, onClose, cartIconRef]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearError()), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, dispatch]);

//   const handleRemove = useCallback(
//     (cartId, productId, productName, event) => {
//       event.stopPropagation();
//       if (profile?.id && token && cartId) {
//         dispatch(removeFromCartAsync({ id: cartId, productId, productName }));
//       } else {
//       dispatch({ type: 'cart/removeFromCart', payload: productId });
//         toast.success(`${productName} removed from cart!`, {
//           duration: 2000,
//           style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//         });
//       }
    
//     },
//     [dispatch, profile, token]
//   );

//   const handleQuantityChange = useCallback(
//     (cartId, productId, newQuantity, event) => {
//       event.stopPropagation();
//       const quantity = parseInt(newQuantity, 10);
//       if (isNaN(quantity)) return;
//       debouncedQuantityChange(cartId, productId, quantity);
//     },
//     [debouncedQuantityChange]
//   );

//   const handleItemClick = useCallback(
//     (event) => {
//       event.stopPropagation();
//       onClose();
//     },
//     [onClose]
//   );

//   const handleViewCartClick = useCallback(() => {
//     onClose();
//     navigate('/cart');
//   }, [onClose, navigate]);

//   if (!isOpen) return null;

//   return (
//     <div className={containerClasses} ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
//       <div className="flex justify-between items-center border-b border-gray-400">
//         <h3 className="text-lg font-semibold">Cart ({count})</h3>
//         <button
//           onClick={onClose}
//           className="p-1 hover:bg-gray-200 rounded-full"
//           aria-label="Close cart dropdown"
//         >
//           <FaTimes className="text-lg cursor-pointer text-gray-600" />
//         </button>
//       </div>

//       {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}

//       <div className={`mt-2 ${position === 'desktop' ? 'max-h-90' : ''} overflow-y-auto`}>
//         {items.length === 0 ? (
//           <p className="text-center text-gray-500">Your cart is empty</p>
//         ) : (
//         displayedItems.map((item) => (
//           <div
//             key={item.cartId} // Use cartId instead of productId
//             className="group relative flex items-center justify-between p-2 border-b border-gray-200"
//           >
//               <Link
//                 to={`/product/${item.productId}`}
//                 className="absolute inset-0 z-10"
//                 onClick={handleItemClick}
//                 aria-label={`View ${item.name}`}
//               />
//               <div className="flex items-center w-full">
//                 <img
//                   src={item.imagea ? `${API_BASE_URL}/images/${item.imagea}` : fallbackImage}
//                   alt={item.name}
//                   className={`${imageSize} object-cover rounded`}
                 
//                 />
//                 <div className="flex-1 px-2">
//                   <p className="text-sm font-semibold group-hover:text-blue-600 transition-colors">
//                     {item.name}
//                   </p>
//                   <div className="flex items-center space-x-2 text-xs text-gray-500">
//                     <span>Tk {item.price.toFixed(2)}</span>
//                     <span>x</span>
//                     <input
//                       type="number"
//                       min="1"
//                       value={item.quantity}
//                       onChange={(e) => handleQuantityChange(item.cartId, item.productId, e.target.value, e)}
//                       className="w-12 border border-gray-300 rounded-sm text-center z-20 relative focus:ring-2 focus:ring-green-200"
//                       aria-label={`Quantity for ${item.name}`}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={(event) => handleRemove(item.cartId, item.productId, item.name, event)}
//                 className="text-red-500 hover:text-red-700 z-20 relative"
//                 aria-label={`Remove ${item.name} from cart`}
//               >
//                 <Trash className="w-5 cursor-pointer h-5 ml-3" />
//               </button>
//             </div>
//           ))
//         )}
//         {hasMoreItems && (
//           <div className="text-center mt-2">
//             <button
//               onClick={handleViewCartClick}
//               className="text-blue-600 hover:underline text-sm"
//               aria-label={`View all ${items.length} cart items`}
//             >
//               View all {items.length} items
//             </button>
//           </div>
//         )}
//       </div>

//       {items.length > 0 && (
//         <div className="p-2">
//           <button
//             onClick={handleViewCartClick}
//             className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-center"
//             aria-label="View cart"
//           >
//             View Cart
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartDropdown;



// import { useRef, useEffect, useCallback, useMemo } from 'react';
// import { Trash } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaTimes } from 'react-icons/fa';
// import debounce from 'lodash.debounce';
// import toast from 'react-hot-toast';
// import {
//   removeFromCartAsync,
//   updateCartQuantityAsync,
//   clearError,
//   selectCartItems,
//   selectCartCount,
//   selectCartError,
//   fetchCartItemsAsync,
// } from '../../../store/cartSlice';
// import { API_BASE_URL } from '../../../store/api';

// export const CartDropdown = ({ isOpen, onClose, position = 'desktop', cartIconRef }) => {
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const items = useSelector(selectCartItems);
//   const count = useSelector(selectCartCount);
//   const error = useSelector(selectCartError);
//   const { profile, token } = useSelector(
//     (state) => state.auth,
//     (prev, next) => prev.profile?.id === next.profile?.id && prev.token === next.token
//   );

//   const containerClasses = useMemo(
//     () =>
//       position === 'desktop'
//         ? 'absolute md:-left-15 right-0 top-8 w-60 md:w-80 bg-white shadow-lg rounded-lg p-2 z-50 text-black'
//         : 'fixed bottom-14 left-8 right-8 bg-gray-100 shadow-lg rounded-lg p-2 z-50 text-black max-h-[80vh] overflow-y-auto',
//     [position]
//   );

//   const imageSize = useMemo(() => (position === 'desktop' ? 'w-16 h-16' : 'w-12 h-12'), [position]);
//   const fallbackImage = '/images/fallback-image.jpg';

//   const displayedItems = useMemo(() => items.slice(0, 5), [items]);
//   const hasMoreItems = useMemo(() => items.length > 5, [items]);

//   const debouncedQuantityChange = useMemo(
//     () =>
//       debounce((cartId, productId, quantity) => {
//         if (quantity >= 1) {
//           if (profile?.id && token && cartId) {
//             dispatch(updateCartQuantityAsync({ id: cartId, quantity }));
//           } else {
//             dispatch({ type: 'cart/updateQuantity', payload: { productId, quantity } });
//             toast.success('Quantity updated!', {
//               duration: 2000,
//               style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//             });
//           }
//         }
//       }, 500),
//     [dispatch, profile, token]
//   );

//   useEffect(() => {
//     return () => {
//       debouncedQuantityChange.cancel(); // Cleanup debounce on unmount
//     };
//   }, [debouncedQuantityChange]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         isOpen &&
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         cartIconRef.current &&
//         !cartIconRef.current.contains(event.target)
//       ) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isOpen, onClose, cartIconRef]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearError()), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, dispatch]);

//   const handleRemove = useCallback(
//     (cartId, productId, productName, event) => {
//       event.stopPropagation();
//       if (profile?.id && token && cartId) {
//         dispatch(removeFromCartAsync({ id: cartId, productId, productName }));
//       } else {
//         dispatch({ type: 'cart/removeFromCart', payload: productId });
//         toast.success(`${productName} removed from cart!`, {
//           duration: 2000,
//           style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//         });
//       }
//     },
//     [dispatch, profile, token]
//   );

//   const handleQuantityChange = useCallback(
//     (cartId, productId, newQuantity, event) => {
//       event.stopPropagation();
//       const quantity = parseInt(newQuantity, 10);
//       if (isNaN(quantity)) return;
//       debouncedQuantityChange(cartId, productId, quantity);
//     },
//     [debouncedQuantityChange]
//   );

//   const handleItemClick = useCallback(
//     (event) => {
//       event.stopPropagation();
//       onClose();
//     },
//     [onClose]
//   );

//   const handleViewCartClick = useCallback(() => {
//     onClose();
//     navigate('/cart');
//   }, [onClose, navigate]);

//   if (!isOpen) return null;

//   return (
//     <div className={containerClasses} ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
//       <div className="flex justify-between items-center border-b border-gray-400">
//         <h3 className="text-lg font-semibold">Cart ({count})</h3>
//         <button
//           onClick={onClose}
//           className="p-1 hover:bg-gray-200 rounded-full"
//           aria-label="Close cart dropdown"
//         >
//           <FaTimes className="text-lg cursor-pointer text-gray-600" />
//         </button>
//       </div>

//       {error && (
//         <p className="text-red-500 text-center text-sm mt-2">
//           {error} <button onClick={() => dispatch(fetchCartItemsAsync())} className="underline">
//             Retry
//           </button>
//         </p>
//       )}

//       <div className={`mt-2 ${position === 'desktop' ? 'max-h-90' : ''} overflow-y-auto`}>
//         {items.length === 0 ? (
//           <p className="text-center text-gray-500">Your cart is empty</p>
//         ) : (
//           displayedItems.map((item) => (
//             <div
//               key={item.cartId}
//               className="group relative flex items-center justify-between p-2 border-b border-gray-200"
//             >
//               <Link
//                 to={`/product/${item.productId}`}
//                 className="absolute inset-0 z-10"
//                 onClick={handleItemClick}
//                 aria-label={`View ${item.name}`}
//               />
//               <div className="flex items-center w-full">
//                 <img
//                   src={item.imagea ? `${API_BASE_URL}/images/${item.imagea}` : fallbackImage}
//                   alt={item.name}
//                   className={`${imageSize} object-cover rounded`}
//                 />
//                 <div className="flex-1 px-2">
//                   <p className="text-sm font-semibold group-hover:text-blue-600 transition-colors">
//                     {item.name}
//                   </p>
//                   <div className="flex items-center space-x-2 text-xs text-gray-500">
//                     <span>Tk {item.price.toFixed(2)}</span>
//                     <span>x</span>
//                     <input
//                       type="number"
//                       min="1"
//                       value={item.quantity}
//                       onChange={(e) => handleQuantityChange(item.cartId, item.productId, e.target.value, e)}
//                       className="w-12 border border-gray-300 rounded-sm text-center z-20 relative focus:ring-2 focus:ring-green-200"
//                       aria-label={`Quantity for ${item.name}`}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={(event) => handleRemove(item.cartId, item.productId, item.name, event)}
//                 className="text-red-500 hover:text-red-700 z-20 relative"
//                 aria-label={`Remove ${item.name} from cart`}
//               >
//                 <Trash className="w-5 cursor-pointer h-5 ml-3" />
//               </button>
//             </div>
//           ))
//         )}
//         {hasMoreItems && (
//           <div className="text-center mt-2">
//             <button
//               onClick={handleViewCartClick}
//               className="text-blue-600 hover:underline text-sm"
//               aria-label={`View all ${items.length} cart items`}
//             >
//               View all {items.length} items
//             </button>
//           </div>
//         )}
//       </div>

//       {items.length > 0 && (
//         <div className="p-2">
//           <button
//             onClick={handleViewCartClick}
//             className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-center"
//             aria-label="View cart"
//           >
//             View Cart
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartDropdown;

//--------------------------------------------------------------------------------------

// import { useRef, useEffect, useCallback, useMemo } from 'react';
// import { Trash } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaTimes } from 'react-icons/fa';
// import debounce from 'lodash.debounce';
// import toast from 'react-hot-toast';
// import {
//   fetchCartItemsAsync,
//   removeFromCartAsync,
//   updateCartQuantityAsync,
//   clearError,
//   selectCartItems,
//   selectCartCount,
//   selectCartError,
// } from '../../../store/cartSlice';
// import { API_BASE_URL } from '../../../store/api';

// export const CartDropdown = ({ isOpen, onClose, position = 'desktop', cartIconRef }) => {
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const items = useSelector(selectCartItems);
//   const count = useSelector(selectCartCount);
//   const error = useSelector(selectCartError);
//   const pendingRemovals = useSelector((state) => state.cart.pendingRemovals);
//   const { profile, token } = useSelector(
//     (state) => state.auth,
//     (prev, next) => prev.profile?.id === next.profile?.id && prev.token === next.token
//   );

//   const containerClasses = useMemo(
//     () =>
//       position === 'desktop'
//         ? 'absolute md:-left-15 right-0 top-8 w-60 md:w-80 bg-white shadow-lg rounded-lg p-2 z-50 text-black'
//         : 'fixed bottom-14 left-8 right-8 bg-gray-100 shadow-lg rounded-lg p-2 z-50 text-black max-h-[80vh] overflow-y-auto',
//     [position]
//   );

//   const imageSize = useMemo(() => (position === 'desktop' ? 'w-16 h-16' : 'w-12 h-12'), [position]);
//   const fallbackImage = '/images/fallback-image.jpg';

//   const displayedItems = useMemo(() => items.slice(0, 5), [items]);
//   const hasMoreItems = useMemo(() => items.length > 5, [items]);

//   const debouncedQuantityChange = useMemo(
//     () =>
//       debounce((cartId, productId, quantity) => {
//         if (quantity >= 1) {
//           if (profile?.id && token && cartId) {
//             dispatch(updateCartQuantityAsync({ id: cartId, quantity }));
//           } else {
//             dispatch({ type: 'cart/updateQuantity', payload: { productId, quantity } });
//             toast.success('Quantity updated!', {
//               duration: 2000,
//               style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//             });
//           }
//         }
//       }, 500),
//     [dispatch, profile, token]
//   );

//   useEffect(() => {
//     return () => {
//       debouncedQuantityChange.cancel(); // Cleanup debounce on unmount
//     };
//   }, [debouncedQuantityChange]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         isOpen &&
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         cartIconRef.current &&
//         !cartIconRef.current.contains(event.target)
//       ) {
//         onClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isOpen, onClose, cartIconRef]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearError()), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, dispatch]);

//   const handleRemove = useCallback(
//     (cartId, productId, productName, event) => {
//       event.stopPropagation();
//       if (profile?.id && token && cartId) {
//         dispatch(removeFromCartAsync({ id: cartId, productId, productName }));
//       } else {
//         dispatch({ type: 'cart/removeFromCart', payload: productId });
//         toast.success(`${productName} removed from cart!`, {
//           duration: 2000,
//           style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//         });
//       }
//     },
//     [dispatch, profile, token]
//   );

//   const handleQuantityChange = useCallback(
//     (cartId, productId, newQuantity, event) => {
//       event.stopPropagation();
//       const quantity = parseInt(newQuantity, 10);
//       if (isNaN(quantity)) return;
//       debouncedQuantityChange(cartId, productId, quantity);
//     },
//     [debouncedQuantityChange]
//   );

//   const handleItemClick = useCallback(
//     (event) => {
//       event.stopPropagation();
//       onClose();
//     },
//     [onClose]
//   );

//   const handleViewCartClick = useCallback(() => {
//     onClose();
//     navigate('/cart');
//   }, [onClose, navigate]);

//   const isItemRemoving = useCallback(
//     (cartId, productId) => pendingRemovals.includes(cartId || productId),
//     [pendingRemovals]
//   );

//   if (!isOpen) return null;

//   return (
//     <div className={containerClasses} ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
//       <div className="flex justify-between items-center border-b border-gray-400">
//         <h3 className="text-lg font-semibold">Cart ({count})</h3>
//         <button
//           onClick={onClose}
//           className="p-1 hover:bg-gray-200 rounded-full"
//           aria-label="Close cart dropdown"
//         >
//           <FaTimes className="text-lg cursor-pointer text-gray-600" />
//         </button>
//       </div>

//       {error && (
//         <p className="text-red-500 text-center text-sm mt-2">
//           {error}{' '}
//           <button onClick={() => dispatch(fetchCartItemsAsync())} className="underline">
//             Retry
//           </button>
//         </p>
//       )}

//       <div className={`mt-2 ${position === 'desktop' ? 'max-h-90' : ''} overflow-y-auto`}>
//         {items.length === 0 ? (
//           <p className="text-center text-gray-500">Your cart is empty</p>
//         ) : (
//           displayedItems.map((item) => (
//             <div
//               key={item.cartId || item.productId}
//               className="group relative flex items-center justify-between p-2 border-b border-gray-200"
//             >
//               <Link
//                 to={`/product/${item.productId}`}
//                 className="absolute inset-0 z-10"
//                 onClick={handleItemClick}
//                 aria-label={`View ${item.name}`}
//               />
//               <div className="flex items-center w-full">
//                 <img
//                   src={item.imagea ? `${API_BASE_URL}/images/${item.imagea}` : fallbackImage}
//                   alt={item.name}
//                   className={`${imageSize} object-cover rounded`}
//                 />
//                 <div className="flex-1 px-2">
//                   <p className="text-sm font-semibold group-hover:text-blue-600 transition-colors">
//                     {item.name}
//                   </p>
//                   <div className="flex items-center space-x-2 text-xs text-gray-500">
//                     <span>Tk {item.price.toFixed(2)}</span>
//                     <span>x</span>
//                     <input
//                       type="number"
//                       min="1"
//                       value={item.quantity}
//                       onChange={(e) => handleQuantityChange(item.cartId, item.productId, e.target.value, e)}
//                       className="w-12 border border-gray-300 rounded-sm text-center z-20 relative focus:ring-2 focus:ring-green-200"
//                       aria-label={`Quantity for ${item.name}`}
//                       disabled={isItemRemoving(item.cartId, item.productId)}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={(event) => handleRemove(item.cartId, item.productId, item.name, event)}
//                 className="text-red-500 hover:text-red-700 z-20 relative"
//                 aria-label={`Remove ${item.name} from cart`}
//                 disabled={isItemRemoving(item.cartId, item.productId)}
//               >
//                 {isItemRemoving(item.cartId, item.productId) ? (
//                   <span className="animate-spin w-5 h-5">⏳</span>
//                 ) : (
//                   <Trash className="w-5 cursor-pointer h-5 ml-3" />
//                 )}
//               </button>
//             </div>
//           ))
//         )}
//         {hasMoreItems && (
//           <div className="text-center mt-2">
//             <button
//               onClick={handleViewCartClick}
//               className="text-blue-600 hover:underline text-sm"
//               aria-label={`View all ${items.length} cart items`}
//             >
//               View all {items.length} items
//             </button>
//           </div>
//         )}
//       </div>

//       {items.length > 0 && (
//         <div className="p-2">
//           <button
//             onClick={handleViewCartClick}
//             className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-center"
//             aria-label="View cart"
//           >
//             View Cart
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartDropdown;

//----------------------------------------------------------

import { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchCartItemsAsync,
  removeFromCartAsync,
  updateCartQuantityAsync,
  initializeCart,
  selectCartItems,
  selectCartCount,
  selectCartStatus,
  selectCartError,
} from '../../../store/cartSlice';
import { API_BASE_URL } from '../../../store/api';

const CartDropdown = ({ isOpen, onClose, position = "desktop" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const status = useSelector(selectCartStatus);
  const error = useSelector(selectCartError);
  const { profile, token } = useSelector((state) => state.auth);

  // Initialize cart when component mounts or auth state changes
  useEffect(() => {
    if (profile?.id && profile?.email && token) {
      // For authenticated users, fetch from server
      dispatch(fetchCartItemsAsync());
    } else {
      // For guest users, initialize from localStorage
      dispatch(initializeCart({ auth: { profile } }));
    }
  }, [dispatch, profile?.id, profile?.email, token]);

  // Auto-refresh cart data when dropdown opens
  useEffect(() => {
    if (isOpen && profile?.id && token) {
      dispatch(fetchCartItemsAsync());
    }
  }, [isOpen, dispatch, profile?.id, token]);

  const handleRemove = useCallback(
    (cartId, productId, productName) => {
      if (profile?.id && token && cartId) {
        dispatch(removeFromCartAsync({ id: cartId, productId, productName }));
      } else {
        dispatch({ type: 'cart/removeFromCart', payload: productId });
        toast.success(`${productName} removed from cart!`, {
          duration: 2000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      }
    },
    [dispatch, profile?.id, token]
  );

  const handleQuantityChange = useCallback(
    (cartId, productId, newQuantity) => {
      const quantity = parseInt(newQuantity, 10);
      if (isNaN(quantity) || quantity < 1) return;

      if (profile?.id && token && cartId) {
        dispatch(updateCartQuantityAsync({ id: cartId, quantity }));
      } else {
        dispatch({ type: 'cart/updateQuantity', payload: { productId, quantity } });
        toast.success('Quantity updated!', {
          duration: 2000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      }
    },
    [dispatch, profile?.id, token]
  );

  const calculateTotal = useMemo(
    () => items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0).toFixed(2),
    [items]
  );

  const handleViewCart = useCallback(() => {
    navigate('/cart');
    onClose();
  }, [navigate, onClose]);

  const handleProceedToCheckout = useCallback(() => {
    if (!profile?.id || !profile?.email || !token) {
      toast.error('Please log in to proceed to checkout.', {
        duration: 2000,
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
      navigate('/login', { state: { from: '/cart' } });
      onClose();
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty.', {
        duration: 2000,
        style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
      });
      return;
    }

    navigate('/cart-checkout', { state: { cartItems: items, cartTotal: calculateTotal } });
    onClose();
  }, [profile, token, items, calculateTotal, navigate, onClose]);

  if (!isOpen) return null;

  const dropdownClasses = position === "mobile" 
    ? "absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
    : "absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50";

  return (
    <div className={dropdownClasses}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Shopping Cart ({count})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {status === 'loading' && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-500 text-sm mt-2">Loading cart...</p>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center text-sm mb-4 p-2 bg-red-50 rounded">
            {error}
            <button 
              onClick={() => dispatch(fetchCartItemsAsync())} 
              className="underline ml-2 hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {items.length === 0 && status !== 'loading' ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg mb-2">Your cart is empty</p>
            <p className="text-sm">Start adding some items!</p>
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartId || item.productId}
                  className="flex items-center space-x-3 p-2 border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={
                      item.imagea 
                        ? `${API_BASE_URL}/images/${item.imagea}` 
                        : '/images/fallback-image.jpg'
                    }
                    alt={item.name || 'Product'}
                    className="w-12 h-12 object-cover rounded"
           
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 truncate">
                      {item.name || 'Unknown Product'}
                    </h4>
                    <p className="text-xs text-gray-600">
                      Tk {(item.price || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) => handleQuantityChange(
                          item.cartId, 
                          item.productId, 
                          e.target.value
                        )}
                        className="w-12 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-red-500"
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      Tk {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(
                        item.cartId, 
                        item.productId, 
                        item.name || 'Product'
                      )}
                      className="text-red-500 hover:text-red-700 mt-1"
                      aria-label={`Remove ${item.name} from cart`}
                      disabled={status === 'loading'}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-lg font-bold text-red-600">
                  Tk {calculateTotal}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleViewCart}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                >
                  View Cart
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                  disabled={status === 'loading' || items.length === 0}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default CartDropdown
