"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
    Flag,
    Eye,
    Check,
    X,
    User,
    MessageSquare,
    Filter,
    Search,
    AlertTriangle,
    Shield,
    Calendar,
    Clock,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface FlaggedItem {
    id: string;
    type: "question";
    title: string;
    content: string;
    author: string;
    authorEmail: string;
    reportedBy: string;
    reason: string;
    category: "spam" | "inappropriate" | "harassment" | "copyright" | "other";
    status: "pending" | "reviewed" | "dismissed";
    createdAt: string;
    reportedAt: string;
    tags?: string[];
    originalUrl: string;
}

export default function AdminReviewFlagsPage() {
    const [flags, setFlags] = useState<FlaggedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        reviewed: 0,
        dismissed: 0,
    });

    // Loading and error states for actions
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
        {}
    );
    const [error, setError] = useState<string | null>(null);
    const [confirmingAction, setConfirmingAction] = useState<{
        flagId: string;
        action: "approve" | "dismiss";
        title: string;
    } | null>(null);

    const itemsPerPage = 10;

    useEffect(() => {
        fetchFlags();
    }, []);

    const fetchFlags = async () => {
        try {
            const response = await axios.get(
                "https://qna-forum.onrender.com/api/reports/admin/flags",
                {
                    withCredentials: true,
                }
            );
            setFlags(response.data);

            const total = response.data.length;
            const pending = response.data.filter(
                (f: FlaggedItem) => f.status === "pending"
            ).length;
            const reviewed = response.data.filter(
                (f: FlaggedItem) => f.status === "reviewed"
            ).length;
            const dismissed = response.data.filter(
                (f: FlaggedItem) => f.status === "dismissed"
            ).length;

            setStats({ total, pending, reviewed, dismissed });
        } catch (error) {
            console.error("Failed to fetch flags:", error);
        } finally {
            setLoading(false);
        }
    };

    //Complete handleAction with proper error handling and stats update
    const handleAction = async (
        flagId: string,
        action: "approve" | "dismiss"
    ) => {
        setActionLoading((prev) => ({ ...prev, [flagId]: true }));
        setError(null);

        try {
            const response = await axios.patch(
                `https://qna-forum.onrender.com/api/reports/admin/flags/${flagId}`,
                { action },
                {
                    withCredentials: true,
                    timeout: 10000,
                }
            );

            //Use functional update to avoid stale closure
            setFlags((prevFlags) =>
                prevFlags.map((flag) =>
                    flag.id === flagId
                        ? {
                              ...flag,
                              status:
                                  action === "approve"
                                      ? "reviewed"
                                      : "dismissed",
                          }
                        : flag
                )
            );

            //Update stats from backend response or manually
            if (response.data.updatedStats) {
                setStats(response.data.updatedStats);
            } else {
                setStats((prevStats) => {
                    const newStats = { ...prevStats };
                    newStats.pending = Math.max(0, newStats.pending - 1);
                    if (action === "approve") {
                        newStats.reviewed += 1;
                    } else {
                        newStats.dismissed += 1;
                    }
                    return newStats;
                });
            }

            // Success feedback
            console.log(
                `Report ${
                    action === "approve"
                        ? "approved and content removed"
                        : "dismissed"
                } successfully`
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Failed to update flag:", error);

            let errorMessage = "Failed to process report. Please try again.";

            if (error.response?.status === 404) {
                errorMessage = "Report not found or already processed.";
                fetchFlags(); // Refresh data
            } else if (error.response?.status === 403) {
                errorMessage =
                    "You do not have permission to perform this action.";
            } else if (error.response?.status === 409) {
                errorMessage = "Report has already been processed.";
                fetchFlags(); // Refresh data
            } else if (error.code === "ECONNABORTED") {
                errorMessage =
                    "Request timed out. Please check your connection.";
            }

            setError(errorMessage);
        } finally {
            setActionLoading((prev) => ({ ...prev, [flagId]: false }));
        }
    };

    //Action handler with confirmation for destructive actions
    const handleActionClick = (
        flagId: string,
        action: "approve" | "dismiss",
        title: string
    ) => {
        if (action === "approve") {
            setConfirmingAction({ flagId, action, title });
        } else {
            handleAction(flagId, action);
        }
    };

    const confirmAction = () => {
        if (confirmingAction) {
            handleAction(confirmingAction.flagId, confirmingAction.action);
            setConfirmingAction(null);
        }
    };

    const filteredFlags = flags.filter((flag) => {
        const matchesFilter = filter === "all" || flag.status === filter;
        const matchesSearch =
            flag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flag.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flag.author.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalPages = Math.ceil(filteredFlags.length / itemsPerPage);
    const paginatedFlags = filteredFlags.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-gradient-to-r from-amber-100 to-orange-200 text-orange-800 border border-orange-300 shadow-md animate-pulse";
            case "reviewed":
                return "bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-600 shadow-md";
            case "dismissed":
                return "bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800 border border-orange-400 shadow-sm";
            default:
                return "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200 shadow-sm";
        }
    };

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case "spam":
                return "bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900 border border-orange-500 shadow-md";
            case "inappropriate":
                return "bg-gradient-to-r from-orange-400 to-red-400 text-white border border-orange-500 shadow-md";
            case "harassment":
                return "bg-gradient-to-r from-orange-500 to-pink-400 text-white border border-orange-600 shadow-md";
            case "copyright":
                return "bg-gradient-to-r from-orange-200 to-amber-300 text-orange-900 border border-orange-400 shadow-md";
            default:
                return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300 shadow-sm";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-25 to-amber-50">
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl">
                                    <Flag className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-600 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                                    <AlertTriangle className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-800 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    Flagged Content Review
                                </h1>
                                <p className="text-orange-700/80 text-sm font-medium">
                                    Moderate and manage reported content across
                                    your platform
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-200 px-4 py-2 rounded-full shadow-lg border border-orange-300">
                            <User className="w-4 h-4 text-orange-600" />
                            <span className="text-xs font-bold text-orange-800">
                                {filteredFlags.length} reports
                            </span>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="flex-1">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4 group-focus-within:text-orange-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by title, content, or author..."
                                    value={searchTerm}
                                    onChange={(e): void =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-3 py-3 border-2 border-orange-200 rounded-xl bg-white shadow-lg focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all placeholder-orange-400 text-gray-800 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-200 px-4 py-3 rounded-xl shadow-lg border border-orange-300">
                            <Filter className="w-4 h-4 text-orange-600" />
                            <select
                                value={filter}
                                onChange={(e): void =>
                                    setFilter(e.target.value)
                                }
                                className="border-0 bg-transparent font-semibold text-orange-800 focus:outline-none cursor-pointer text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="dismissed">Dismissed</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        {
                            label: "Total Reports",
                            value: stats.total,
                            gradient: "from-orange-400 to-orange-500",
                            icon: <Flag className="w-5 h-5" />,
                            change: "+12%",
                        },
                        {
                            label: "Pending Review",
                            value: stats.pending,
                            gradient: "from-orange-500 to-orange-600",
                            icon: <Clock className="w-5 h-5" />,
                            change: "+5%",
                        },
                        {
                            label: "Action Taken",
                            value: stats.reviewed,
                            gradient: "from-orange-600 to-red-500",
                            icon: <Shield className="w-5 h-5" />,
                            change: "+18%",
                        },
                        {
                            label: "Dismissed",
                            value: stats.dismissed,
                            gradient: "from-orange-300 to-orange-400",
                            icon: <Check className="w-5 h-5" />,
                            change: "+8%",
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2, scale: 1.02 }}
                        >
                            <Card
                                className={`bg-gradient-to-br ${stat.gradient} text-white shadow-xl border-0 overflow-hidden rounded-2xl`}
                            >
                                <CardContent className="p-5 relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                                            {stat.icon}
                                        </div>
                                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
                                            {stat.change}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold mb-1">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs opacity-90 font-medium">
                                            {stat.label}
                                        </p>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 opacity-10">
                                        <div className="text-5xl">
                                            {stat.icon}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="bg-white shadow-xl border-2 border-orange-100 rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="text-center space-y-4">
                                        <div className="animate-spin w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto"></div>
                                        <p className="text-orange-600 text-lg font-semibold">
                                            Loading flagged content...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-3 p-4 bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 border-b-2 border-orange-200 text-xs font-bold text-orange-800">
                                        <div className="col-span-1">Type</div>
                                        <div className="col-span-3">
                                            Content Details
                                        </div>
                                        <div className="col-span-2">
                                            Author Info
                                        </div>
                                        <div className="col-span-1">
                                            Category
                                        </div>
                                        <div className="col-span-1">Status</div>
                                        <div className="col-span-1">Date</div>
                                        <div className="col-span-2">
                                            Actions
                                        </div>
                                    </div>

                                    {/* Table Body */}
                                    <div className="divide-y divide-orange-100">
                                        {paginatedFlags.length === 0 ? (
                                            <div className="text-center py-16">
                                                <div className="p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-xl">
                                                    <Flag className="w-8 h-8 text-orange-600" />
                                                </div>
                                                <h3 className="text-lg font-bold text-orange-800 mb-2">
                                                    No flagged content found
                                                </h3>
                                                <p className="text-orange-600 text-sm">
                                                    All reports have been
                                                    processed or no reports
                                                    match your criteria.
                                                </p>
                                            </div>
                                        ) : (
                                            <AnimatePresence>
                                                {paginatedFlags.map(
                                                    (flag, index) => (
                                                        <motion.div
                                                            key={flag.id}
                                                            initial={{
                                                                opacity: 0,
                                                                x: -20,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                x: 20,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    index *
                                                                    0.05,
                                                            }}
                                                            className="grid grid-cols-12 gap-3 p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-25 transition-all duration-300 group"
                                                        >
                                                            {/* Type */}
                                                            <div className="col-span-1 flex items-center">
                                                                <div
                                                                    className={`p-2 rounded-xl shadow-md border ${
                                                                        flag.type ===
                                                                        "question"
                                                                            ? "bg-gradient-to-br from-orange-200 to-orange-300 border-orange-400"
                                                                            : "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300"
                                                                    }`}
                                                                >
                                                                    <MessageSquare
                                                                        className={`w-4 h-4 ${
                                                                            flag.type ===
                                                                            "question"
                                                                                ? "text-orange-800"
                                                                                : "text-orange-700"
                                                                        }`}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div className="col-span-3">
                                                                <p className="font-semibold text-orange-900 text-xs mb-1 line-clamp-1">
                                                                    {flag.title}
                                                                </p>
                                                                <p
                                                                    className="text-xs text-orange-700/80 line-clamp-2 mb-1"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: flag.content,
                                                                    }}
                                                                />
                                                                <div className="flex items-center gap-1">
                                                                    <AlertTriangle className="w-3 h-3 text-orange-600" />
                                                                    <p className="text-xs text-orange-700 font-medium">
                                                                        {
                                                                            flag.reason
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Author */}
                                                            <div className="col-span-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="relative">
                                                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-md border border-orange-300">
                                                                            <span className="text-xs font-bold text-white">
                                                                                {flag.author
                                                                                    .charAt(
                                                                                        0
                                                                                    )
                                                                                    .toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-orange-300 to-orange-400 border border-white rounded-full"></div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-orange-900">
                                                                            {
                                                                                flag.author
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-orange-600">
                                                                            {
                                                                                flag.authorEmail
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Category */}
                                                            <div className="col-span-1 flex items-center">
                                                                <Badge
                                                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryBadge(
                                                                        flag.category
                                                                    )}`}
                                                                >
                                                                    {
                                                                        flag.category
                                                                    }
                                                                </Badge>
                                                            </div>

                                                            {/* Status */}
                                                            <div className="col-span-1 flex items-center">
                                                                <Badge
                                                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(
                                                                        flag.status
                                                                    )}`}
                                                                >
                                                                    {
                                                                        flag.status
                                                                    }
                                                                </Badge>
                                                            </div>

                                                            {/* Reported Date */}
                                                            <div className="col-span-1 flex items-center">
                                                                <div className="text-center">
                                                                    <Calendar className="w-3 h-3 text-orange-500 mx-auto mb-0.5" />
                                                                    <p className="text-xs text-orange-700 font-semibold">
                                                                        {formatDate(
                                                                            flag.reportedAt
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="col-span-2 flex items-center gap-2">
                                                                <Link
                                                                    href={
                                                                        flag.originalUrl
                                                                    }
                                                                >
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="h-8 w-8 p-0 hover:bg-orange-200 hover:text-orange-800 rounded-xl transition-all group-hover:scale-105 shadow-sm border border-orange-200"
                                                                    >
                                                                        <Eye className="w-3 h-3" />
                                                                    </Button>
                                                                </Link>

                                                                {/* Dismiss button with loading state */}
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() =>
                                                                        handleActionClick(
                                                                            flag.id,
                                                                            "dismiss",
                                                                            flag.title
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        actionLoading[
                                                                            flag
                                                                                .id
                                                                        ] ||
                                                                        flag.status !==
                                                                            "pending"
                                                                    }
                                                                    // className="h-8 w-8 p-0 hover:bg-green-200 hover:text-green-800 rounded-xl transition-all group-hover:scale-105 shadow-sm border border-orange-200 disabled:opacity-50"
                                                                    className="h-8 w-8 p-0 hover:bg-red-400 hover:text-white rounded-xl transition-all group-hover:scale-105 shadow-sm border border-orange-200 disabled:opacity-50"
                                                                    title="Dismiss report"
                                                                >
                                                                    {actionLoading[
                                                                        flag.id
                                                                    ] ? (
                                                                        <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
                                                                    ) : (
                                                                        <X className="w-3 h-3" />
                                                                    )}
                                                                </Button>

                                                                {/* Approve button with loading state */}
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() =>
                                                                        handleActionClick(
                                                                            flag.id,
                                                                            "approve",
                                                                            flag.title
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        actionLoading[
                                                                            flag
                                                                                .id
                                                                        ] ||
                                                                        flag.status !==
                                                                            "pending"
                                                                    }
                                                                    className="h-8 w-8 p-0 hover:bg-green-200 hover:text-green-800 rounded-xl transition-all group-hover:scale-105 shadow-sm border border-orange-200 disabled:opacity-50"
                                                                    title="Approve report and remove content"
                                                                >
                                                                    {actionLoading[
                                                                        flag.id
                                                                    ] ? (
                                                                        <div className="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin" />
                                                                    ) : (
                                                                        <Check className="w-3 h-3" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                )}
                                            </AnimatePresence>
                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between p-4 border-t-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
                                            <p className="text-xs font-semibold text-orange-800">
                                                Showing{" "}
                                                <span className="font-bold text-orange-600">
                                                    {(currentPage - 1) *
                                                        itemsPerPage +
                                                        1}
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-bold text-orange-600">
                                                    {Math.min(
                                                        currentPage *
                                                            itemsPerPage,
                                                        filteredFlags.length
                                                    )}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-bold text-orange-600">
                                                    {filteredFlags.length}
                                                </span>{" "}
                                                reports
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.max(
                                                                prev - 1,
                                                                1
                                                            )
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                    className="hover:bg-orange-200 hover:border-orange-400 disabled:opacity-50 rounded-lg border border-orange-300 text-orange-700 font-semibold text-xs px-3 py-1"
                                                >
                                                    Previous
                                                </Button>
                                                <div className="flex items-center gap-1">
                                                    {Array.from(
                                                        {
                                                            length: Math.min(
                                                                5,
                                                                totalPages
                                                            ),
                                                        },
                                                        (_, i) => {
                                                            const pageNum =
                                                                currentPage <= 3
                                                                    ? i + 1
                                                                    : currentPage -
                                                                      2 +
                                                                      i;
                                                            if (
                                                                pageNum >
                                                                totalPages
                                                            )
                                                                return null;
                                                            return (
                                                                <Button
                                                                    key={
                                                                        pageNum
                                                                    }
                                                                    variant={
                                                                        pageNum ===
                                                                        currentPage
                                                                            ? "default"
                                                                            : "ghost"
                                                                    }
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setCurrentPage(
                                                                            pageNum
                                                                        )
                                                                    }
                                                                    className={`w-8 h-8 rounded-xl font-semibold text-xs ${
                                                                        pageNum ===
                                                                        currentPage
                                                                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border border-orange-600"
                                                                            : "hover:bg-orange-200 text-orange-700 border border-orange-200"
                                                                    }`}
                                                                >
                                                                    {pageNum}
                                                                </Button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.min(
                                                                prev + 1,
                                                                totalPages
                                                            )
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                    className="hover:bg-orange-200 hover:border-orange-400 disabled:opacity-50 rounded-lg border border-orange-300 text-orange-700 font-semibold text-xs px-3 py-1"
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/*Confirmation Modal */}
                {confirmingAction && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Confirm Content Removal
                                </h3>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Are you sure you want to approve this report and
                                permanently remove the content
                                <span className="font-semibold text-gray-800">
                                    {" "}
                                    &quot;{confirmingAction.title}&quot;
                                </span>
                                ?
                                <br />
                                <br />
                                This action cannot be undone and the author will
                                be notified.
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmingAction(null)}
                                    className="flex-1 border-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmAction}
                                    disabled={
                                        actionLoading[confirmingAction.flagId]
                                    }
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {actionLoading[confirmingAction.flagId] ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Removing...
                                        </div>
                                    ) : (
                                        "Remove Content"
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/*Error Display */}
                {error && (
                    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl shadow-lg z-50 max-w-sm">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-600 hover:text-red-800 flex-shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
