"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/RichTextEditor";
import { TagInput } from "@/components/TagInput";
import { useAppStore } from "@/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    HelpCircle,
    FileText,
    Tag,
    Send,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Lightbulb,
    Users,
    Clock,
    Star,
} from "lucide-react";

interface QuestionTip {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

const AskQuestionPage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const user = useAppStore((state) => state.user);

    const questionTips: QuestionTip[] = [
        {
            icon: <Lightbulb className="w-5 h-5" />,
            title: "Be Specific",
            description: "Clear, specific questions get better answers",
            color: "bg-yellow-50 border-yellow-200 text-yellow-800",
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Think of Your Audience",
            description: "Write for people who might have similar questions",
            color: "bg-blue-50 border-blue-200 text-blue-800",
        },
        {
            icon: <Star className="w-5 h-5" />,
            title: "Use Good Tags",
            description:
                "Relevant tags help the right people find your question",
            color: "bg-purple-50 border-purple-200 text-purple-800",
        },
    ];

    const steps = [
        {
            label: "Title",
            icon: <HelpCircle className="w-4 h-4" />,
            field: "title",
        },
        {
            label: "Description",
            icon: <FileText className="w-4 h-4" />,
            field: "description",
        },
        { label: "Tags", icon: <Tag className="w-4 h-4" />, field: "tags" },
    ];

    useEffect(() => {
        console.log("User", user);
    }, [user]);

    useEffect(() => {
        // Update active step based on filled fields
        if (title.length >= 10) {
            setActiveStep(1);
            if (description.trim() && description !== "<p></p>") {
                setActiveStep(2);
                if (tags.length > 0) {
                    setActiveStep(3);
                }
            }
        } else {
            setActiveStep(0);
        }
    }, [title, description, tags]);

    const validateFields = () => {
        const issues: string[] = [];

        if (!title.trim()) issues.push("Title is required.");
        else if (title.length < 10)
            issues.push("Title must be at least 10 characters.");

        if (!description.trim() || description === "<p></p>")
            issues.push("Description is required.");

        if (tags.length === 0) issues.push("At least one tag is required.");

        setErrors(issues);
        setShowDialog(issues.length > 0);

        return issues.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) return;

        setIsSubmitting(true);

        try {
            const questionData = {
                title,
                description,
                tags,
                userId: user?.userId,
            };

            const response = await axios.post(
                "https://qna-forum.onrender.com/api/questions",
                questionData,
                {
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                setShowSuccess(true);
                setTimeout(() => {
                    setTitle("");
                    setDescription("");
                    setTags([]);
                    setActiveStep(0);
                    setShowSuccess(false);
                }, 2000);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("❌ Error submitting question:", error);
            setErrors([
                error?.response?.data?.message ||
                    "Failed to submit question. Please try again.",
            ]);
            setShowDialog(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStepStatus = (stepIndex: number) => {
        if (stepIndex < activeStep) return "completed";
        if (stepIndex === activeStep) return "active";
        return "pending";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl mb-4 shadow-lg">
                        <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                        Ask a Question
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Share your question with the community and get expert
                        answers
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                                {/* Progress Bar */}
                                <div className="h-2 bg-gray-100">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-orange-400 to-pink-500"
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width: `${(activeStep / 3) * 100}%`,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                <CardContent className="p-8 space-y-8">
                                    {/* Steps Indicator */}
                                    <div className="flex items-center justify-between mb-8">
                                        {steps.map((step, index) => (
                                            <div
                                                key={step.label}
                                                className="flex items-center"
                                            >
                                                <div
                                                    className={`
                          flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                          ${
                              getStepStatus(index) === "completed"
                                  ? "bg-green-500 border-green-500 text-white"
                                  : getStepStatus(index) === "active"
                                  ? "bg-orange-500 border-orange-500 text-white"
                                  : "bg-gray-100 border-gray-300 text-gray-400"
                          }
                        `}
                                                >
                                                    {getStepStatus(index) ===
                                                    "completed" ? (
                                                        <CheckCircle className="w-5 h-5" />
                                                    ) : (
                                                        step.icon
                                                    )}
                                                </div>
                                                <span
                                                    className={`ml-3 text-sm font-medium ${
                                                        getStepStatus(index) ===
                                                        "pending"
                                                            ? "text-gray-400"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    {step.label}
                                                </span>
                                                {index < steps.length - 1 && (
                                                    <div
                                                        className={`ml-4 w-16 h-0.5 ${
                                                            getStepStatus(
                                                                index
                                                            ) === "completed"
                                                                ? "bg-green-500"
                                                                : "bg-gray-300"
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-8"
                                    >
                                        {/* Title Section */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <HelpCircle className="w-5 h-5 text-orange-500" />
                                                <Label
                                                    htmlFor="title"
                                                    className="text-lg font-semibold text-gray-800"
                                                >
                                                    What&#39;s your question?
                                                </Label>
                                            </div>
                                            <Input
                                                id="title"
                                                placeholder="e.g., How do I implement authentication in Next.js?"
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                                className="text-lg p-4 border-2 focus:border-orange-400 transition-colors"
                                            />
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Be specific and clear
                                                </span>
                                                <span
                                                    className={`${
                                                        title.length >= 10
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {title.length}/10 minimum
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Description Section */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-5 h-5 text-blue-500" />
                                                <Label
                                                    htmlFor="description"
                                                    className="text-lg font-semibold text-gray-800"
                                                >
                                                    Provide more details
                                                </Label>
                                            </div>
                                            <div className="border-2 border-gray-200 rounded-lg focus-within:border-blue-400 transition-colors">
                                                <RichTextEditor
                                                    value={description}
                                                    onChange={setDescription}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Include code examples, error
                                                messages, and what you&#39;ve
                                                tried
                                            </p>
                                        </motion.div>

                                        {/* Tags Section */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Tag className="w-5 h-5 text-purple-500" />
                                                <Label
                                                    htmlFor="tags"
                                                    className="text-lg font-semibold text-gray-800"
                                                >
                                                    Add tags
                                                </Label>
                                            </div>
                                            <TagInput
                                                tags={tags}
                                                setTags={setTags}
                                            />
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Help others find your
                                                    question
                                                </span>
                                                <span
                                                    className={`${
                                                        tags.length > 0
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {tags.length} tag
                                                    {tags.length !== 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Submit Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="flex justify-end pt-6"
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <motion.div
                                                            animate={{
                                                                rotate: 360,
                                                            }}
                                                            transition={{
                                                                duration: 1,
                                                                repeat: Infinity,
                                                                ease: "linear",
                                                            }}
                                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                                        />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        Submit Question
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Tips Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 border-0">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Sparkles className="w-5 h-5 text-indigo-600" />
                                        <h3 className="text-lg font-bold text-gray-800">
                                            Tips for Great Questions
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {questionTips.map((tip, index) => (
                                            <motion.div
                                                key={tip.title}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: 0.6 + index * 0.1,
                                                }}
                                                className={`p-4 rounded-lg border ${tip.color}`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="mt-0.5">
                                                        {tip.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm mb-1">
                                                            {tip.title}
                                                        </h4>
                                                        <p className="text-xs opacity-80">
                                                            {tip.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="shadow-lg">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                                        Community Stats
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Questions Today
                                            </span>
                                            <Badge variant="secondary">
                                                124
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Avg Response Time
                                            </span>
                                            <Badge className="bg-green-100 text-green-800">
                                                <Clock className="w-3 h-3 mr-1" />
                                                2.3h
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Expert Members
                                            </span>
                                            <Badge className="bg-blue-100 text-blue-800">
                                                1.2k
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Success Animation */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Question Submitted!
                            </h3>
                            <p className="text-gray-600">
                                Your question has been posted successfully. The
                                community will help you soon!
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2 text-red-600">
                            <AlertCircle className="w-5 h-5" />
                            <span>Please fix these issues</span>
                        </DialogTitle>
                    </DialogHeader>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 my-4">
                        {errors.map((err, idx) => (
                            <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                {err}
                            </motion.li>
                        ))}
                    </ul>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                        >
                            Got it!
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AskQuestionPage;
