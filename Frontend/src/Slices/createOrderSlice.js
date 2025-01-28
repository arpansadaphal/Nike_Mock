import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Asynchronous action to create an order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { getState, rejectWithValue }) => {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      const { data } = await axios.post("/api/orders/", orderData, config);
      console.log(orderData); // Debugging API response
      return data; // Returns the created order data
    } catch (error) {
      console.error("Error creating order:", error);
      return rejectWithValue(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message || "An error occurred during order creation."
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null, // Initially set to null
    loading: false,
    error: null,
  },
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
