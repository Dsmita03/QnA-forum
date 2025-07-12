"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useNavigate } from "react-router";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const setUser = useAppStore((state) => state.setUser);
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/signup",
                {
                    email,
                    password,
                    role,
                },
                {
                    withCredentials: true,
                }
            );

            if (res.status === 201) {
                console.log(res.data);
                const data=res.data.user
                setUser({
                    userId: data.id,
                    role: data.role,
                    isLoggedIn: true,
                })
                router.push("/");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fcfcfc] to-[#f0f4ff] px-4">
            <div className="flex flex-col md:flex-row items-center max-w-4xl bg-white shadow-md rounded-2xl overflow-hidden w-full">
                {/* Illustration */}
                <div className="hidden md:flex flex-col justify-center items-center p-8 bg-white">
                    <Image
                        src="/illustration.png"
                        alt="Illustration"
                        width={250}
                        height={250}
                    />
                </div>

                {/* Form */}
                <div className="flex-1 p-8">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        StackIt
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Please sign up to continue
                    </p>

                    <form
                        className="flex flex-col space-y-4"
                        onSubmit={handleSignup}
                    >
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                            type="password"
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />

                        {/* Role Selection */}
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
                        >
                            <option value="guest">Guest</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>

                    {error && (
                        <p className="text-sm text-red-500 mt-2">{error}</p>
                    )}

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
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-orange-500 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
