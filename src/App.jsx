import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// User Pages
import Home from './components/user/pages/Home';
import AllCategories from './components/user/body/AllCategories';
import Registration from './components/user/registration/Registration';
import Login from './components/user/registration/Login';
import ExclusiveOffer from './components/user/topbar/ExclusiveOffer';
import NewsMedia from './components/user/topbar/NewsMedia';
import Contact from './components/user/footer/Contact';
import ProductviewPage from './components/user/product/ProductviewPage';
import AboutUs from './components/user/footer/AboutUs';
import AboutCEO from './components/user/footer/AboutCEO';
import Specialty from './components/user/footer/Specialty';
import ServiceCenter from './components/user/footer/ServiceCenter';
// import WishlistPage from './components/user/navbar/WishlistPage';
import CartPage from './components/user/navbar/CartPage';
import ComparePage from './components/user/navbar/ComparePage';

// User Profile
import ProfileEdit from './components/user/registration/profile/ProfileEdit';
import ProfileView from './components/user/registration/profile/ProfileView';

// Admin Pages
import Dashboard from './components/admin/dashboard/Dashboard';
import OrderManagement from './components/admin/management/OrderManagement';
import CustomerManagement from './components/admin/management/CustomerManagement';
import ViewProduct from './components/admin/products/ViewProduct';
import AddProduct from './components/admin/products/AddProduct';
import AddCategory from './components/admin/products/AddCategory';

// Protected Routes
import UserProtectedRoute from './components/Protected/UserProtectedRoute';
import AdminProtectedRoute from './components/Protected/AdminProtectedRoute';
import Collections from './components/user/body/collection/Collections';
import PCBuilder from './components/admin/systemBuild/PCBuilder';
import PCBuilderPage from './components/user/pcbuilder/PCBuilderPage';
import ComponentProductsPage from './components/user/pcbuilder/ComponentProductsPage';
import ViewSystemBuilder from './components/admin/systemBuild/ViewSystemBuilder';
import CheckoutPage from './components/user/product/CheckOutPage';
import OrderConfirmation from './components/user/product/OrderConfirmation';
import UserOrders from './components/user/product/UserOrders';
import AdminProfileView from './components/admin/adminProfile/AdminProfileView';
import AddSlider from './components/admin/hero/AddSlider';
import Addinfo from './components/admin/hero/Addinfo';
import AddBrand from './components/admin/products/AddBrand';
import ViewBrand from './components/admin/products/ViewBrand';
import BrandSection from './components/user/body/BrandSection';
import BrandProductPage from './components/user/body/BrandProductPage';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCartItemsAsync, initializeCart } from './store/cartSlice';

import Branch from './components/user/body/Branch';
import AddBranch from './components/admin/dashboard/AddBranch';
import AddAboutUs from './components/admin/footer/AddAboutUs';
import PcPartView from './components/user/pcbuilder/PcPartView';
import CartCheckoutPage from './components/user/product/CartCheckOutPage';
import CCBuilderPage from './components/user/ccbuilder/CCBuilderPage';
import AddCCBuilder from './components/admin/systemBuild/AddCCBuilder';
import CCItemsDetailsAdd from './components/admin/systemBuild/CCItemsDetailsAdd';
import CComponentProductsPageCC from './components/user/ccbuilder/CComponentProductsPageCC'
import CCItemDetailsByItemPage from './components/user/ccbuilder/CCItemDetailsByItemPage';
import CCPartView from './components/user/ccbuilder/CCPartView';
import UpdateMegaMenu from './components/admin/products/UpdateMegaMenu';
import AddMedia from './components/admin/footer/AddMedia';
import AddContactUs from './components/admin/footer/AddContactUs';
import CartOrderConfirmation from './components/user/product/CartOrderConfirmation';
import EditProduct from './components/admin/products/EditProduct';
import CustomEmail from './components/admin/management/CustomEmail';
import CCBuilderViewItem from './components/admin/systemBuild/CCBuilderViewItem';
import EditCCItemDetails from './components/admin/systemBuild/EditCCItemDetails';
import EditPCPart from './components/admin/systemBuild/EditPCPart';
import ComplainForm from './components/user/footer/ComplainForm';
import AdminViewComplain from './components/admin/footer/AdminViewComplain';
import AddDesktop from './components/admin/products/static/AddDesktop';
import DesktopView from './components/user/static/desktop/DesktopView';
import DesktopViewPage from './components/user/static/desktop/DesktopViewPage';
import AddLaptop from './components/admin/products/static/AddLaptop';
import LaptopView from './components/user/static/laptop/LaptopView';
import LaptopViewPage from './components/user/static/laptop/LaptopViewPage';
import AddPrinter from './components/admin/products/static/AddPrinter';
import PrinterView from './components/user/static/printer/PrinterView';
import PrinterViewPage from './components/user/static/printer/PrinterViewPage';
import AddNetwork from './components/admin/products/static/AddNetwork';
import AddCamera from './components/admin/products/static/AddCamera';
import CameraViewPage from './components/user/static/camera/CameraViewPage';
import CameraView from './components/user/static/camera/CameraView';
import NetworkView from './components/user/static/network/NetworkView';
import NetworkViewPage from './components/user/static/network/NetworkViewPage';

function App() { 
  const dispatch = useDispatch();
  const { profile, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (profile?.id && profile?.email && token) {
      console.log("\n\n\n\n\n HERE");
      dispatch(fetchCartItemsAsync());
    } else {
      dispatch(initializeCart({ auth: { profile } }));
    }
  }, [dispatch, profile, token]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/desktops" element={<DesktopView />}/>
          <Route path="/laptops" element={<LaptopView />} />
          <Route path="/laptops/:productName" element={<LaptopView />} />
          <Route path="/laptops/accessories/:productItemName" element={<LaptopView />} />
          <Route path="/printers" element={<PrinterView />} />
          <Route path="/camera" element={<CameraView />} />
          <Route path="/network" element={<NetworkView/>} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/all-categories" element={<AllCategories />} />
          <Route path="/exclusive-offers" element={<ExclusiveOffer />} />
          <Route path="/news-media" element={<NewsMedia />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/brand" element={<BrandSection />} />
          <Route path="/product/:id" element={<ProductviewPage />} />
          {/* static data  */}
          <Route path="/desktop/:id" element={<DesktopViewPage />} />
          <Route path="/laptop/:id" element={<LaptopViewPage />} />
          <Route path="/printer/:id" element={<PrinterViewPage />} />
          <Route path="/camera/:id" element={<CameraViewPage />} />
          <Route path="/network/:id" element={<NetworkViewPage />} />
          {/* <Route path="wishlist" element={<WishlistPage />} /> */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/pc-builder" element={<PCBuilderPage />} />
          <Route path="/pc-builder/:categoryName" element={<ComponentProductsPage />} />
          <Route path="/pc-builder/pc-part/:id" element={<PcPartView />} />
          {/* cc builder */}
          <Route path="/cc-builder" element={<CCBuilderPage />} />
          <Route path="/cc-builder/:ccBuilderId/item-details" element={<CComponentProductsPageCC />} />
          <Route path="/cc-builder/item/:itemId/details" element={<CCItemDetailsByItemPage />} />
          <Route path="/cc-builder/item-details/:id" element={<CCPartView />} />
          <Route path="/brand/:id/products" element={<BrandProductPage />} />
          <Route path="/branch" element={<Branch />} />

          {/* About Routes */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/about-ceo" element={<AboutCEO />} />
          <Route path="/specialty" element={<Specialty />} />
          <Route path="/service-center" element={<ServiceCenter />} />
          <Route path="/complaint" element={<ComplainForm/>} />

          {/* User Protected Routes */}
          <Route element={<UserProtectedRoute />}>
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/cart-checkout" element={<CartCheckoutPage/>} />
            <Route path="/cart-order-confirmation" element={<CartOrderConfirmation />} />;
            <Route path="/view-orders" element={<UserOrders />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/add-slider" element={<AddSlider/>} />  
            <Route path="/admin/add-info" element={<Addinfo />} /> 
            <Route path="/admin/products/add-brand" element={<AddBrand />} />
            <Route path="/admin/products/view-brand" element={<ViewBrand />} /> 
            <Route path="/admin/view-profile" element={<AdminProfileView />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/add-branch" element={<AddBranch />} />
            <Route path="/admin/add-media" element={<AddMedia />} />
            <Route path="/admin/add-aboutus" element={<AddAboutUs />} /> 
            <Route path="/admin/add-contact-us" element={<AddContactUs />} /> 
            <Route path="/admin/products/add-category" element={<AddCategory />} />
            <Route path="/admin/products/update-categories" element={<UpdateMegaMenu />} />
            <Route path="/admin/products/view-product" element={<ViewProduct />} />
            <Route path="/admin/products/add-product" element={<AddProduct />} />
            <Route path="/admin/products/add-desktop" element={<AddDesktop />} />
            <Route path="/admin/products/add-laptop" element={<AddLaptop />} />
            <Route path="/admin/products/add-printer" element={<AddPrinter />} />
            <Route path="/admin/products/add-network" element={<AddNetwork />} />
            <Route path="/admin/products/add-camera" element={<AddCamera />} />
            <Route path="/admin/products/edit/:id" element={<EditProduct />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/customers" element={<CustomerManagement />} />
            <Route path="/admin/custom-email" element={<CustomEmail />} />
            <Route path="/admin/add-Pc-Builder" element={<PCBuilder />} />
            <Route path="/admin/add-cc-builder" element={<AddCCBuilder />} />
            <Route path="/admin/Pc-builder/ViewSystemBuilder" element={<ViewSystemBuilder />} />
            <Route path="/admin/add-cc-item-details" element={<CCItemsDetailsAdd />} />
            <Route path="/admin/view-cc-item-details" element={<CCBuilderViewItem />} />
            <Route path="/admin/edit-cc-item-details/:id" element={<EditCCItemDetails />} />
            <Route path="/admin/edit-pc-part/:id" element={<EditPCPart />} />
            <Route path="/admin/view-complain" element={<AdminViewComplain />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
