import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signup = createAsyncThunk(
  "signup/signupUser",
  async ({ fname, lname, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "api/users/register/",
        {
          fname: fname,
          lname: lname,
          email: email,
          password: password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userInfo = payload;
      })
      .addCase(signup.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default signupSlice.reducer;
