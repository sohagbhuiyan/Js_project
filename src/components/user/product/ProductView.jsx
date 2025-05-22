
// src/components/ProductView.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { fetchProductById } from "../../../store/productSlice";
import { API_BASE_URL } from "../../../store/api";

const ProductView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const { user, profile, token } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct?.imagea) {
      setMainImage(`${API_BASE_URL}/images/${currentProduct.imagea}`);
    }
  }, [currentProduct]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

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
      toast.error("Please log in to place an order.", { duration: 1000 });
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    // Navigate to checkout page with product and quantity
    navigate("/checkout", { state: { product: currentProduct, quantity } });
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  if (!currentProduct) return <h2 className="text-center text-xl mt-6">Product Not Found</h2>;

  const galleryImages = [
    currentProduct.imagea ? `${API_BASE_URL}/images/${currentProduct.imagea}` : null,
    currentProduct.imageb ? `${API_BASE_URL}/images/${currentProduct.imageb}` : null,
    currentProduct.imagec ? `${API_BASE_URL}/images/${currentProduct.imagec}` : null,
  ].filter(Boolean);

  return (
    <div className="p-8 flex flex-col md:flex-row-reverse gap-10">
      {/* Product Details */}
      <div className="flex-col px-6 md:px-10 md:flex-1">
        <h2 className="text-md md:text-2xl font-bold">{currentProduct.name}</h2>
        <p className="text-xs md:text-sm text-gray-600">Product ID: {currentProduct.productid}</p>
        <p className="md:text-lg text-sm font-bold text-red-700 mt-2">
          Special Price: Tk {currentProduct.specialprice}
        </p>
        <p className="text-sm md:text-md font-bold text-gray-600 mt-2">
          Regular Price: Tk {currentProduct.regularprice}
        </p>
        {currentProduct.specialprice < currentProduct.regularprice && (
          <p className="text-purple-600 text-xs md:text-sm">
            Save Tk {currentProduct.regularprice - currentProduct.specialprice} on online order
          </p>
        )}
        <h3 className="mt-4 font-semibold text-md md:text-lg">Quick Overview</h3>
        <ul className="list-disc pl-6 text-xs md:text-sm text-gray-600">
          {currentProduct.details &&
            currentProduct.details.split(", ").map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            className="bg-gray-300 text-xs md:text-sm px-3 py-1 rounded"
            onClick={decreaseQuantity}
            disabled={loading}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            className="bg-gray-300 text-xs md:text-sm px-3 py-1 rounded"
            onClick={increaseQuantity}
            disabled={loading}
          >
            +
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 cursor-pointer text-xs md:text-md font-medium text-white px-3 py-2 rounded"
            onClick={handlePlaceOrderClick}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="flex flex-col-reverse items-center sm:px-6 md:flex-row gap-4 sm:gap-8">
        <div className="flex flex-row md:flex-col gap-2 sm:gap-3 px-2 md:px-4 mt-4 md:mt-0">
          {galleryImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumbnail-${index}`}
              className="w-12 h-12 sm:w-16 sm:h-16 border border-gray-500 cursor-pointer object-cover"
              onMouseEnter={() => setMainImage(img)}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
        <div
          className="relative w-40 h-40 sm:w-96 sm:h-96 border border-gray-400 overflow-hidden flex-1"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={mainImage}
            alt={currentProduct.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.jpg";
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full cursor-zoom-in" style={zoomStyle} />
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default ProductView;
