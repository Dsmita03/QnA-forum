"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Flag, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppStore } from "@/store"; // Import your store
import axios from "axios";

type Props = {
    id: string;
    title: string;
    answersCount: number;
    tags: string[];
    username: string;
    createdAt?: string;
    likes?: number;
    dislikes?: number;
    views?: number;
};

export default function QuestionCard({
    id,
    title,
    answersCount,
    tags,
    username,
    createdAt,
    likes = 0,
    dislikes = 0,
}: Props) {
    const [isClient, setIsClient] = useState(false);
    const [likeActive, setLikeActive] = useState(false);
    const [dislikeActive, setDislikeActive] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [dislikeCount, setDislikeCount] = useState(dislikes);

    // Report modal states
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [validationError, setValidationError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();
    
    // Get user data from store
    const { user, isAuthenticated } = useAppStore();
    const isAdmin = user.role === "admin";
    const isLoggedIn = isAuthenticated();

    useEffect(() => { 
        setIsClient(true); 
    }, []);

    // Prevent background scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = showReportModal ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showReportModal]);

    const callIncreaseLike = async (id: string) => {
        try {
            const res = await axios.put(
                "http://localhost:5001/api/questions/increase-like/",
                { id },
                { withCredentials: true }
            );
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    const callDecreaseLike = async (id: string) => {
        try {
            const res = await axios.put(
                "http://localhost:5001/api/questions/decrease-like/",
                { id },
                { withCredentials: true }
            );
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLike = async (id: string) => {
        // Prevent action if admin or not logged in
        if (isAdmin || !isLoggedIn) return;
        
        console.log(likeActive)
        if (likeActive) {
            // User is unliking
            await callDecreaseLike(id);
            setLikeActive(false);
            setLikeCount((n) => n - 1);
        } else {
            // User is liking
            await callIncreaseLike(id);
            setLikeActive(true);
            setLikeCount((n) => n + 1);

            // If user had disliked before, remove dislike
            if (dislikeActive) {
                await callIncreaseLike(id);
                setDislikeActive(false);
                setDislikeCount((n) => n - 1);
            }
        }
    };

    const handleDislike = async (id: string) => {
        // Prevent action if admin or not logged in
        if (isAdmin || !isLoggedIn) return;
        
        console.log(dislikeActive, likeActive)
        if (dislikeActive) {
            // User is removing dislike
            await callIncreaseLike(id);
            setDislikeActive(false);
            setDislikeCount((n) => n - 1);
        } else {
            // User is disliking
            await callDecreaseLike(id);
            setDislikeActive(true);
            setDislikeCount((n) => n + 1);

            // If user had liked before, remove like
            if (likeActive) {
                await callDecreaseLike(id);
                setLikeActive(false);
                setLikeCount((n) => n - 1);
            }
        }
    };

    const handleReport = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setShowReportModal(true);
    };

    const validateReport = () => {
        if (!selectedCategory) {
            setValidationError("Please select a report category.");
            return false;
        }
        if (!reportReason.trim()) {
            setValidationError("Please provide a reason for reporting.");
            return false;
        }
        if (reportReason.trim().length < 10) {
            setValidationError("Please provide a more detailed reason (at least 10 characters).");
            return false;
        }
        setValidationError("");
        return true;
    };

   const handleSubmitReport = async () => {
    if (!validateReport()) return;
    
    setIsSubmitting(true);
    try {
        const response = await axios.post('http://localhost:5001/api/reports/submit', {
            questionId: id,
            reason: selectedCategory,
            message: reportReason
        }, { withCredentials: true });
        
        toast(
            response.data.message || "Report Submitted. Thank you for helping maintain our community standards."
        );
        
        handleCloseModal();
    } catch (error) {
        console.error("Report submission error:", error);
        toast("Failed to submit report. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
};

    const handleCloseModal = () => {
        setShowReportModal(false);
        setReportReason("");
        setSelectedCategory("");
        setValidationError("");
        setIsSubmitting(false);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString || !isClient) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    const reportCategories = [
        { value: "spam", label: "Spam or Promotional Content" },
        { value: "inappropriate", label: "Inappropriate Content" },
        { value: "harassment", label: "Harassment or Bullying" },
        { value: "copyright", label: "Copyright Violation" },
        { value: "misinformation", label: "Misinformation" },
        { value: "other", label: "Other" }
    ];

    return (
        <>
            <div className="relative border border-orange-100 bg-gradient-to-br from-white via-orange-50 to-white rounded-2xl px-6 py-5 shadow-[0_2px_8px_0_rgba(245,81,0,.05)] transition-all duration-200 group">
                {/* Report Button (only show for regular users, not admins) */}
                {!isAdmin && isLoggedIn && (
                    <button
                        type="button"
                        onClick={handleReport}
                        aria-label="Report question"
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 rounded-full transition-colors z-10 bg-white shadow hover:bg-orange-50"
                    >
                        <Flag className="w-5 h-5" />
                    </button>
                )}

                <div className="flex gap-6 items-start">
                    {/* Like/Dislike column (only show for regular users, not admins) */}
                    {!isAdmin && isLoggedIn && (
                        <div className="flex flex-col items-center pt-1 gap-1">
                            <button
                                aria-label="Like"
                                onClick={() => handleLike(id)}
                                className={`p-2 rounded-full transition-all ${
                                    likeActive
                                        ? 'bg-green-100 text-green-700 border-green-200 border'
                                        : 'text-gray-300 hover:text-green-600 hover:bg-green-50'
                                }`}
                            >
                                <ThumbsUp className="w-5 h-5" />
                            </button>
                            <span className="text-xs font-semibold text-gray-700">{likeCount}</span>
                            <button
                                aria-label="Dislike"
                                onClick={() => handleDislike(id)}
                                className={`p-2 rounded-full transition-all ${
                                    dislikeActive
                                        ? 'bg-red-100 text-red-600 border-red-200 border'
                                        : 'text-gray-300 hover:text-red-600 hover:bg-red-50'
                                }`}
                            >
                                <ThumbsDown className="w-5 h-5" />
                            </button>
                            <span className="text-xs font-semibold text-gray-700">{dislikeCount}</span>
                        </div>
                    )}

                    {/* Show stats for admins (read-only) */}
                    {isAdmin && (
                        <div className="flex flex-col items-center pt-1 gap-1">
                            <div className="p-2 rounded-full bg-gray-100 text-gray-500">
                                <ThumbsUp className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{likeCount}</span>
                            <div className="p-2 rounded-full bg-gray-100 text-gray-500">
                                <ThumbsDown className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{dislikeCount}</span>
                        </div>
                    )}

                    {/* Question Content */}
                    <Link href={`/questions/${id}`} className="flex-1 group-hover:scale-[1.01] transition-transform">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-2">{title}</h2>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="border-orange-400 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex justify-between items-end text-xs text-gray-500 mt-3 pt-2 border-t border-orange-50">
                                <div>
                                    Asked by <span className="font-medium text-orange-700">{username}</span>
                                    {createdAt && <span className="ml-1">• {formatDate(createdAt)}</span>}
                                    {/* Show admin badge for admins */}
                                    {isAdmin && (
                                        <span className="ml-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-full px-2 py-0.5 text-xs font-medium">
                                            Admin View
                                        </span>
                                    )}
                                </div>
                                <span className="ml-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-3 py-0.5 font-semibold text-xs shadow-sm">
                                    {answersCount} {answersCount === 1 ? 'Answer' : 'Answers'}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Report Modal (only for regular users) */}
            {showReportModal && !isAdmin && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-orange-100">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Flag className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Report Question</h3>
                                    <p className="text-sm text-gray-600">Help us maintain community standards</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            {/* Question Preview */}
                            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400 mb-6">
                                <p className="text-sm font-medium text-orange-800 mb-1">Reporting:</p>
                                <p className="text-sm text-orange-700 line-clamp-2">{title}</p>
                                <p className="text-xs text-orange-600 mt-1">by {username}</p>
                            </div>

                            {/* Category Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Why are you reporting this question? *
                                </label>
                                <div className="space-y-2">
                                    {reportCategories.map((category) => (
                                        <label key={category.value} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="reportCategory"
                                                value={category.value}
                                                checked={selectedCategory === category.value}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="mr-3 text-orange-600 focus:ring-orange-500"
                                            />
                                            <span className="text-sm text-gray-700">{category.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Reason Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional details *
                                </label>
                                <textarea
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    placeholder="Please provide specific details about why you're reporting this question..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {reportReason.length}/500 characters
                                </p>
                            </div>

                            {/* Validation Error */}
                            {validationError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{validationError}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
                            <p className="text-xs text-gray-500">
                                Reports are reviewed by our moderation team
                            </p>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleCloseModal}
                                    disabled={isSubmitting}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmitReport}
                                    disabled={isSubmitting}
                                    className="bg-red-500 hover:bg-red-600 text-white min-w-[100px]"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </div>
                                    ) : (
                                        "Submit Report"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
