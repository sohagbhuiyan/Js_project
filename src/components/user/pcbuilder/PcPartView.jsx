import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { fetchPCPartsById, clearPCBError } from "../../../store/pcbuilderSlice";
import { addToCartAsync } from "../../../store/cartSlice";
import { addToWishlist } from "../../../store/wishlistSlice";
import { addToCompare } from "../../../store/compareSlice";
import { FaShoppingCart, FaHeart, FaExchangeAlt } from "react-icons/fa";
import { API_BASE_URL } from "../../../store/api";
import ProductDetails from "../product/ProductDetails";

const FALLBACK_IMAGE = "/images/placeholder.png";

const PcPartView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPart, loading, error } = useSelector((state) => state.pcBuilder);
  const { user, profile, token, status: authStatus } = useSelector((state) => state.auth);
  const cartStatus = useSelector((state) => state.cart.status);
  const cartError = useSelector((state) => state.cart.error);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(FALLBACK_IMAGE);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  useEffect(() => {
    if (id) {
      dispatch(fetchPCPartsById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPart?.imagea) {
      setMainImage(`${API_BASE_URL}/images/${currentPart.imagea}`);
    } else {
      setMainImage(FALLBACK_IMAGE);
    }
  }, [currentPart]);

  useEffect(() => {
    if (cartStatus === "failed" && cartError) {
      toast.error(cartError, { position: "top-right" });
    }
  }, [cartStatus, cartError]);

  const increaseQuantity = () => setQuantity((prev) => (prev < currentPart?.quantity ? prev + 1 : prev));
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
      navigate("/login", { state: { from: `/pc-builder/pc-part/${id}` } });
      return;
    }
    // Format part data to match CheckoutPage's expected product structure
    const product = {
      id: currentPart.id,
      productid: currentPart.id.toString(), // Use id as productid
      name: currentPart.name,
      quantity: quantity, // Use user-selected quantity
      regularprice: currentPart.regularprice,
      specialprice: currentPart.specialprice,
      imagea: currentPart.imagea,
      description: currentPart.description || "No description available",
      performance: currentPart.performance || "N/A",
      ability: currentPart.ability || "N/A",
      pcbuilder: currentPart.pcbuilder, // Category equivalent
    };
    navigate("/checkout", {
      state: {
        products: [product],
        orderType: "pcpart", // Indicate PC part order
      },
    });
  };

  const handleAddToCart = () => {
    if (!user?.id || !profile?.email || !token) {
      toast.error("Please log in to add to cart.", { position: "top-right", duration: 1000 });
      navigate("/login", { state: { from: `/pc-builder/pc-part/${id}` } });
      return;
    }
    dispatch(
      addToCartAsync({
        productDetailsId: id,
        quantity,
        name: currentPart.name,
        price: currentPart.specialprice > 0 ? currentPart.specialprice : currentPart.regularprice,
        imagea: mainImage,
      })
    )
      .then(() => {
        toast.success("Added to cart!", { position: "top-right" });
      })
      .catch(() => {
        // Error handled in useEffect
      });
  };

  const handleAddToWishlist = () => {
    if (!user?.id || !profile?.email || !token) {
      toast.error("Please log in to add to wishlist.", { position: "top-right", duration: 1000 });
      navigate("/login", { state: { from: `/pc-builder/pc-part/${id}` } });
      return;
    }
    dispatch(
      addToWishlist({
        id,
        imagea: mainImage,
        name: currentPart.name,
        regularprice: currentPart.regularprice,
        specialprice: currentPart.specialprice,
        description: currentPart.description,
      })
    );
    toast.success("Added to wishlist!", { position: "top-right" });
  };

  const handleAddToCompare = () => {
    dispatch(
      addToCompare({
        id,
        name: currentPart.name,
        regularprice: currentPart.regularprice,
        specialprice: currentPart.specialprice,
        imagea: mainImage,
        description: currentPart.description,
        specifications: {
          performance: currentPart.performance,
          ability: currentPart.ability,
          quantity: currentPart.quantity,
        },
      })
    );
    toast.success("Added to compare!", { position: "top-right" });
  };

  const handleRetry = () => {
    dispatch(clearPCBError());
    dispatch(fetchPCPartsById(id));
  };

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 })
      .format(amount)
      .replace(/(\d+)/, "Tk $1");

  if (loading.part || authStatus === "loading") {
    return (
      <div className="flex justify-center items-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error.part) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error.part}</div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!currentPart) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-700">Part Not Found</p>
      </div>
    );
  }

  const discount = currentPart.regularprice - currentPart.specialprice;
  const hasDiscount = currentPart.specialprice > 0 && discount > 0;
  const currentPrice = hasDiscount ? currentPart.specialprice : currentPart.regularprice;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Part Image */}
        <div className="flex-1 flex justify-center">
          <div
            className="relative w-full max-w-[400px] h-[200px] sm:h-[300px] md:h-[400px] border border-gray-400 rounded-lg overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={mainImage}
              alt={currentPart.name}
              className="w-full h-full object-contain"
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            />
            <div
              className="absolute inset-0 cursor-zoom-in"
              style={zoomStyle}
            />
          </div>
        </div>

        {/* Part Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{currentPart.name}</h1>
          <p className="text-sm text-gray-600">Part ID: {currentPart.id}</p>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(currentPrice)}
              {hasDiscount && (
                <span className="ml-3 text-sm line-through text-gray-400">
                  {formatPrice(currentPart.regularprice)}
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
            <p className="text-sm text-gray-600">{currentPart.description || "No description available."}</p>
            {currentPart.performance && (
              <p className="text-sm text-gray-600">
                <strong>Performance:</strong> {currentPart.performance}
              </p>
            )}
            {currentPart.ability && (
              <p className="text-sm text-gray-600">
                <strong>Ability:</strong> {currentPart.ability}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Stock:</strong> {currentPart.quantity > 0 ? `${currentPart.quantity} available` : "Out of Stock"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || loading.part || currentPart.quantity === 0}
            >
              -
            </button>
            <span className="text-sm font-medium">{quantity}</span>
            <button
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
              onClick={increaseQuantity}
              disabled={quantity >= currentPart.quantity || loading.part || currentPart.quantity === 0}
            >
              +
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              onClick={handlePlaceOrderClick}
              disabled={loading.part || currentPart.quantity === 0}
            >
              Proceed to Checkout
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex cursor-pointer items-center gap-2 bg-white text-sm text-gray-600 border border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              onClick={handleAddToCart}
              disabled={loading.part || currentPart.quantity === 0}
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              className="flex cursor-pointer items-center gap-2 bg-white text-sm text-gray-600 border border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              onClick={handleAddToWishlist}
            >
              <FaHeart /> Add to Wishlist
            </button>
            <button
              className="flex cursor-pointer items-center gap-2 bg-white text-sm text-gray-600 border border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              onClick={handleAddToCompare}
            >
              <FaExchangeAlt /> Add to Compare
            </button>
          </div>
        </div>
      </div>
      <ProductDetails />
      <Toaster />
    </>
  );
};

export default PcPartView;