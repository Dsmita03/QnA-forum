/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"user" | "admin">("user");
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
                "https://qna-forum.onrender.com/api/auth/signup",
                {
                    name,
                    email,
                    password,
                    role,
                },
                {
                    withCredentials: true,
                }
            );

            if (res.status === 201) {
                const data = res.data.user;

                // Set user in store with the updated interface
                setUser({
                    userId: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    isLoggedIn: true,
                });

                // Role-based redirect
                if (data.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/home");
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 px-4 py-8">
            <div className="flex flex-col lg:flex-row items-center max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden w-full">
                {/* Illustration Section */}
                <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-orange-500 to-amber-600 text-white lg:w-1/2">
                    <Image
                        src="/illustration.png"
                        alt="Illustration"
                        width={300}
                        height={300}
                        className="mb-6"
                    />
                    <h3 className="text-2xl font-bold mb-2">
                        Welcome to StackIt
                    </h3>
                    <p className="text-orange-100 text-center text-sm">
                        Join our community and start building amazing things
                        together
                    </p>
                </div>

                {/* Form Section */}
                <div className="flex-1 p-8 lg:p-12 lg:w-1/2">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-600">
                            Please fill in your details to get started
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                User Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Account Type
                            </label>
                            <select
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value as "user" | "admin")
                                }
                                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 bg-white"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
