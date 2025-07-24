"use client";

import { useState, useEffect, use } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import AnswerItem from "@/components/AnswerItem";
import { RichTextEditor } from "@/components/RichTextEditor";
import axios from "axios";
import { useAppStore } from "@/store";

interface Question {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    answers: any[]; // You can define an Answer type if needed
}
interface Props {
    params: { id: string };
}
interface Answer {
  _id: string;
  content: string;
  user: string;
  questionId: string;
  votes: number;
  comments: any[]; // define type if known
}

export default function QuestionPage({ params }: Props) {
    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [newAnswer, setNewAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [validationError, setValidationError] = useState("");
    const user = useAppStore((state) => state.user);
    //Prevent background scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [showModal]);

    useEffect(() => {
        const getQuestionbyId = async () => {
            const { id } = params;
            const response = await axios.get(
                `http://localhost:5000/api/questions/${id}`
            );
            setQuestion(response.data);
        };

        getQuestionbyId();
    }, []);

    useEffect(() => {
        const getAnswers = async () => {
            const { id } = params;
            const response = await axios.get(
                `http://localhost:5000/api/answers/${id}`
            );
            if (response.status === 200) {
                console.log(response.data);
                setAnswers(response.data);
            }
        };
        getAnswers();
    }, [answers]);
    const validateAnswerContent = (content: string): boolean => {
        const stripped = content.replace(/<[^>]*>/g, "").trim();

        if (!stripped) {
            setValidationError("Please add some text content to your answer.");
            return false;
        }
        if (stripped.length < 10) {
            setValidationError("Answer must be at least 10 characters long.");
            return false;
        }

        setValidationError("");
        return true;
    };

    const handleSubmit = async () => {
        if (!validateAnswerContent(newAnswer)) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/answers",
                {
                    questionId: question?._id,
                    content: newAnswer,
                    userId: user?.userId,
                }
            );

            if (response.status === 201) {
                toast.success("Answer submitted successfully!");
                setShowModal(false);
                setNewAnswer("");
                setIsSubmitting(false);
            }
        } catch (error: any) {
            console.error("Error posting answer:", error);
            toast.error("Failed to post answer. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setNewAnswer("");
        setValidationError("");
    };
    if (!question) {
        return (
            <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 min-h-screen">
                <p className="text-center text-gray-500">Loading question...</p>
            </main>
        );
    }
    return (
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 bg-gradient-to-br from-[#fcfcfc] to-[#f0f4ff] min-h-screen rounded-xl shadow-sm">
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Questions", href: "/" },
                    { label: question.title },
                ]}
            />

            <h1 className="text-3xl font-bold text-gray-800">
                {question.title}
            </h1>

            <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                    <Badge
                        key={tag}
                        className="bg-orange-100 text-orange-700 border border-orange-200"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div
                    className="text-gray-700 text-base leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: question.description }}
                />
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-orange-700">
                        💡 Answers ({answers.length})
                    </h2>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center gap-2"
                    >
                        ✍️ Add Answer
                    </Button>
                </div>

                {answers.map((ans, idx) => (
          <AnswerItem key={ans._id} index={idx + 1} content={ans.content} />
        ))}

                {answers.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-500 text-lg">
                            No answers yet. Be the first to answer!
                        </p>
                        <Button
                            onClick={() => setShowModal(true)}
                            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            Write the First Answer
                        </Button>
                    </div>
                )}
            </section>

            {/* Answer Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    ✍️ Write Your Answer
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Help the community by sharing your
                                    knowledge!
                                </p>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
                                <h4 className="font-medium text-gray-800 mb-1">
                                    Question:
                                </h4>
                                <p className="text-gray-700 text-sm">
                                    {question.title}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Your Answer *
                                </label>
                                <RichTextEditor
                                    value={newAnswer}
                                    onChange={(val) => {
                                        setNewAnswer(val);
                                        if (validationError)
                                            setValidationError("");
                                    }}
                                />

                                {validationError && (
                                    <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-red-700 text-sm">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                />
                                            </svg>
                                            {validationError}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                            <p className="text-xs text-gray-500">
                                Your answer will be posted publicly and help
                                other developers.
                            </p>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="bg-orange-500 hover:bg-orange-600 text-white shadow-md min-w-[140px]"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Posting...
                                        </div>
                                    ) : (
                                        "Post Answer"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
