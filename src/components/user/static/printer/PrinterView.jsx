import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPrinters } from "../../../../store/static/printerSlice";
import PrinterViewCard from "./PrinterViewCard";
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
import { fetchFilteredPrinters, resetFilters, setFilters } from "../../../../store/filters/allFilterSlice";
import FilterForm from "../Filter/FilterForm";

const PrinterView = () => {
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dispatch = useDispatch();
  const { printers, loading: printersLoading, error: printersError } = useSelector(
    (state) => state.printers
  );
  const { filteredPrinters, filters, loading: filterLoading, error: filterError } = useSelector(
    (state) => state.allfilter
  );

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    type: ["Inkjet", "Laser", "Dot Matrix", "Thermal", "3D"],
    printspeed: ["5 ppm", "8 ppm", "10 ppm", "15 ppm", "20 ppm", "30 ppm", "40 ppm"],
    printwidth: ["A4", "A3", "Letter", "Legal", "Tabloid"],
    printresolution: ["600x600", "1200x1200", "2400x600", "4800x1200", "5760x1440"],
    interfaces: ["USB", "Wi-Fi", "Ethernet", "Bluetooth", "USB+Wi-Fi", "USB+Ethernet"],
    bodycolor: ["Black", "White", "Grey", "Silver", "Blue"],
    warranties: ["1", "2", "3", "4"],
  });

  useEffect(() => {
    dispatch(fetchAllPrinters());
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
    dispatch(fetchFilteredPrinters(filters));
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setIsFilterOpen(false);
  };

  const urlFilteredPrinters = printers.filter((printer) => {
    if (searchQuery) {
      return (
        printer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        printer.catagory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        printer.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        printer.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        printer.productItem?.productitemname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const displayPrinters = filteredPrinters.length > 0 ? filteredPrinters : urlFilteredPrinters;

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
              productType="printer"
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
              productType="printer"
            />
          </Paper>
        </>

        {/* Printers Section */}
        <Box sx={{ flexGrow: 1 }}>
          {filterLoading || printersLoading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography variant="body1" color="textSecondary">
                Loading...
              </Typography>
            </Box>
          ) : filterError || printersError ? (
            <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>
              <Typography variant="body1">
                Error: {filterError || printersError}
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
              {displayPrinters.length > 0 ? (
                displayPrinters.map((printer) => (
                  <Box
                    key={printer.id}
                    sx={{
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <PrinterViewCard
                      id={printer.id}
                      imagea={printer.imagea}
                      category={printer.catagory?.name || "Uncategorized"}
                      name={printer.name}
                      type={printer.type}
                      regularprice={printer.regularprice}
                      specialprice={printer.specialprice}
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
                  No printers found
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PrinterView;
