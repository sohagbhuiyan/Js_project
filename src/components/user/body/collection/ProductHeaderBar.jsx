import { FaTh, FaList } from "react-icons/fa";

const ProductHeaderBar = ({ title, productCount, sortOption, onSortChange, viewType, onViewChange }) => {
  return (
    <div className="flex items-center justify-between flex-wrap border-b py-3 px-4 bg-white shadow-sm">
      {/* Title and Product Count */}
      <div className="text-lg font-semibold text-gray-800 mr-1">
        {title} 
        <span className="text-sm text-gray-500 font-normal ml-1 px-1">
           ({productCount} {productCount === 1 ? "Product" : "Products"} found)
        </span>
      </div>

      {/* Sort & View Controls */}
      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        {/* Sort By */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort By:</span>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm focus:outline-none"
          >
            <option value="customized">Customized</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">View:</span>
          <button
            className={`p-1 cursor-pointer ${viewType === "grid" ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
          >
            <FaTh size={18} />
          </button>
          <button
            className={`p-1 cursor-pointer ${viewType === "list" ? "text-blue-600" : "text-gray-500"}`}
            onClick={() => onViewChange("list")}
            aria-label="List view"
          >
            <FaList size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeaderBar;
