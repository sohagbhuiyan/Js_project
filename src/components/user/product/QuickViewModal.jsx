// components/user/product/QuickViewModal.jsx
import { useEffect, useRef } from "react";
import { FaTimes, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../../../store/cartSlice";
import { addToWishlist } from "../../../store/wishlistSlice";
import toast from "react-hot-toast";

const QuickViewModal = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const modalRef = useRef(null);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 })
      .format(amount)
      .replace(/(\d+)/, "Tk $1");

  const discount = product.regularprice - product.specialprice;
  const hasDiscount = product.specialprice > 0 && discount > 0;
  const currentPrice = hasDiscount ? product.specialprice : product.regularprice;

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = "hidden";
      modalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCartAsync({
        productDetailsId: product.id,
        quantity: 1,
        name: product.name,
        price: currentPrice,
        imagea: product.imagea,
      })
    )
      .then(() => {
        toast.success("Added to cart!", { position: "top-right" });
      })
      .catch(() => {});
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authState.user) {
      toast.warn("Please log in to add to wishlist!", { position: "top-right" });
      return;
    }
    dispatch(
      addToWishlist({
        id: product.id,
        imagea: product.imagea,
        category: product.category,
        name: product.name,
        regularprice: product.regularprice,
        specialprice: product.specialprice,
      })
    );
    toast.success("Added to wishlist!", { position: "top-right" });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto transition-opacity duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-2xl max-w-4xl w-full my-8 max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100"
      >
        <div className="relative p-6 md:p-8">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={onClose}
            aria-label="Close quick view"
          >
            <FaTimes className="text-xl" />
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <img
                src={product.imagea}
                alt={product.name}
                className="w-full max-w-sm h-80 object-contain rounded-lg"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h2>
                {product.brandname && (
                  <p className="text-lg font-semibold text-gray-600 mt-1">{product.brandname}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm line-through text-gray-400">
                      {formatPrice(product.regularprice)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <span className="text-sm text-green-600 font-medium">
                    Save {formatPrice(discount)}
                  </span>
                )}
                <p className="text-sm text-gray-500">{product.category}</p>
                {product.ram && <p className="text-sm text-gray-500">{product.ram}</p>}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Add to Wishlist"
                >
                  <FaHeart className="text-lg text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
