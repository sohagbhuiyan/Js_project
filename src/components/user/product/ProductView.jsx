import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { fetchProductDetailsById } from "../../../store/productSlice";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
} from "@mui/icons-material";

const ProductView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const { user, profile, token } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("/images/fallback.jpg");
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetailsById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct?.imagea) {
      setMainImage(currentProduct.imagea);
    } else {
      setMainImage("/images/fallback.jpg");
    }
  }, [currentProduct]);

  const galleryImages = useMemo(() => {
    if (!currentProduct) return [];
    return [
      currentProduct.imagea,
      currentProduct.imageb,
      currentProduct.imagec,
    ]
      .filter(Boolean)
      .map((img) => img || "/images/fallback.jpg");
  }, [currentProduct]);

  const increaseQuantity = useCallback(() => setQuantity((prev) => prev + 1), []);
  const decreaseQuantity = useCallback(
    () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)),
    []
  );

  const getSpecifications = (specString) => {
    if (!specString) return [];
    // Trim, normalize commas, and split
    const normalized = specString
      .trim()
      .replace(/,\s*,+/g, ", ")
      .replace(/\s+/g, " ");
    return normalized
      .split(", ")
      .filter((item) => item.trim().length > 0); // Remove empty items
  };

  const specifications = getSpecifications(currentProduct?.specification);
  const handleMouseMove = useCallback(
    (e) => {
      if (isTouchDevice) return;
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
    [mainImage, isTouchDevice]
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    setZoomStyle({ display: "none" });
  }, [isTouchDevice]);

  const handlePlaceOrderClick = useCallback(() => {
    if (!user?.id || !profile?.email || !token) {
      toast.error("Please log in to place an order.", { duration: 1000 });
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    navigate("/checkout", {
      state: {
        products: [{ ...currentProduct, quantity }],
      },
    });
  }, [user, profile, token, currentProduct, quantity, navigate, id]);

  const shareUrl = window.location.href;
  const shareText = `Check out this product: ${currentProduct?.name || "Product"} - Tk ${currentProduct?.specialprice || ""}`;

  const handleShare = useCallback(
    (platform) => {
      let url;
      switch (platform) {
        case "whatsapp":
          url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
            shareText + " " + shareUrl
          )}`;
          break;
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`;
          break;
        case "instagram":
          navigator.clipboard.writeText(shareUrl).then(() => {
            toast.success("Link copied! Paste it in Instagram.");
          });
          return;
        default:
          return;
      }
      window.open(url, "_blank");
    },
    [shareUrl, shareText]
  );

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
  if (!currentProduct)
    return (
      <Typography variant="h5" sx={{ textAlign: "center", mt: 6 }}>
        Product Not Found
      </Typography>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row-reverse" },
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1, px: { xs: 1, sm: 2, md: 4 } }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
        >
          {currentProduct.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
        >
          Product ID: {currentProduct.productid}
        </Typography>
        <Typography
          variant="h6"
          color="error"
          fontWeight="bold"
          sx={{ mt: 1, fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          Special Price: Tk {currentProduct.specialprice}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1, fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Regular Price: Tk {currentProduct.regularprice}
        </Typography>
        {currentProduct.specialprice < currentProduct.regularprice && (
          <Typography
            variant="body2"
            color="secondary"
            sx={{ mt: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            Save Tk {currentProduct.regularprice - currentProduct.specialprice} on online order
          </Typography>
        )}
        <Typography
          variant="h6"
          fontWeight="medium"
          sx={{ mt: 2, fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          Quick Overview
        </Typography>
        {specifications.length > 0 ? (
        <ul className="list-disc pl-5 text-gray-600" style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)" }}>
          {specifications.map((detail, index) => (
            <li key={index} className="py-1">
              {detail}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-sm">No specifications available.</p>
      )}
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={decreaseQuantity}
                disabled={loading}
                sx={{ minWidth: "40px" }}
              >
                -
              </Button>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                {quantity}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={increaseQuantity}
                disabled={loading}
                sx={{ minWidth: "40px" }}
              >
                +
              </Button>
            </Box>
            <Button
              variant="contained"
              color="success"
              onClick={handlePlaceOrderClick}
              disabled={loading}
              sx={{ px: 3, py: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              {loading ? "Processing..." : "Proceed to Order"}
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Share:
            </Typography>
            <IconButton
              onClick={() => handleShare("whatsapp")}
              color="success"
              sx={{ p: 1 }}
              aria-label="Share on WhatsApp"
            >
              <WhatsAppIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => handleShare("facebook")}
              color="success"
              sx={{ p: 1 }}
              aria-label="Share on Facebook"
            >
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => handleShare("instagram")}
              color="success"
              sx={{ p: 1 }}
              aria-label="Share on Instagram"
            >
              <InstagramIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          px: { xs: 1, sm: 2 },
          py: 2,
          flexDirection: { xs: "column-reverse", md: "row" },
          gap: 2,
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            gap: 1,
            px: 1,
            overflowX: { xs: "auto", md: "visible" },
          }}
        >
          {galleryImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="border border-gray-300 cursor-pointer object-cover"
              style={{
                width: "clamp(40px, 12vw, 60px)",
                height: "clamp(40px, 12vw, 60px)",
              }}
              onMouseEnter={() => !isTouchDevice && setMainImage(img)}
              onClick={() => setMainImage(img)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/fallback.jpg";
              }}
              loading="lazy"
            />
          ))}
        </Box>
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", sm: "min(90vw, 420px)" },
            maxWidth: "420px",
            aspectRatio: "4/3",
            border: "1px solid #ccc",
            overflow: "hidden",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={mainImage}
            alt={currentProduct.name || "Product"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/fallback.jpg";
            }}
            loading="lazy"
          />
          {!isTouchDevice && (
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
          )}
        </Box>
      </Box>

      <Toaster />
    </Box>
  );
};

export default ProductView;
