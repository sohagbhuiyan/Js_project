
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchCCComponents,
  fetchCCItems,
  clearCCBError,
} from "../../../store/ccbuilderSlice";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CCBuilderPage = () => {
  const dispatch = useDispatch();
  const { components, items, loading, error } = useSelector((state) => state.ccBuilder);

  useEffect(() => {
    dispatch(fetchCCComponents());
    dispatch(fetchCCItems());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearCCBError());
    dispatch(fetchCCComponents());
    dispatch(fetchCCItems());
  };

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", px: { xs: 3 }, py: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        Browse Custom PC Builders
      </Typography>

      {(loading.component || loading.item) ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress size={50} />
        </Box>
      ) : error.component || error.item ? (
        <Box mb={4}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.component || error.item}
          </Alert>
          <Box textAlign="center">
            <Typography
              onClick={handleRetry}
              sx={{
                color: "primary.main",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Retry Loading
            </Typography>
          </Box>
        </Box>
      ) : components.length === 0 ? (
        <Typography variant="h6" color="text.secondary" textAlign="center" my={2}>
          No PC builders found.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {components.map((component) => (
            <Accordion
              key={component.id}
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: "grey.100",
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="medium"
                  component={Link}
                  to={`/cc-builder/${component.id}/item-details`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {component.name}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                {items.filter((item) => item.ccBuilder?.id === component.id).length === 0 ? (
                  <Typography variant="body2" color="text.secondary" my={1}>
                    No items found for this builder.
                  </Typography>
                ) : (
                  <List>
                    {items
                      .filter((item) => item.ccBuilder?.id === component.id)
                      .map((item) => (
                        <ListItem
                          key={item.id}
                          component={Link}
                          to={`/cc-builder/item/${item.id}/details`}
                          sx={{
                            borderBottom: 1,
                            borderColor: "grey.300",
                            "&:hover": { bgcolor: "grey.50" },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <ListItemText
                            primary={item.name}
                            primaryTypographyProps={{ fontWeight: "medium" }}
                          />
                        </ListItem>
                      ))}
                  </List>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CCBuilderPage;

//jhshsd
