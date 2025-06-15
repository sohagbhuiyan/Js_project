import Categories from "../../user/body/Categories";
import HeroSection from "../body/HeroSection";
import Collections from "../../user/body/collection/Collections";
import UserInfo from "../body/UserInfo";
import BrandSection from "../body/BrandSection";
import Branch from "../body/Branch";
import { Box } from "@mui/material";
import DesktopView from "../static/desktop/DesktopView";

const Home = () => {
  return (
    <Box sx={{ bgcolor: "#f5f5f5" }}>
      <HeroSection />
      <UserInfo />
      <Categories />
      <Collections isHomePage={true} sx={{ mb: 2 }} />
      <Box sx={{ borderTop: "1px solid #e0e0e0", my: 1 }} />
      <BrandSection />
      <DesktopView/>
      <Branch />
    </Box>
  );
};

export default Home;