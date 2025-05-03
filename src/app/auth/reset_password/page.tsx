"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import {
  customer_reset_password,
  messageClear,
} from "@/lib/reducers/authReducer";
import { useAppDispatch, useAppSelector } from "@/lib/store";

const ResetPassword: React.FC = () => {
  const searchParams = useSearchParams();
  let token = searchParams.get("reference") || "";  
 
  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
    token:token,
  });
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

  const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.password != state.confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
    try {
      dispatch(customer_reset_password(state));
    } catch (err) {
      setIsLoading(false);
      toast.error("Password  failed");
    }
  };

  return (
    <div className="login-container flex w-[100%] h-[80vh] justify-center items-center">
      <div className="login-form bg-white w-[350px] h-[400px] rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center p-4">Change Password</h2>
       
        <form
          className="flex flex-col gap-6 justify-center items-center p-4"
          onSubmit={registerHandler}
        >
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
          <div className="w-[100%]">
            <input
              type="password"
              id="confirmPassword"
              value={state.confirmPassword}
              onChange={changeHandler}
              className="border-2 border-gray-300 rounded-md p-2 w-[100%]"
              placeholder="Confirm Password"
            />
          </div>
          <div>
            <button
              disabled={
                state.confirmPassword == "" ||
                state.password == "" ||
                state.password != state.confirmPassword ||
                isLoading
              }
              type="submit"
              className={` ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }  border-2 border-gray-300 rounded-md p-2 cursor-pointer bg-indigo-600 text-white`}
            >
              {isLoading ? "Wait ....." : "Change  Password"}
            </button>
          </div>
          <div></div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
