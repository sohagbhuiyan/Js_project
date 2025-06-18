import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { fetchLaptopById } from "../../../../store/static/laptopSlice";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const LaptopViewItem = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentLaptop, loading, error } = useSelector((state) => state.laptops);
  const { user, profile, token } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("/images/fallback.jpg");
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  // Fetch laptop details
  useEffect(() => {
    if (id) {
      dispatch(fetchLaptopById(id));
    }
  }, [dispatch, id]);

  // Set main image when currentLaptop changes
  useEffect(() => {
    if (currentLaptop?.imagea) {
      setMainImage(currentLaptop.imagea);
    } else {
      setMainImage("/images/fallback.jpg");
    }
  }, [currentLaptop]);

  // Memoize gallery images
  const galleryImages = useMemo(() => {
    if (!currentLaptop) return [];
    return [
      currentLaptop.imagea,
      currentLaptop.imageb,
      currentLaptop.imagec,
    ]
      .filter(Boolean)
      .map((img) => img || "/images/fallback.jpg");
  }, [currentLaptop]);

  // Memoize quantity handlers
  const increaseQuantity = useCallback(() => setQuantity((prev) => prev + 1), []);
  const decreaseQuantity = useCallback(
    () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)),
    []
  );

  // Memoize mouse move handler
  const handleMouseMove = useCallback(
    (e) => {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.pageX - left) / width) * 100;
      const y = ((e.pageY - top) / height) * 100;

      setZoomStyle({
        backgroundImage: `url(${mainImage})`,
        backgroundSize: "200%",
        backgroundPosition: `${x}% ${y}%`,
        display: "block",
      });
    },
    [mainImage]
  );

  // Memoize mouse leave handler
  const handleMouseLeave = useCallback(() => {
    setZoomStyle({ display: "none" });
  }, []);

  // Memoize place order handler
  const handlePlaceOrderClick = useCallback(() => {
    if (!user?.id || !profile?.email || !token) {
      toast.error("Please log in to place an order.", { duration: 1000 });
      navigate("/login", { state: { from: `/laptop/${id}` } });
      return;
    }
    navigate("/checkout", {
      state: {
        products: [{
          ...currentLaptop,
          quantity,
        }],
      },
    });
  }, [user, profile, token, currentLaptop, quantity, navigate, id]);

  // Render loading, error, or not found states
  if (loading)
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
        Error: {error}
      </Typography>
    );
  if (!currentLaptop)
    return (
      <Typography variant="h5" sx={{ textAlign: "center", mt: 6 }}>
        Laptop Not Found
      </Typography>
    );

  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: { xs: "column", md: "row-reverse" }, gap: 4 }}>
      {/* Laptop Details */}
      <Box sx={{ flex: 1, px: { xs: 2, md: 4 } }}>
        <Typography variant="h6" fontWeight="bold">
          {currentLaptop.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Product ID: {currentLaptop.id}
        </Typography>
        <Typography variant="h6" color="error" fontWeight="bold" sx={{ mt: 1 }}>
          Special Price: Tk {currentLaptop.specialprice}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Regular Price: Tk {currentLaptop.regularprice}
        </Typography>
        {currentLaptop.specialprice < currentLaptop.regularprice && (
          <Typography variant="body2" color="secondary" sx={{ mt: 1 }}>
            Save Tk {currentLaptop.regularprice - currentLaptop.specialprice} on online order
          </Typography>
        )}
        <Typography variant="h6" fontWeight="medium" sx={{ mt: 2 }}>
          Quick Overview
        </Typography>
        <ul className="list-disc pl-6 text-sm text-gray-600">
          {currentLaptop.details &&
            currentLaptop.details.split(", ").map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
        </ul>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={decreaseQuantity}
              disabled={loading}
            >
              -
            </Button>
            <Typography>{quantity}</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={increaseQuantity}
              disabled={loading}
            >
              +
            </Button>
          </Box>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handlePlaceOrderClick}
            disabled={loading}
            sx={{ px: 3, py: 1 }}
          >
            {loading ? "Processing..." : "Proceed to Order"}
          </Button>
        </Box>
      </Box>

      {/* Laptop Images */}
      <Box sx={{ display: "flex", px: 5, py:2, flexDirection: { xs: "column-reverse", md: "row" }, gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, gap: 1, px: 1 }}>
          {galleryImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumbnail-${index}`}
              className="w-12 h-12 sm:w-16 sm:h-16 border border-gray-300 cursor-pointer object-cover"
              onMouseEnter={() => setMainImage(img)}
              onClick={() => setMainImage(img)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/fallback.jpg";
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            position: "relative",
            width: { xs: "250px", sm: "420px" },
            height: { xs: "180px", sm: "360px" },
            border: "1px solid #ccc",
            overflow: "hidden",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={mainImage}
            alt={currentLaptop.name || "Laptop"}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/fallback.jpg";
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              cursor: "zoom-in",
            }}
            style={zoomStyle}
          />
        </Box>
      </Box>

      <Toaster />
    </Box>
  );
};

export default LaptopViewItem;