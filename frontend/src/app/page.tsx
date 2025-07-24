/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Navbar from "@/components/navbar";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
    Search,
    Plus,
    Filter,
    TrendingUp,
    Clock,
    Eye,
    MessageSquare,
    Users,
} from "lucide-react";

type Question = {
    id: string;
    title: string;
    answersCount: number;
    tags: string[];
    username: string;
    createdAt: string;
    views: number;
};

export default function Home() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalAnswers: 0,
        totalUsers: 0,
        todayQuestions: 0,
    });
    const [totalAnswers, setTotalAnswers] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5001/api/answers/count"
                );
                console.log("🔹 Answer count:", res.data);
                setTotalAnswers(res.data); // 👈 assuming { count: number }
            } catch (err) {
                console.error("❌ Failed to fetch answers:", err);
            }
        };

        fetchAnswers();
    }, []);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5001/api/auth/count"
                );
                console.log("🔹 User count:", res.data);
                setTotalUsers(res.data); // 👈 assuming { count: number }
            } catch (err) {
                console.error("❌ Failed to fetch users:", err);
            }
        };

        fetchUsers();
    },[])
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    "http://localhost:5001/api/questions"
                );
                console.log("🔹 Questions:", res.data);

                const formatted = res.data.map((q: any) => ({
                    id: q._id,
                    title: q.title,
                    answersCount: q.answers ? q.answers.length : 0,
                    tags: q.tags || [],
                    username: q.user.email || "anonymous",
                    createdAt: q.createdAt,
                    views: q.views || 0,
                }));

                setQuestions(formatted);

                const todayQuestions = formatted.filter(
                    (q: { createdAt: string | number | Date }) =>
                        new Date(q.createdAt).toDateString() ===
                        new Date().toDateString()
                ).length;

                setStats({
                    totalQuestions: formatted.length,
                    totalAnswers, // 👈 use from API
                    totalUsers: totalUsers,
                    todayQuestions,
                });
            } catch (err) {
                console.error("❌ Failed to fetch questions:", err);
            } finally {
                setLoading(false);
            }
        };

        // 🧠 only fetch questions when totalAnswers is ready
        if (totalAnswers !== 0 || totalAnswers === 0 || totalUsers !== 0) {
            // if you want to run this regardless of count being 0 or more
            fetchQuestions();
        }
    }, [totalAnswers]); // 👈 dependency

    // Filter questions based on search term
    const filteredQuestions = questions.filter((question) => {
        if (!searchTerm.trim()) return true;

        const searchLower = searchTerm.toLowerCase();
        return (
            question.title.toLowerCase().includes(searchLower) ||
            question.tags.some((tag) =>
                tag.toLowerCase().includes(searchLower)
            ) ||
            question.username.toLowerCase().includes(searchLower)
        );
    });

    // Sort filtered questions
    const sortedQuestions = [...filteredQuestions].sort((a, b) => {
        switch (sortBy) {
            case "popular":
                return b.answersCount - a.answersCount;
            case "newest":
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            case "oldest":
                return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );
            case "most-viewed":
                return b.views - a.views;
            case "alphabetical":
                return a.title.localeCompare(b.title);
            case "unanswered":
                if (a.answersCount === 0 && b.answersCount > 0) return -1;
                if (a.answersCount > 0 && b.answersCount === 0) return 1;
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            default:
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
        }
    });

    const sortOptions = [
        { value: "latest", label: "Latest", icon: Clock },
        { value: "newest", label: "Newest", icon: TrendingUp },
        { value: "oldest", label: "Oldest", icon: Clock },
        { value: "popular", label: "Most Popular", icon: TrendingUp },
        { value: "most-viewed", label: "Most Viewed", icon: Eye },
        { value: "alphabetical", label: "A-Z", icon: Filter },
        { value: "unanswered", label: "Unanswered", icon: MessageSquare },
    ];

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">
                                Loading questions...
                            </p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 min-h-screen">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats.totalQuestions}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Questions
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats.totalAnswers}
                                </p>
                                <p className="text-sm text-gray-600">Answers</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats.totalUsers}
                                </p>
                                <p className="text-sm text-gray-600">Users</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats.todayQuestions}
                                </p>
                                <p className="text-sm text-gray-600">Today</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Header */}
                <header className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Explore Questions
                            </h1>
                            <p className="text-gray-600">
                                Discover knowledge, ask questions, and share
                                your expertise with the community
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search questions, tags, or users..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 w-full sm:w-80 bg-white border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl"
                                />
                            </div>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {sortOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="rounded-lg"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <IconComponent className="w-4 h-4" />
                                                    <span>{option.label}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            <Link href="/add-questions">
                                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ask Question
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Search Results Info */}
                {searchTerm.trim() && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-orange-800 text-sm font-medium">
                                {filteredQuestions.length > 0
                                    ? `Found ${
                                          filteredQuestions.length
                                      } result${
                                          filteredQuestions.length !== 1
                                              ? "s"
                                              : ""
                                      } for "${searchTerm}"`
                                    : `No results found for "${searchTerm}"`}
                            </p>
                            {filteredQuestions.length === 0 && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="text-orange-600 hover:text-orange-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-orange-100 transition-colors"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Questions Section */}
                <section className="space-y-4">
                    {sortedQuestions.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {searchTerm.trim()
                                        ? "Search Results"
                                        : "All Questions"}
                                    <span className="text-sm font-normal text-gray-500 ml-2">
                                        ({sortedQuestions.length}{" "}
                                        {sortedQuestions.length === 1
                                            ? "question"
                                            : "questions"}
                                        )
                                    </span>
                                </h2>
                            </div>

                            <div className="grid gap-4">
                                {sortedQuestions.map((q) => (
                                    <QuestionCard
                                        key={q.id}
                                        id={q.id}
                                        title={q.title}
                                        answersCount={q.answersCount}
                                        tags={q.tags}
                                        username={q.username}
                                        createdAt={q.createdAt}
                                        views={q.views}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-orange-100">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {searchTerm.trim()
                                        ? "No questions found"
                                        : "No questions yet"}
                                </h3>
                                <p className="text-gray-600 text-sm mb-6">
                                    {searchTerm.trim()
                                        ? "Try different search terms or ask a new question to get the conversation started!"
                                        : "Be the first to ask a question and help build this community!"}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    {searchTerm.trim() && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setSearchTerm("")}
                                            className="border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl"
                                        >
                                            Clear Search
                                        </Button>
                                    )}
                                    <Link href="/add-questions">
                                        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Ask Question
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
