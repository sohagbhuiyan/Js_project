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

  // Extract all unique specification keys from all products
  const allSpecKeys = Array.from(
    new Set(compareItems.flatMap((item) => Object.keys(item.specifications || {})))
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Product Comparison</h1>
        <p className="text-gray-600 mt-1">({compareItems.length} Products selected)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold border border-gray-300">Field</th>
              {compareItems.map((item) => (
                <th key={item.id} className="p-3 font-semibold border border-gray-300 relative">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                  <div className="flex flex-col items-center">
                    <img src={item.imagea} alt={item.name} className="h-24 object-contain mb-2" />
                    <span className="font-medium text-center">{item.name}</span>
                    <span className="text-blue-600 font-bold mt-1">Tk {item.specialprice}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Common fields */}
            <tr>
              <td className="p-3 border font-medium">Brand</td>
              {compareItems.map((item) => (
                <td key={item.id + "-brand"} className="p-3 border">{item.brand?.brandname || "—"}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border font-medium">Model</td>
              {compareItems.map((item) => (
                <td key={item.id + "-model"} className="p-3 border text-green-600 font-semibold">{item.model || "—"}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border font-medium">Category</td>
              {compareItems.map((item) => (
                <td key={item.id + "-category"} className="p-3 border">{item.category || "—"}</td>
              ))}
            </tr>

            {/* Dynamic specification rows */}
            {allSpecKeys.map((key) => (
              <tr key={key}>
                <td className="p-3 border font-medium">{key}</td>
                {compareItems.map((item) => (
                  <td key={item.id + key} className="p-3 border">{item.specifications?.[key] || "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Shopping
        </Link>
      </div>
    </div>
  );
};

export default ComparePage;
