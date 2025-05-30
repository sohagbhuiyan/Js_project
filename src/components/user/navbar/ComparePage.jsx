// src/pages/ComparePage.jsx
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { removeFromCompare } from "../../../store/compareSlice";
import toast from "react-hot-toast";

const ComparePage = () => {
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compare.items);

  const handleRemove = (productId) => {
    dispatch(removeFromCompare(productId));
    toast.success("Product removed from comparison", { position: "bottom-right" });
  };

  if (compareItems.length < 2) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Comparison requires at least 2 products</h2>
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-md hover:bg-blue-700 transition-colors text-sm md:text-base"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6 px-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Product Comparison</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Comparing {compareItems.length} products
        </p>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-w-[300px] sm:min-w-0">
          {compareItems.map((product) => (
            <div key={product.id} className="w-[280px] sm:w-auto border rounded-lg p-3 sm:p-4 bg-white shadow-sm flex-shrink-0 sm:flex-shrink">
              <div className="relative">
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-0 right-0 text-red-600 hover:text-red-800 p-1"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <img
                  src={product.imagea}
                  alt={product.name}
                  className="w-full h-32 sm:h-48 object-contain mb-2 sm:mb-4"
                />
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{product.name}</h3>
                <p className="text-lg sm:text-xl font-bold text-blue-600 mb-2 sm:mb-4">Tk {product.specialprice}</p>
                
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-right">{product.category}</span>
                  </div>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 pr-2">{key}:</span>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-center px-2">
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 sm:py-3 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Back to Shopping
        </Link>
      </div>
    </div>
  );
};

export default ComparePage;
