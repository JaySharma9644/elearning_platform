"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { toast } from "react-toastify";
import { customer_logout, messageClear } from "@/lib/reducers/authReducer";
const Header: React.FC = () => {
  const [currentNav, setCurrentNav] = useState<string>("");

  const { currentUser, isLoggedIn, loader} =
    useAppSelector((state: any) => state.auth);

  const dispatch = useAppDispatch();


  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link
              key="/"
              onClick={(e) => setCurrentNav("/")}
              href="/"
              className="text-xl font-bold text-indigo-600"
            >
              E-Learning Platform
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              key="/courses"
              onClick={(e) => setCurrentNav("/courses")}
              href="/courses"
              className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500"
            >
              Courses
            </Link>
            <Link
              key="/dashboard"
              onClick={(e) => setCurrentNav("/dashboard")}
              href="/dashboard"
              className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500"
            >
              Dashboard
            </Link>
            {!isLoggedIn ? (
              <Link
                href="/auth/login"
                key="/login"
                onClick={(e) => setCurrentNav("/login")}
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500"
              >
                Login
              </Link>
            ) : (
              <div
                
                onClick={(e) => dispatch(customer_logout({}))}
                className="text-gray-900 inline-flex cursor-pointer items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500"
              >
                Logout
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
