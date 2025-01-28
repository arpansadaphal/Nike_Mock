import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../Slices/productsSlice";
import productReducer from "../Slices/productSlice";
import loginReducer from "../Slices/loginSlice";
import signupReducer from "../Slices/signupSlice";
import cartReducer from "../Slices/cartSlice";
import orderReducer from "../Slices/createOrderSlice";
// import razorPayOrderReducer from "../Slices/razorPaySlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    product: productReducer,
    userLogin: loginReducer,
    userSignup: signupReducer,  
    cart: cartReducer,
    order: orderReducer,
    // razorPay: razorPayOrderReducer,
  },
});
