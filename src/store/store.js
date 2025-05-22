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
  },
});
