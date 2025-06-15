import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const ComplainForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    complaint: "",
  });
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Replace with your backend API call or state logic
    console.log("Form submitted:", formData);

    // Reset form
    setFormData({ name: "", email: "", complaint: "" });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f2f2f2f2",
        color: "white",
        py: 5,
        px: { xs: 2, md: 4 },
      }}   
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            backgroundColor: "#f9f9f9f9",
            borderRadius: 2,
          }}
          elevation={3}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ color: "skyblue", fontWeight: "bold", mb:1 }}
          >
            Submit Your Complaint
          </Typography>

          <Typography
            variant="body2"
            align="center"
            gutterBottom
            sx={{ color: "gray",mb:2  }}
          >
            We value your feedback and are committed to resolving your concerns.
            Please fill out the form below.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              InputProps={{ style: { color: "black" } }}
              InputLabelProps={{ style: { color: "gray" } }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: "#f7f7f7f7" } }}
            />

            <TextField
              label="Your Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              InputProps={{ style: { color: "black" } }}
              InputLabelProps={{ style: { color: "gray" } }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: "#f7f7f7f7" } }}
            />

            <TextField
              label="Your Complaint"
              name="complaint"
              value={formData.complaint}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              required
              InputProps={{ style: { color: "black" } }}
              InputLabelProps={{ style: { color: "gray" } }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: "#f7f7f7f7" } }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#4B5563",
                "&:hover": { backgroundColor: "#6B7280" },
                textTransform: "none",
              }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ComplainForm;
