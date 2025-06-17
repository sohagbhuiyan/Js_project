import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard,
  AddBox,
  ViewList,
  ShoppingCart,
  People,
  Payment,
  Category,
  BuildCircleRounded,
  ListAlt,
  BuildCircleTwoTone,
  AddAPhoto,
  Info,
  BrandingWatermarkRounded,
  AddBoxSharp,
} from "@mui/icons-material";
import { Box } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const [isProductAddOpen, setIsProductAddOpen] = useState(false);
  const [isSystemBuilderOpen, setIsSystemBuilderOpen] = useState(false);

  const isActive = (path) => location.pathname === `/${path}`;

  const toggleProductAdd = () => {
    setIsProductAddOpen(!isProductAddOpen);
  };

  const toggleSystemBuilder = () => {
    setIsSystemBuilderOpen(!isSystemBuilderOpen);
  };

  return (
    <div
      className="w-50 bg-gray-800 text-white min-h-screen p-1"
      style={{ maxHeight: "calc(100vh - 16px)" }}
    >
      <h1 className="text-xl text-gray-400 p-3 mb-2">Admin Panel</h1>
      <ul className="space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 70px)" }}>
        {/* Dashboard */}
        <li>
          <Link
            to="/admin/dashboard"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/dashboard") ? "bg-gray-700 text-blue-400" : "hover:text-gray-400"
            }`}
          >
            <Dashboard className="mr-2" /> Dashboard
          </Link>
        </li>
        {/* Add Slider Image */}
        <li>
          <Link
            to="/admin/add-slider"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/add-slider") ? "bg-gray-700 text-blue-400" : "hover:text-gray-400"
            }`}
          >
            <AddAPhoto className="mr-2" /> Add Slider
          </Link>
        </li>
        <li>
          <Link
            to="/admin/add-info"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/add-info") ? "bg-gray-700 text-blue-400" : "hover:text-gray-400"
            }`}
          >
            <Info className="mr-2" /> Add Info
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products/add-brand"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/products/add-brand")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <BrandingWatermarkRounded className="mr-2" /> Add Brand
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products/view-brand"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/products/view-brand")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <BrandingWatermarkRounded className="mr-2" /> View Brand
          </Link>
        </li>
        {/* Categories and Products */}
        <li>
          <Link
            to="/admin/products/add-category"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/products/add-category")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <Category className="mr-2" /> Add Category
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products/update-categories"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/products/view-categories")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <ListAlt className="mr-2" /> View Categories
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products/view-product"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/products/view-product")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <ViewList className="mr-2" /> View Product
          </Link>
        </li>
        {/* Product Add Section */}
        <li>
          <div
            className="flex items-center p-2 rounded-md cursor-pointer hover:text-gray-400"
            onClick={toggleProductAdd}
          >
            <AddBox className="mr-2" /> Product Add
            <span className="ml-auto">{isProductAddOpen ? "▲" : "▼"}</span>
          </div>
          {isProductAddOpen && (
            <ul className="pl-6 space-y-2">
              <li>
                <Link
                  to="/admin/products/add-product"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("admin/products/add-product")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <AddBox className="mr-2" /> ALL Product
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products/add-desktop"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("admin/products/add-desktop")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <AddBox className="mr-2" /> Add Desktop
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products/add-laptop"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("admin/products/add-laptop")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <AddBox className="mr-2" /> Add Laptop
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products/add-printer"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("admin/products/add-printer")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <AddBox className="mr-2" /> Add Printer
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products/add-camera"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("admin/products/add-camera")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <AddBox className="mr-2" /> Add Camera
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products/add-network"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("admin/products/add-network")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <AddBox className="mr-2" /> Add Network
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link
            to="/admin/add-branch"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/add-branch")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <AddBoxSharp className="mr-2" /> Add Branch
          </Link>
        </li>
        <li>
          <Link
            to="/admin/add-media"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/add-media")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <AddBoxSharp className="mr-2" /> Add Media
          </Link>
        </li>
        <li>
          <Link
            to="/admin/add-aboutus"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/add-aboutus")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <AddBoxSharp className="mr-2" /> About Us Add
          </Link>
        </li>
        <li>
          <Link
            to="/admin/add-contact-us"
            className={`flex items-center p-2 rounded-md ${
              isActive("/admin/add-contact-us")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <AddBoxSharp className="mr-2" /> Add Contact US
          </Link>
        </li>
        {/* Orders */}
        <li>
          <Link
            to="/admin/orders"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/orders") ? "bg-gray-700 text-blue-400" : "hover:text-gray-400"
            }`}
          >
            <ShoppingCart className="mr-2" /> Orders
          </Link>
        </li>
        {/* Customers */}
        <li>
          <Link
            to="/admin/customers"
            className={`flex items-center p-2 rounded-md ${
              isActive("admin/customers") ? "bg-gray-700 text-blue-400" : "hover:text-gray-400"
            }`}
          >
            <People className="mr-2" /> Customers
          </Link>
        </li>
        {/* Payments */}
        <li>
          <Link
            to="/admin/custom-email"
            className={`flex items-center p-2 rounded-md ${
              isActive("/admin/custom-email") ? "bg-gray-700 text-blue-400" : "hover:text-gray-400"
            }`}
          >
            <Payment className="mr-2" /> Custom Email 
          </Link>
        </li>
        {/* System Builder Section */}
        <li>
          <div
            className="flex items-center p-2 rounded-md cursor-pointer hover:text-gray-400"
            onClick={toggleSystemBuilder}
          >
            <BuildCircleRounded className="mr-2" /> System Builder 
            <span className="ml-auto">{isSystemBuilderOpen ? "▲" : "▼"}</span>
          </div>
          {isSystemBuilderOpen && (
            <ul className="pl-6 space-y-2">
              <li>
                <Link
                  to="/admin/add-Pc-Builder"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("/admin/add-Pc-Builder")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <BuildCircleRounded className="mr-2" /> Add PC Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/add-cc-builder"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("/admin/add-cc-builder")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <BuildCircleRounded className="mr-2" /> Add CC Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/add-cc-item-details"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("/admin/add-cc-item-details")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <BuildCircleRounded className="mr-2" /> Add CC Item Details
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/Pc-builder/ViewSystemBuilder"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("admin/Pc-builder/ViewSystemBuilder")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <BuildCircleTwoTone className="mr-2" /> View PC-Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/view-cc-item-details"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("/admin/view-cc-item-details")
                      ? "bg-gray-700 text-blue-400"
                      : "hover:text-gray-400"
                  }`}
                >
                  <BuildCircleTwoTone className="mr-2" /> View CC-Builder
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link
            to="/admin/view-complain"
            className={`flex items-center p-2 rounded-md ${
              isActive("/admin/view-complain")
                ? "bg-gray-700 text-blue-400"
                : "hover:text-gray-400"
            }`}
          >
            <Box className="mr-2" /> View Complain
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
