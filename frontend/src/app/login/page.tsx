'use client';

import React from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fcfcfc] to-[#f0f4ff] px-4">
      <div className="flex flex-col md:flex-row items-center max-w-4xl bg-white shadow-md rounded-2xl overflow-hidden w-full">
        {/* Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center p-8 bg-white">
          <Image
            src="/illustration.png" // Put your illustration in the /public folder
            alt="Login Illustration"
            width={250}
            height={250}
          />
        </div>

        {/* Form */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-6">Please login to your account</p>

          <form className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Your Email"
              className="border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="password"
              placeholder="Your Password"
              className="border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition"
            >
              Login
            </button>
          </form>

          <div className="my-4 flex items-center justify-center">
            <div className="border-t w-full mr-2"></div>
            <span className="text-gray-400">or</span>
            <div className="border-t w-full ml-2"></div>
          </div>

          <button className="flex items-center justify-center gap-3 border py-3 w-full rounded-md hover:bg-gray-50 transition">
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </button>

          <p className="text-sm text-center mt-6">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-orange-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
