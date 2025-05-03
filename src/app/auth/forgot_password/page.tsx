"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { customer_forgot_password, messageClear } from "@/lib/reducers/authReducer";

const ForgotPassword: React.FC = () => {
  const [state, setState] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
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

  const resetHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(customer_forgot_password(state));
    } catch (err) {
      toast.error("Password Reset failed. Please try again.");
    }
  };

  return (
    <div className="login-container flex w-[100%] h-[80vh] justify-center items-center">
      <div className="login-form bg-white w-[350px] h-[400px] rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center p-4">Reset Password</h2>

        <form
          className="flex flex-col gap-6 justify-center items-center p-4"
          onSubmit={resetHandler}
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

          <div>
            <button
              disabled={state.email == ""}
              type="submit"
              className={` ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }  border-2 border-gray-300 rounded-md p-2 cursor-pointer bg-indigo-600 text-white`}
            >
              {isLoading ? "Wait..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
