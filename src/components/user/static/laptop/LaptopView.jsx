import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaptops } from "../../../../store/static/laptopSlice";
import LaptopViewCard from "./LaptopViewCard";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  Paper,
  Fade,
} from "@mui/material";
import { FaFilter, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../../../../store/api";
import { fetchFilteredLaptops, resetFilters, setFilters } from "../../../../store/filters/allFilterSlice";
import FilterForm from "../Filter/FilterForm";
import AllProductsPage from "../../body/collection/AllProductsPage";

const LaptopView = () => {
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dispatch = useDispatch();
  const { laptops, loading: laptopsLoading, error: laptopsError } = useSelector(
    (state) => state.laptops
  );
  const { filteredLaptops, filters, loading: filterLoading, error: filterError } = useSelector(
    (state) => state.allfilter
  );

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    processorBrands: ["Intel", "AMD", "Apple"],
    generations: ["7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th"],
    processorTypes: ["Core i3", "Core i5", "Core i7", "Core i9", "Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9"],
    warranties: ["1", "2", "3", "4"],
    displaySizeRanges: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"],
    rams: ["4", "8", "16", "32", "64"],
    graphicsMemories: ["2", "4", "6", "8", "10", "12"],
    operatingSystems: ["Windows 7", "Windows 9", "Windows 10", "Windows 11", "Windows 12", "macOS", "Linux"],
    colors: ["Silver", "Black", "Space Grey", "Gold", "White"],
  });

  useEffect(() => {
    dispatch(fetchLaptops());
    const fetchFilterOptions = async () => {
      try {
        const [brandsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/brands/get/all`),
        ]);
        const brandsData = await brandsRes.json();
        setFilterOptions((prev) => ({
          ...prev,
          brands: brandsData,
        }));
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
    dispatch(fetchFilteredLaptops(filters));
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setIsFilterOpen(false);
  };

  const urlFilteredLaptops = laptops.filter((laptop) => {
    if (searchQuery) {
      return (
        laptop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.catagory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.ram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.productItem?.productitemname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const displayLaptops = filteredLaptops.length > 0 ? filteredLaptops : urlFilteredLaptops;

  return (
    <Box
      sx={{
        py: { xs: 1, md: 1 },
        px: { xs: 1, md: 1 },
        bgcolor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      }}
    >
        <AllProductsPage
          // title={getDynamicTitle()}
          // productCount={sortedProducts.length}
          // sortOption={sortOption}
          // onSortChange={setSortOption}
          // viewType={viewType}
          // onViewChange={setViewType}
        />
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, md: 2 },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Mobile Filter Button */}
        <Fade in={true}>
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
            <Typography
              variant="caption"
              sx={{ fontWeight: "medium", fontSize: "0.75rem" }}
            >
              Filter
            </Typography>
          </Box>
        </Fade>

        {/* Filter Sidebar (Desktop) / Drawer (Mobile) */}
        <>
          <Drawer
            anchor="left"
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "80vw", sm: "20vw", md: "40vw" },
                maxWidth: "220px",
                bgcolor: "#fafafa",
                p: 2,
                transition: "transform 0.3s ease-in-out",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "skyblue" }}
              >
                Filters By
              </Typography>
              <IconButton
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close filters"
              >
                <FaTimes size={10} color="#333" />
              </IconButton>
            </Box>
            <FilterForm
              filters={filters}
              handleChange={handleFilterChange}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
              filterOptions={filterOptions}
            />
          </Drawer>

          <Paper
            sx={{
              width: { md: 240 },
              flexShrink: 0,
              display: { xs: "none", md: "block" },
              p: 3,
              bgcolor: "#fafafa",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "skyblue" }}
            >
              Filter By
            </Typography>
            <FilterForm
              filters={filters}
              handleChange={handleFilterChange}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
              filterOptions={filterOptions}
              productType="laptop"
            />
          </Paper>
        </>

        {/* Laptops Section */}
        <Box sx={{ flexGrow: 1 }}>
          {filterLoading || laptopsLoading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography variant="body1" color="textSecondary">
                Loading...
              </Typography>
            </Box>
          ) : filterError || laptopsError ? (
            <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>
              <Typography variant="body1">
                Error: {filterError || laptopsError}
              </Typography>
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
              {displayLaptops.length > 0 ? (
                displayLaptops.map((laptop) => (
                  <Box
                    key={laptop.id}
                    sx={{
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <LaptopViewCard
                      id={laptop.id}
                      imagea={laptop.imagea}
                      category={laptop.catagory?.name || "Uncategorized"}
                      name={laptop.name}
                      ram={laptop.ram}
                      regularprice={laptop.regularprice}
                      specialprice={laptop.specialprice}
                    />
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    gridColumn: "1 / -1",
                    py: 6,
                  }}
                >
                  No laptops found
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LaptopView;
