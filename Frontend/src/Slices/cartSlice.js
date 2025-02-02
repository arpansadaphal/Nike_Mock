import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, qty }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`https://nike-mock.onrender.com/api/product/${id}`);
      return {
        product: data._id,
        productname: data.productname,
        price: data.price,
        image: data.main_image, // Ensure main image is fetched correctly
        qty,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateCartQuantity: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.cartItems.find((item) => item.product === productId);
      if (item) {
        item.qty = qty; // Replace the old quantity with the new one
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const existingItem = state.cartItems.find(
          (item) => item.product === action.payload.product
        );
        if (existingItem) {
          existingItem.qty = action.payload.qty; // Overwrite the existing qty
        } else {
          state.cartItems.push(action.payload);
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const { removeFromCart, updateCartQuantity } = cartSlice.actions;
export default cartSlice.reducer;
