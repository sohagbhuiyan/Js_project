import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaLaptop,
  FaDesktop,
  FaTv,
  FaCamera,
  FaPrint,
  FaVideo,
  FaSpeakerDeck,
  FaTag,
  FaStore,
  FaCode,
  FaFileAlt,
  FaFolder,
  FaHeadphones,
  FaMouse,
  FaKeyboard,
  FaNetworkWired,
  FaTools,
  FaBatteryFull,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { fetchCategoriesAndProducts } from "../../../store/categorySlice";
import { Tv, TvIcon } from "lucide-react";
import { Call, CallOutlined, Scanner, ScannerOutlined } from "@mui/icons-material";

// Mapping of category name keywords to icons (case-insensitive)
const iconMapping = {
  notebook: <FaLaptop size={24} />,
  laptop: <FaLaptop size={24} />,
  desktop: <FaDesktop size={24} />,
  projector: <FaVideo size={24} />,
  monitor: <FaTv size={24} />,
  camera: <FaCamera size={24} />,
  photocopier: <FaPrint size={24} />,
  printer: <FaPrint size={24} />,
  soundsystem: <FaSpeakerDeck size={24} />,
  sound: <FaSpeakerDeck size={24} />,
  store: <FaStore size={24} />,
  shop: <FaStore size={24} />,
  software: <FaCode size={24} />,
  application: <FaCode size={24} />,
  papers: <FaFileAlt size={24} />,
  document: <FaFileAlt size={24} />,
  files: <FaFolder size={24} />,
  folder: <FaFolder size={24} />,
  accessories: <FaHeadphones size={24} />,
  headphone: <FaHeadphones size={24} />,
  mouse: <FaMouse size={24} />,
  keyboard: <FaKeyboard size={24} />,
  network: <FaNetworkWired size={24} />,
  router: <FaNetworkWired size={24} />,
  tools: <FaTools size={24} />,
  battery: <FaBatteryFull size={24} />,
  power: <FaBatteryFull size={24} />,
  Tv:<TvIcon size={24} />,
  Scanner:<ScannerOutlined size={24} />,
  Call: <CallOutlined size={24} />
};

// Function to get icon based on category name
const getCategoryIcon = (categoryName) => {
  const nameLower = categoryName.toLowerCase();
  for (const [keyword, icon] of Object.entries(iconMapping)) {
    if (nameLower.includes(keyword)) {
      return icon;
    }
  }
  return <FaTag size={24} />; // Default icon
};

const AllCategories = () => {
  const dispatch = useDispatch();
  const { categoriesWithSub, loading, error } = useSelector((state) => state.categories);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedProducts, setExpandedProducts] = useState({});

  useEffect(() => {
    dispatch(fetchCategoriesAndProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching categories, products, and items:", error);
    }
  }, [error]);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Toggle product expansion
  const toggleProduct = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
        All Categories
      </h1>

      {error && (
        <div className="text-center text-red-600 font-semibold mb-6">
          Failed to load categories, products, or items. Please try again later.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 animate-pulse"
            >
              <div className="w-3/4 h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-full h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithSub.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 font-medium">
              No categories available.
            </div>
          ) : (
            categoriesWithSub.map((category, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="flex items-center justify-between gap-2 text-xl font-semibold text-blue-800 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <Link
                    to={category.path}
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()} // Prevent toggle when clicking link
                  >
                    <span className="text-blue-600">{getCategoryIcon(category.name)}</span>
                    {category.name}
                  </Link>
                  {category.products.length > 0 && (
                    <span>
                      {expandedCategories[category.id] ? (
                        <FaChevronUp size={16} />
                      ) : (
                        <FaChevronDown size={16} />
                      )}
                    </span>
                  )}
                </div>
                {expandedCategories[category.id] && (
                  <div className="mt-4 space-y-2">
                    {category.products.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No products available in this category.
                      </p>
                    ) : (
                      category.products.map((product, prodIndex) => (
                        <div key={prodIndex} className="ml-4">
                          <div
                            className="flex items-center justify-between text-md font-medium text-gray-800 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors duration-200 cursor-pointer"
                            onClick={() => toggleProduct(product.id)}
                          >
                            <Link
                              to={product.path}
                              className="block"
                              onClick={(e) => e.stopPropagation()} // Prevent toggle when clicking link
                            >
                              {product.name}
                            </Link>
                            {product.items.length > 0 && (
                              <span>
                                {expandedProducts[product.id] ? (
                                  <FaChevronUp size={14} />
                                ) : (
                                  <FaChevronDown size={14} />
                                )}
                              </span>
                            )}
                          </div>
                          {expandedProducts[product.id] && (
                            <div className="ml-4 mt-2 space-y-1">
                              {product.items.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">
                                  No items available for this product.
                                </p>
                              ) : (
                                product.items.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    to={item.path}
                                    className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors duration-200"
                                  >
                                    {item.name}
                                  </Link>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllCategories;