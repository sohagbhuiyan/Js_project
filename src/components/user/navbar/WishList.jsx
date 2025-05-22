// components/navigation/WishlistDropdown.jsx
import { FaHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../../store/wishlistSlice";
import { addToCart } from "../../../store/cartSlice";
import { Link } from "react-router-dom";

const Wishlist = ({ isOpen, isMobile, onClose }) => {  // Added onClose prop
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!cartItems.some(item => item.id === product.id)) {
      dispatch(addToCart({ ...product, quantity: 1 }));
    }
  };

  const handleRemove = (id, e) => {
    e.stopPropagation();
    dispatch(removeFromWishlist(id));
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${
        isMobile
          ? "fixed bottom-14 left-6 right-6 text-black bg-gray-200 p-3 rounded-lg shadow-lg z-60 max-h-64 overflow-y-auto"
          : "absolute top-8 right-0 text-black bg-gray-100 p-3 rounded-lg shadow-lg w-84 z-60 max-h-96 overflow-y-auto"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center border-b border-gray-400 mb-2">
        <h3 className="text-lg font-bold flex items-center">
          <FaHeart className="text-red-500 mr-2" />
          Wishlist ({wishlistItems.length})
        </h3>
        <button 
          onClick={onClose}  // Added close handler
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <FaTimes className="text-lg cursor-pointer text-gray-600" />
        </button>
      </div>
      {wishlistItems.length === 0 ? (
        <p className="text-center py-4">Your wishlist is empty</p>
      ) : (
        wishlistItems.map((product) => (
          <div key={product.id} className="flex items-center py-2 border-b border-gray-300">
            <Link to={`/product/${product.name}`} className="flex-1 flex items-center hover:bg-gray-50 p-1 rounded">
              <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md mr-1.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{product.name}</h4>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
            </Link>
            <div className="flex items-center ml-1 space-x-2">
              <button
                onClick={(e) => handleRemove(product.name, e)}
                className="p-1 rounded-md text-red-600 hover:bg-red-100"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>
        ))
      )}
      {wishlistItems.length > 0 && (
        <div className="mt-4 text-center">
          <Link to="/wishlist" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            View Full Wishlist →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
