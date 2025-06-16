import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDesktops } from "../../../../store/static/desktopSlice";
import { Box, Typography } from "@mui/material";

const RelatedDesktop = ({ categoryId }) => {
  const dispatch = useDispatch();
  const { desktops, loading, error, currentDesktop } = useSelector((state) => state.desktops);

  useEffect(() => {
    dispatch(fetchDesktops());
  }, [dispatch]);

  const relatedDesktops = desktops.filter(
    (desktop) => desktop.catagory?.id === categoryId && desktop.id !== currentDesktop?.id
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Related Desktops
      </Typography>
      {relatedDesktops.length > 0 ? (
        relatedDesktops.map((desktop) => (
          <Box key={desktop.id} sx={{ mb: 2 }}>
            <img
              src={desktop.imagea || "/images/fallback.jpg"}
              alt={desktop.name}
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
            <Typography variant="body2">{desktop.name}</Typography>
            <Typography variant="body2" color="error">
              Tk {desktop.specialprice}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography>No related desktops found.</Typography>
      )}
    </Box>
  );
};

export default RelatedDesktop;