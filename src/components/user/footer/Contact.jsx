import React from "react";
import { Container, Typography, Box, Link, Paper } from "@mui/material";
import { LocationOn, Phone, Email } from "@mui/icons-material";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// Map container style
const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "10px",
};

// Center of the map (updated to match the exact location of JS Computer)
const center = {
  lat: 24.7584246, // Updated latitude
  lng: 90.4040342, // Updated longitude
};

const Contact = () => {
  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAtpbj9ERbHRSJRpcxgf9lmPyA3xktjvxo", // Replace with your Google Maps API key
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <Container maxWidth="sm">
      <div elevation={3} sx={{ padding: 4, marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom mt={2}>
          Contact Us
        </Typography>

        {/* Google Map */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={center}
          >
            {/* Marker for the location */}
            <Marker position={center} />
          </GoogleMap>
        </Box>

        {/* Address */}
        <Box display="flex" alignItems="center" mb={2}>
          <LocationOn sx={{ color: "gray", mr: 1 }} />
          <Typography variant="body1">
            42/6 Ram Babu Rd, Mymensingh-2200, Bangladesh
          </Typography>
        </Box>

        {/* Phone Number (Clickable) */}
        <Box display="flex" alignItems="center" mb={2}>
          <Phone sx={{ color: "gray", mr: 1 }} />
          <Link href="tel:+8801762691654" variant="body1" underline="hover">
            +88 01762691654
          </Link>
        </Box>

        {/* Email (Clickable) */}
        <Box display="flex" alignItems="center">
          <Email sx={{ color: "gray", mr: 1 }} />
          <Link href="mailto:Info@Jscomputersbd.Com" variant="body1" underline="hover">
            Info@Jscomputersbd.Com
          </Link>
        </Box>

        {/* Working Hours */}
        <Typography variant="body2" color="textSecondary" mt={2} mb={2}>
          Saturday – Thursday 09 AM – 08 PM
        </Typography>
      </div>
    </Container>
  );
};

export default Contact;
