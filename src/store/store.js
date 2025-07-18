import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import wishlistReducer from "./wishlistSlice";
import compareReducer from "./compareSlice";
import categoryReducer from "./categorySlice";
import pcBuilderReducer from "./pcbuilderSlice";
import heroReducer from "./heroSlice";
import infoReducer from "./infoSlice";
import { brandReducer } from "./brandSlice";
import branchReducer from "./branchSlice";
import ccbuilderReducer from './ccbuilderSlice';
import aboutUsReducer from './aboutUsSlice';
import mediaReducer from './mediaSlice';
import contactUsReducer from './contactUsSlice';
import filterReducer from './filterSlice';
import desktopReducer from'../store/static/desktopSlice';
import allfilterReducer from '../store/filters/allfilterSlice';
import laptopReducer from '../store/static/laptopSlice';
import printerReducer from '../store/static/printerSlice';
import networkReducer from '../store/static/networkSlice';
import cameraReducer from '../store/static/cameraSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    brands: brandReducer,
    categories: categoryReducer,
    pcBuilder: pcBuilderReducer,
    hero: heroReducer,
    info: infoReducer,
    branch: branchReducer, 
    ccBuilder: ccbuilderReducer, 
    aboutUs: aboutUsReducer,
    media: mediaReducer,
    contactUs: contactUsReducer,
    filter: filterReducer,
    desktops: desktopReducer,
    laptops: laptopReducer,
    allfilter: allfilterReducer,
    printers: printerReducer,
    networks: networkReducer,
    cameras: cameraReducer,
  },
});
