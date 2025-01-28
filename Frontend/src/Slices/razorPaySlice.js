// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import getCSRFToken from "../utils/csrf";

// const config = {
//   headers: {
//     "Content-Type": "application/json",
//     "X-CSRFToken": getCSRFToken(), // Add the CSRF token
//   },
// };
// // Asynchronous action to create a Razorpay order
// export const createRazorpayOrder = createAsyncThunk(
//   "order/createRazorpayOrder",
//   async (orderDetails, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post(
//         "/api/create_razorpay_order/",
//         orderDetails,
//         config
//       );
//       return data; // Returns Razorpay order details from the backend
//     } catch (error) {
//       return rejectWithValue(
//         error.response && error.response.data.error
//           ? error.response.data.error
//           : error.message || "An error occurred while creating Razorpay order."
//       );
//     }
//   }
// );

// const razorpaySlice = createSlice({
//   name: "razorpay",
//   initialState: {
//     razorpayOrder: null, // Razorpay order details
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     resetRazorpayOrder: (state) => {
//       state.razorpayOrder = null;
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createRazorpayOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createRazorpayOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.razorpayOrder = action.payload; // Razorpay order details
//       })
//       .addCase(createRazorpayOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload; // Error message
//       });
//   },
// });

// export const { resetRazorpayOrder } = razorpaySlice.actions;
// export default razorpaySlice.reducer;
