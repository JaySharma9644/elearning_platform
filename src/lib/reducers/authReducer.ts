import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const customer_registration = createAsyncThunk(
  "auth/register",
  async (
    info: { name: string; password: string; email: string },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData
        );
      }
      const data = await response.json();
      localStorage.setItem("customerToken", data.token);
      return fulfillWithValue(data);
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);
export const customer_login = createAsyncThunk(
  "auth/login",
  async (
    info: { password: string; email: string },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
     

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData
        );
      }
      const data = await response.json();
      localStorage.setItem("customerToken", data.token);
      return fulfillWithValue(data);
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);
export const customer_logout = createAsyncThunk(
  "auth/logout",
  async (_: {}, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
     
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData
        );
      }
      const data = await response.json();
      localStorage.removeItem("customerToken");
      return fulfillWithValue(data);
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

export interface IAuth {
  currentUser: {};
  isLoggedIn: boolean;
  loader: boolean;
  errorMessage: string;
  successMessage: string;
}
const initialState: IAuth = {
  currentUser: {},
  isLoggedIn: false,
  loader: false,
  errorMessage: "",
  successMessage: "",
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state, _) => {
      state.currentUser = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(customer_registration.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(customer_registration.rejected, (state, { error }) => {
        state.errorMessage =   "Registration Failed";
        state.loader = false;
      })
      .addCase(customer_registration.fulfilled, (state, { payload }) => {
        state.currentUser = "";

        state.successMessage = payload?.message || "Registration successful";
        state.errorMessage = "";

        state.isLoggedIn = true;
        state.loader = false;
      })
      .addCase(customer_login.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(customer_login.rejected, (state, { error }) => {
        state.errorMessage = "Login Failed";
        state.loader = false;
      })
      .addCase(customer_login.fulfilled, (state, { payload }) => {
        state.currentUser = "";

        state.successMessage = payload?.message || "Login successful";
        state.errorMessage = "";

        state.isLoggedIn = true;
        state.loader = false;
      })
      .addCase(customer_logout.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(customer_logout.rejected, (state, { error }) => {
        state.errorMessage =   "Logout Failed";
        state.loader = false;
        state.isLoggedIn = true;
      })
      .addCase(customer_logout.fulfilled, (state, { payload }) => {
        state.currentUser = "";

        state.successMessage = "Logout successful";
        state.errorMessage = "";

        state.isLoggedIn = false;
        state.loader = false;
      });
  },
});
export const { messageClear, user_reset } = authSlice.actions;
export const authReducer = authSlice.reducer;
