
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAboutUs, clearAboutUsError } from "../../../store/aboutUsSlice";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  background: "linear-gradient(135deg, #ffffff, #f9fafb)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: 0,
    width: "50px",
    height: "4px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "2px",
  },
}));

const AboutUs = () => {
  const dispatch = useDispatch();
  const { aboutUsEntries = [], loading, error } = useSelector((state) => state.aboutUs || {});

  // Fetch About Us data on mount
  useEffect(() => {
    dispatch(getAllAboutUs());

    // Clear error after 5 seconds
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearAboutUsError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, error]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <Box
      sx={{
 
        background: "linear-gradient(to bottom, #f3f4f6, #e5e7eb)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Typography
            variant="h4"
            align="center"
            color="primary"
            sx={{ fontWeight: 800, mb: 2, textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
          >
            About JS Computer
          </Typography>

          {error && (
            <Fade in={true}>
              <Alert severity="error" sx={{ mb: 4, maxWidth: "md", mx: "auto" }}>
                {error}
              </Alert>
            </Fade>
          )}

          {loading ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={60} thickness={4} />
              <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
                Loading...
              </Typography>
            </Box>
          ) : aboutUsEntries.length === 0 ? (
            <Fade in={true}>
              <Alert severity="info" sx={{ mb: 4, maxWidth: "md", mx: "auto" }}>
                No About Us information available.
              </Alert>
            </Fade>
          ) : (
            <div elevation={0}>
              <motion.div variants={containerVariants}>
                <SectionTitle variant="h5">Our Story</SectionTitle>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.8, mb: 4 }}
                  >
                    Greetings from JS Computer! With over 20 years of experience, our foremost
                    concern has always been satisfying our customers' needs. Our professional team
                    is dedicated to helping you choose the perfect accessories for your computer.
                    Thank you for trusting us, and we assure you of our best services at all times.
                  </Typography>
                </motion.div>

                <Box sx={{ mb: 4 }}>
                  <SectionTitle variant="h5">Mission</SectionTitle>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", lineHeight: 1.8, pl: 4 }}
                    >
                      {aboutUsEntries[0].mission}
                    </Typography>
                  </motion.div>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <SectionTitle variant="h5">Vision</SectionTitle>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", lineHeight: 1.8, pl: 4 }}
                    >
                      {aboutUsEntries[0].vision}
                    </Typography>
                  </motion.div>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <SectionTitle variant="h5">Achievements</SectionTitle>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", lineHeight: 1.8, pl: 4 }}
                    >
                      {aboutUsEntries[0].achievements || "None"}
                    </Typography>
                  </motion.div>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <SectionTitle variant="h5">Brand/Business Partners</SectionTitle>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", lineHeight: 1.8, pl: 4 }}
                    >
                      {aboutUsEntries[0].brandbusinesspartners || "None"}
                    </Typography>
                  </motion.div>
                </Box>

                <Box>
                  <SectionTitle variant="h5">Description</SectionTitle>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", lineHeight: 1.8, pl: 4 }}
                    >
                      {aboutUsEntries[0].description}
                    </Typography>
                  </motion.div>
                </Box>
              </motion.div>
            </div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutUs;