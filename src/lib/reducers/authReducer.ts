"use client";
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
export const customer_forgot_password = createAsyncThunk(
  "auth/forgot_password",
  async (
    info: { email: string },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await fetch("/api/auth/forgot_password", {
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
      return fulfillWithValue(data);
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);
export const customer_reset_password = createAsyncThunk(
  "auth/reset_password",
  async (
    info: { password:string,confirmPassword:string, token:string},
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await fetch("/api/auth/reset_password", {
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
      return fulfillWithValue(data);
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);
export interface IAuth {
  currentUser:any ;
  loader: boolean;
  errorMessage: string;
  successMessage: string;
  token: string;
}
const initialState: IAuth = {
  currentUser:'',
  loader: false,
  errorMessage: "",
  successMessage: "",
  token: typeof window === "undefined" ? "" : (localStorage.getItem("customerToken") ?? ""),
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
      // registration
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
        state.token = payload.token;  

        state.loader = false;
      })
      // login
      .addCase(customer_login.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(customer_login.rejected, (state, { error }) => {
        state.errorMessage = "Login Failed";
        state.loader = false;
      })
      .addCase(customer_login.fulfilled, (state, { payload }) => {
        state.currentUser = payload.user || {};
        state.successMessage = payload?.message || "Login successful";
        state.errorMessage = "";
        state.token = payload.token;  
      
        state.loader = false;
      })
      // logout
      .addCase(customer_logout.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(customer_logout.rejected, (state, { error }) => {
        state.errorMessage =   "Logout Failed";
        state.loader = false;
        
      })
      .addCase(customer_logout.fulfilled, (state, { payload }) => {
        state.currentUser = "";
        state.successMessage = "Logout successful";
        state.errorMessage = "";
        state.loader = false;
      })
      // forgot password
      .addCase(customer_forgot_password.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(customer_forgot_password.rejected, (state, { error }) => {
        state.errorMessage =  "Password Reset Failed";
        state.loader = false;
        
      })
      .addCase(customer_forgot_password.fulfilled, (state, { payload }) => {
        state.currentUser = "";
        state.successMessage = "You will receive a Password rest Link email shortly";
        state.errorMessage = "";
        state.loader = false;
      })
      // reset password
      .addCase(customer_reset_password.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(customer_reset_password.rejected, (state, { error }) => {
        state.errorMessage =  "Password Reset Failed";
        state.loader = false;
        
      })
      .addCase(customer_reset_password.fulfilled, (state, { payload }) => {
        state.currentUser = "";
        state.successMessage = "Password Reset successful !";
        state.errorMessage = "";
        state.loader = false;
      });
  },
});
export const { messageClear, user_reset } = authSlice.actions;
export const authReducer = authSlice.reducer;
