import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
} from "react-icons/fa";
import { fetchCategoriesAndProducts } from "../../../store/categorySlice";
import { FileBarChart, Gamepad2Icon, Printer, Tv, TvIcon } from "lucide-react";
import { Call, CallOutlined, Scanner, ScannerOutlined } from "@mui/icons-material";

// Mapping of category name keywords to icons (case-insensitive)
const iconMapping = {
  notebook: <FaLaptop size={30} />,
  laptop: <FaLaptop size={30} />,
  desktop: <FaDesktop size={30} />,
  projector: <FaVideo size={30} />,
  monitor: <FaTv size={30} />,
  camera: <FaCamera size={30} />,
  photocopier: <FaPrint size={30} />,
  printer: <Printer size={30} />,
  soundsystem: <FaSpeakerDeck size={30} />,
  sound: <FaSpeakerDeck size={30} />,
  store: <FaStore size={30} />,
  shop: <FaStore size={30} />,
  software: <FaCode size={30} />,
  application: <FaCode size={30} />,
  papers: <FaFileAlt size={30} />,
  document: <FaFileAlt size={30} />,
  files: <FaFolder size={30} />,
  folder: <FaFolder size={30} />,
  accessories: <FaHeadphones size={30} />,
  headphone: <FaHeadphones size={30} />,
  mouse: <FaMouse size={30} />,
  keyboard: <FaKeyboard size={30} />,
  network: <FaNetworkWired size={30} />,
  router: <FaNetworkWired size={30} />,
  tools: <FaTools size={30} />,
  battery: <FaBatteryFull size={30} />,
  power: <FaBatteryFull size={30} />,
  gaming: <Gamepad2Icon size = {30} />,
  office: <FileBarChart size = {30}/>,
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
  return <FaTag size={30} />; // Default icon
};

const Categories = () => {
  const dispatch = useDispatch();
  const { categoriesWithSub, loading, error } = useSelector((state) => state.categories);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategoriesAndProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching categories:", error);
    }
  }, [error]);

  return (
    <div className="mt-1 pb-1 md:pb-3">
      <div className="bg-[#CF212B] flex justify-between px-4 md:px-10 text-white text-xs md:text-lg font-semibold py-2">
        <p>Top Categories</p>
        <Link to="/all-categories" className="underline cursor-pointer">
          See all categories
        </Link>
      </div>
      <div className="bg-white shadow-xs p-2 md:p-4 grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-4">
        {loading ? (
          Array.from({ length: Math.min(9, 8) }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-2 animate-pulse"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-1 md:mb-2"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : (
          categoriesWithSub.slice(0, 8).map((category, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center justify-center p-2 hover:scale-110 hover:opacity-85 transition-transform"
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link to={category.path} className="flex flex-col items-center">
                <div className="text-green-600 mb-1 md:mb-2">
                  {getCategoryIcon(category.name)}
                </div>
                <span className="text-[10px] md:text-sm font-medium text-center leading-tight">
                  {category.name}
                </span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Categories;
