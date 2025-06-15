import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDesktops } from "../../../../store/static/desktopSlice";
import { fetchFilteredProducts, setFilters, resetFilters } from "../../../../store/filterSlice";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaExchangeAlt, FaHeart, FaEye, FaTimes, FaFilter } from "react-icons/fa";
import { addToWishlist } from "../../../../store/wishlistSlice";
import { addToCartAsync } from "../../../../store/cartSlice";
import { addToCompare } from "../../../../store/compareSlice";
import toast, { Toaster } from "react-hot-toast";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  IconButton,
  Drawer,
  Typography,
  Paper,
  Fade,
} from "@mui/material";
import { API_BASE_URL } from "../../../../store/api";

const DesktopViewCard = ({
  id,
  imagea,
  category,
  name,
  ram,
  regularprice,
  specialprice,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showMobileIcons, setShowMobileIcons] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iconsRef = useRef(null);
  const dispatch = useDispatch();
  const cartStatus = useSelector((state) => state.cart.status);
  const cartError = useSelector((state) => state.cart.error);
  const authState = useSelector((state) => state.auth);

  const discount = regularprice - specialprice;
  const hasDiscount = specialprice > 0 && discount > 0;
  const currentPrice = hasDiscount ? specialprice : regularprice;

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 })
      .format(amount)
      .replace(/(\d+)/, "Tk $1");

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && showMobileIcons && iconsRef.current && !iconsRef.current.contains(e.target)) {
        setShowMobileIcons(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, showMobileIcons]);

  useEffect(() => {
    if (cartStatus === "failed" && cartError) {
      toast.error(cartError, { position: "top-right" });
    }
  }, [cartStatus, cartError]);

  const handleProductClick = (e) => {
    if (isMobile) {
      if (!showMobileIcons) {
        e.preventDefault();
        e.stopPropagation();
      }
      setShowMobileIcons(!showMobileIcons);
    }
  };

  const handleIconAction = (callback) => (e) => {
    e.preventDefault();
    callback(e);
    if (isMobile) setShowMobileIcons(false);
  };

  const handleAddToCart = handleIconAction(() => {
    dispatch(
      addToCartAsync({
        productDetailsId: id,
        quantity: 1,
        name,
        price: currentPrice,
        imagea,
      })
    )
      .then(() => {
        toast.success("Added to cart!", { position: "top-right" });
      })
      .catch(() => {
        // Error toast is handled in the useEffect above
      });
  });

  const handleAddToWishlist = handleIconAction(() => {
    if (!authState.user) {
      toast.warn("Please log in to add to wishlist!", { position: "top-right" });
      return;
    }
    dispatch(
      addToWishlist({
        id,
        imagea,
        category,
        name,
        regularprice,
        specialprice,
      })
    );
    toast.success("Added to wishlist!", { position: "top-right" });
  });

  const handleAddToCompare = handleIconAction(() => {
    dispatch(
      addToCompare({
        id,
        name,
        regularprice,
        specialprice,
        imagea,
        category,
      })
    );
    toast.success("Added to compare!", { position: "top-right" });
  });

  return (
    <>
      <Link to={`/desktop/${id}`} className="block" onClick={handleProductClick}>
        <div
          className={`border border-gray-400 rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-400 bg-white relative ${
            isHovered ? "md:scale-105" : "scale-100"
          }`}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
        >
          <div className="relative p-1 overflow-hidden rounded-md">
            <img
              src={imagea}
              alt={name}
              className={`w-full h-40 md:h-48 object-cover rounded-md transition-transform duration-600 ${
                isHovered ? "scale-118" : "scale-100"
              }`}
              loading="lazy"
            />
            {(isHovered || (isMobile && showMobileIcons)) && (
              <div
                ref={iconsRef}
                className="absolute top-2 right-2 flex flex-col gap-2 rounded-lg"
              >
                {["cart", "compare", "wishlist", "view"].map((action, idx) => (
                  <button
                    key={action}
                    className="p-1 bg-white text-gray-600 border border-gray-600 hover:cursor-pointer rounded-full shadow-sm hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      switch (idx) {
                        case 0:
                          handleAddToCart(e);
                          break;
                        case 1:
                          handleAddToCompare(e);
                          break;
                        case 2:
                          handleAddToWishlist(e);
                          break;
                        case 3:
                          setIsQuickViewOpen(true);
                          break;
                      }
                    }}
                    aria-label={`${action} ${name}`}
                  >
                    {[<FaShoppingCart />, <FaExchangeAlt />, <FaHeart />, <FaEye />][idx]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-2 space-y-1">
            <h3 className="text-sm font-semibold text-gray-700 truncate">{name}</h3>
            <p className="text-xs text-gray-600 line-clamp-2 min-h-[2rem]">{category}</p>
            <p className="text-xs text-gray-600 line-clamp-2 min-h-[1.5rem]">{ram}</p>
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-gray-900">{formatPrice(currentPrice)}</span>
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-xs line-through text-gray-400">{formatPrice(regularprice)}</span>
                  <span className="text-xs text-green-600 font-medium">Save {formatPrice(discount)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {isQuickViewOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsQuickViewOpen(false)}
                aria-label="Close quick view"
              >
                <FaTimes className="text-2xl cursor-pointer" />
              </button>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-3">
                  <img src={imagea} alt={name} className="w-full h-64 object-contain rounded-lg" />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(currentPrice)}
                      {hasDiscount && (
                        <span className="ml-3 text-sm line-through text-gray-400">
                          {formatPrice(regularprice)}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{category}</p>
                    <p className="text-sm text-gray-600">{ram}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Toaster position="top-right" />
        </div>
      )}
    </>
  );
};

const FilterForm = ({ filters, handleChange, handleApplyFilters, handleResetFilters, brands, productItems, productData }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 220 }}>
    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Brand</InputLabel>
      <Select
        name="brandname"
        value={filters.brandname || ""}
        onChange={handleChange}
        label="Brand"
        sx={{
          fontSize: "0.9rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
          All Brands
        </MenuItem>
        {brands.map((brand) => (
          <MenuItem key={brand.id} value={brand.brandname} sx={{ fontSize: "0.9rem" }}>
            {brand.brandname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Product Name</InputLabel>
      <Select
        name="productName"
        value={filters.productName || ""}
        onChange={handleChange}
        label="Product Name"
        sx={{
          fontSize: "0.9rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
          All Products
        </MenuItem>
        {productData.map((item) => (
          <MenuItem key={item.id} value={item.name} sx={{ fontSize: "0.9rem" }}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      name="regularPrice"
      label="Price"
      type="number"
      value={filters.regularPrice || ""}
      onChange={handleChange}
      fullWidth
      size="small"
      sx={{
        fontSize: "0.9rem",
        bgcolor: "#fff",
        borderRadius: "8px",
        "& .MuiInputBase-root": { height: 40 },
        "&:hover": { bgcolor: "#f1f5f9" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
      }}
      placeholder="e.g., 500"
    />

    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: "0.9rem", color: "#555" }}>Product Item</InputLabel>
      <Select
        name="productItemId"
        value={filters.productItemId || ""}
        onChange={handleChange}
        label="Product Item"
        sx={{
          fontSize: "0.9rem",
          height: 40,
          bgcolor: "#fff",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#f1f5f9" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.9rem" }}>
          All Items
        </MenuItem>
        {productItems.map((item) => (
          <MenuItem key={item.id} value={item.id} sx={{ fontSize: "0.9rem" }}>
            {item.productitemname || item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyFilters}
        fullWidth
        disabled={!Object.values(filters).some((v) => v)}
        sx={{
          fontSize: "0.5rem",
          py: 1,
          bgcolor: "#1976d2",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#1565c0", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
          "&:disabled": { bgcolor: "#b0bec5" },
          transition: "all 0.2s ease-in-out",
        }}
      >
        Filters
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleResetFilters}
        fullWidth
        sx={{
          fontSize: "0.5rem",
          py: 1,
          borderColor: "#f50057",
          color: "#f50057",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#fce4ec", borderColor: "#d81b60" },
          transition: "all 0.2s ease-in-out",
        }}
      >
        Reset
      </Button>
    </Box>
  </Box>
);

const DesktopView = ({ isHomePage = false, sx }) => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const productParam = searchParams.get("product") || "";
  const itemParam = searchParams.get("item") || "";
  const brandnameParam = searchParams.get("brandname") || "";
  const searchParam = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dispatch = useDispatch();
  const { desktops, loading: desktopsLoading, error: desktopsError } = useSelector(
    (state) => state.desktops
  );
  const { filteredProducts, filters, loading: filterLoading, error: filterError } = useSelector(
    (state) => state.filter
  );

  const [brands, setBrands] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [productData, setProductData] = useState([]);

  const showFilter = !isHomePage && (categoryParam || productParam || itemParam || brandnameParam);

  useEffect(() => {
    dispatch(fetchDesktops());
    const fetchFilterOptions = async () => {
      try {
        const [brandsRes, itemsRes, productRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/brands/get/all`),
          fetch(`${API_BASE_URL}/api/product/items/get`),
          fetch(`${API_BASE_URL}/api/Product/getall`),
        ]);

        const brandsData = await brandsRes.json();
        const itemsData = await itemsRes.json();
        const productData = await productRes.json();

        setBrands(brandsData);
        setProductItems(itemsData);
        setProductData(productData);
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };
    fetchFilterOptions();
  }, [dispatch]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleApplyFilters = () => {
    if (filters.regularPrice && filters.regularPrice < 0) {
      alert("Price cannot be negative.");
      return;
    }
    dispatch(fetchFilteredProducts(filters));
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setIsFilterOpen(false);
  };

  const urlFilteredDesktops = desktops.filter((desktop) => {
    if (itemParam) {
      return desktop.productItem?.productitemname?.toLowerCase() === itemParam.toLowerCase();
    }
    if (productParam) {
      return (
        desktop.product?.name?.toLowerCase() === productParam.toLowerCase() ||
        desktop.name?.toLowerCase() === productParam.toLowerCase()
      );
    }
    if (categoryParam) {
      return desktop.catagory?.name?.toLowerCase() === categoryParam.toLowerCase();
    }
    if (brandnameParam) {
      return desktop.brand?.brandname?.toLowerCase() === brandnameParam.toLowerCase();
    }
    if (searchQuery) {
      return (
        desktop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desktop.catagory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desktop.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desktop.ram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desktop.productItem?.productitemname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const displayDesktops = filteredProducts.length > 0 ? filteredProducts : urlFilteredDesktops;

  return (
    <Box
      sx={{
        py: { xs: 1, md: 1 },
        px: { xs: 1, md: 1 },
        bgcolor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", gap: { xs: 1, md: 2 }, flexDirection: { xs: "column", md: "row" } }}>
        {/* Mobile Filter Button */}
        {showFilter && (
          <Fade in={showFilter}>
            <Box
              onClick={() => setIsFilterOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 0.5,
                position: "fixed",
                top: { xs: 63, sm: 130 },
                left: { xs: 1, sm: 4 },
                cursor: "pointer",
                bgcolor: "#07a966",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "2px 4px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  bgcolor: "#07a966",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                },
                zIndex: 1000,
              }}
            >
              <FaFilter size={8} />
              <Typography variant="caption" sx={{ fontWeight: "medium", fontSize: "0.75rem" }}>
                Filter
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Filter Sidebar (Desktop) / Drawer (Mobile) */}
        {showFilter && (
          <>
            <Drawer
              anchor="left"
              open={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  width: { xs: "80vw", sm: "20vw", md: "40vw" },
                  maxWidth: "200px",
                  bgcolor: "#fafafa",
                  p: 2,
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                  Filters
                </Typography>
                <IconButton onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                  <FaTimes size={10} color="#333" />
                </IconButton>
              </Box>
              <FilterForm
                filters={filters}
                handleChange={handleFilterChange}
                handleApplyFilters={handleApplyFilters}
                handleResetFilters={handleResetFilters}
                brands={brands}
                productItems={productItems}
                productData={productData}
              />
            </Drawer>

            <Paper
              sx={{
                width: { md: 200 },
                flexShrink: 0,
                display: { xs: "none", md: "block" },
                p: 3,
                bgcolor: "#fafafa",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#333" }}>
                Filter Desktops
              </Typography>
              <FilterForm
                filters={filters}
                handleChange={handleFilterChange}
                handleApplyFilters={handleApplyFilters}
                handleResetFilters={handleResetFilters}
                brands={brands}
                productItems={productItems}
                productData={productData}
              />
            </Paper>
          </>
        )}

        {/* Desktops Section */}
        <Box sx={{ flexGrow: 1 }}>
          {filterLoading || desktopsLoading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography variant="body1" color="textSecondary">
                Loading...
              </Typography>
            </Box>
          ) : filterError || desktopsError ? (
            <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>
              <Typography variant="body1">Error: {filterError || desktopsError}</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(auto-fill, minmax(150px, 1fr))",
                  sm: "repeat(auto-fill, minmax(180px, 1fr))",
                  md: "repeat(auto-fill, minmax(200px, 1fr))",
                  lg: "repeat(auto-fill, minmax(220px, 1fr))",
                },
                gap: { xs: 1.5, sm: 2, md: 3, lg: 4 },
                mb: 4,
                p: 4,
              }}
            >
              {displayDesktops.length > 0 ? (
                displayDesktops.map((desktop) => (
                  <Box
                    key={desktop.id}
                    sx={{
                      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <DesktopViewCard
                      id={desktop.id}
                      imagea={desktop.imagea}
                      category={desktop.catagory?.name || "Uncategorized"}
                      name={desktop.name}
                      ram={desktop.ram}
                      regularprice={desktop.regularprice}
                      specialprice={desktop.specialprice}
                    />
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{ textAlign: "center", color: "text.secondary", gridColumn: "1 / -1", py: 6 }}
                >
                  No desktops found
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DesktopView;