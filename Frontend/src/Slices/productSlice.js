import API from "../utils/API";
// import { fetchProductById as apiFetchProducts } from "../utils/API";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    if (!id) return rejectWithValue("Product ID is missing");
    const response = await API.get(`/product/${id}`);
    return response.data;
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
