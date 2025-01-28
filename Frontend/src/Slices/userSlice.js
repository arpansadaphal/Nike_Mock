import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "user/login",
  async ({ email, pass1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "api/users/login",
        { email: email, pass1: pass1 },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);
export const signup = createAsyncThunk(
  "user/signup",
  async ({ fname, lname, email, pass1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "api/users/register",
        { fname: fname, lname: lname, email: email, pass1: pass1 },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userInfo");
      state.userInfo = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        (state.loading = false), (state.userInfo = payload);
      })
      .addCase(login.rejected, (state, { payload }) => {
        (state.loading = true), (state.error = payload);
      })
      .addCase(signup.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        (state.loading = false), (state.userInfo = payload);
      })
      .addCase(signup.rejected, (state, { payload }) => {
        (state.loading = true), (state.error = payload);
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
