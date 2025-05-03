"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import { customer_login, messageClear } from "@/lib/reducers/authReducer";

const Login: React.FC = () => {
  const [state, setState] = useState({ password: "", email: "" });
  const dispatch = useAppDispatch();
  const { currentUser, isLoggedIn, loader, errorMessage, successMessage } =
    useAppSelector((state: any) => state.auth);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear(""));
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear(""));
    }
  });

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.id]: event.target.value });
  };

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(customer_login(state));
    } catch (err) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container flex w-[100%] h-[80vh] justify-center items-center">
      <div className="login-form bg-white w-[350px] h-[400px] rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center p-4">Log In</h2>

        <form
          className="flex flex-col gap-6 justify-center items-center p-4"
          onSubmit={loginHandler}
        >
          <div className="w-[100%]">
            <input
              type="email"
              id="email"
              value={state.email}
              onChange={changeHandler}
              className="border-2 border-gray-300 rounded-md p-2 w-[100%]"
              placeholder="Email"
            />
          </div>
          <div className="w-[100%]">
            <input
              type="password"
              id="password"
              value={state.password}
              onChange={changeHandler}
              className="border-2 border-gray-300 rounded-md p-2 w-[100%]"
              placeholder="Password"
            />
          </div>
          <div>
            <button
              disabled={loader || state.email == "" || state.password == ""}
              type="submit"
              className={` ${
                loader ? "opacity-50 cursor-not-allowed" : ""
              } border-2 border-gray-300 rounded-md p-2 cursor-pointer bg-indigo-600 text-white`}
            >
              Log In
            </button>
          </div>
          <div>
            <p className="text-center text-sm text-gray-500">
              
              Not Registered? <Link href="/auth/register">Sign up</Link>
            </p>
          </div>
          <div>
            <p className="text-center text-sm text-gray-500">
              
              <Link href="/auth/forgot_password">Forgot Password</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
