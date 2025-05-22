import { Link } from "react-router-dom";
import { FaExchangeAlt, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearCompare, removeFromCompare } from "../../../store/compareSlice";
import toast from "react-hot-toast";

const CompareDropdown = ({ isOpen, isMobile, onClose }) => {
  const dispatch = useDispatch();
  const { items, maxItems } = useSelector((state) => state.compare);

  const handleRemove = (productId) => {
    dispatch(removeFromCompare(productId));
    toast.success("Product removed from comparison", { position: "bottom-right" });
  };

  if (!isOpen) return null;
  return (
    <div
      className={`${
        isMobile
          ? "fixed bottom-14 left-6 right-6 bg-gray-100 text-black p-2 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          : "absolute top-7 -right-5 bg-gray-100 text-black  p-2 rounded-lg shadow-lg w-82 z-50 max-h-96 overflow-y-auto"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center border-b border-gray-400 mb-2">
        <h3 className="text-lg font-bold flex items-center">
     
        Compare ({items.length}/{maxItems})
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <FaTimes className="text-lg text-gray-600" />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center py-4">No items added for comparison</p>
      ) : (
        <>
          {items.map((product) => (
            <div key={product.id} className="flex items-center py-2 border-b last:border-b-0">
              <Link
                to={`/product/${product.name}`}
                className="flex-1 flex items-center hover:bg-gray-50 p-2 rounded"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-md mr-3"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <p className="text-sm text-gray-600">${product.price}</p>
                </div>
              </Link>
              <div className="flex items-center ml-2 space-x-2">
                <button
                  onClick={() => dispatch(removeFromCompare(product.id))}
                  className="p-1 rounded-md text-red-600 hover:bg-red-100"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>
          ))}
<div className="mt-4 p-2">
            <Link
              to="/compare"
              onClick={onClose}
              className={`w-full block text-center px-4 py-2 ${
                items.length >= 2 
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } rounded-md transition-colors`}
            >
              {items.length >= 2 ? "Compare Now" : "Add 2+ products to compare"}
            </Link>
          </div>
          <div className="text-center pb-2">
            <button
              onClick={() => dispatch(clearCompare())}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CompareDropdown;
