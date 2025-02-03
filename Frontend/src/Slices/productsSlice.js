// import { fetchProducts as apiFetchProducts } from "../utils/API";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const fetchProducts = createAsyncThunk(
//   "products/fetchProducts",
//   async () => {
//     return await apiFetchProducts();
//   }
// );

// const initialState = {
//   products: [],
//   loading: false,
//   error: null,
// };

// export const productsSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload;
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default productsSlice.reducer;

// import axios from "axios";



// import {

//   fetchProducts as apiFetchProducts,
//   fetchNewProducts as apiFetchNewProducts,
// } from "../utils/API";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const fetchProducts = createAsyncThunk(
//   "products/fetchProducts",
//   async () => {
//     return await apiFetchProducts();
//   }
// );
// // export const fetchNewProducts = createAsyncThunk(
// //   "new_products/fetchNewProducts",
// //   async () => {
// //     const response = await axios.get("/new_products");
// //     return response.data;
// //   }
// // );
// export const fetchNewProducts = createAsyncThunk(
//   "new_products/fetchNewProducts",
//   async () => {
//     return await apiFetchNewProducts();
//   }
// );

// const initialState = {
//   products: [],
//   loading: false,
//   error: null,
// };

// export const productsSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload;
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(fetchNewProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchNewProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload;
//       })
//       .addCase(fetchNewProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default productsSlice.reducer;

import axios from 'axios'
import { fetchProducts as apiFetchProducts, fetchNewProducts as apiFetchNewProducts } from "../utils/API";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to fetch products based on filters
/*export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters) => {
    const queryString = new URLSearchParams(filters).toString();
   // const response = await fetch(`/api/products/?${queryString}`);
    const response = await fetch(`/products/?${queryString}`);
    return await response.json();
  }
);*/
// export const fetchProducts = createAsyncThunk(
//   "products/fetchProducts",
//   async () => {
//     const response = await apiFetchProducts();  // Pass filters to the API
//     return response.data;
//     console.log(response.data)
//   }
// );
export const fetchProducts = async (filters) => {
  try {
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v)
    );
    const queryString = new URLSearchParams(validFilters).toString();
    console.log("Fetching products with query:", queryString);
    
    const response = await API.get(`/products/?${queryString}`);
    console.log("Response Data:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Fetch Products Error:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchNewProducts = createAsyncThunk(
  "new_products/fetchNewProducts",
  async () => {
    return await apiFetchNewProducts();
  }
);

const initialState = {
  products: [],
  filters: {
    gender: "",
    category: "",
    min_price: "",
    max_price: "",
    new_arrivals: false,
  },
  loading: false,
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchNewProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchNewProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters } = productsSlice.actions;
export default productsSlice.reducer;
