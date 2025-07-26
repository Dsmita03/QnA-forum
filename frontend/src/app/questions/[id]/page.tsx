"use client";

import React, { useState, useEffect, use } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import AnswerItem from "@/components/AnswerItem";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "axios";
import { useAppStore } from "@/store";

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  answers: never[];
  likes?: number;     // <-- for Like count
  dislikes?: number;  // <-- for Dislike count
}

interface Props {
  params: Promise<{ id: string }>;
}

interface Answer {
  _id: string;
  content: string;
  user: string;
  questionId: string;
  votes: number;
  comments: never[];
}

export default function QuestionPage({ params }: Props) {
  // Unwrap async params
  const { id } = use(params);

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  // Like/Dislike toggle logic (like YouTube, not aggregate math)
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const user = useAppStore((state) => state.user);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
  }, [showModal]);

  // Fetch question and init voting counts
  useEffect(() => {
    const getQuestionbyId = async () => {
      const response = await axios.get(
        `http://localhost:5001/api/questions/${id}`
      );
      setQuestion(response.data);
      setLikeCount(response.data?.likes ?? 0);
      setDislikeCount(response.data?.dislikes ?? 0);
    };
    getQuestionbyId();
  }, [id]);

  // Fetch answers
  useEffect(() => {
    const getAnswers = async () => {
      const response = await axios.get(
        `http://localhost:5001/api/answers/${id}`
      );
      if (response.status === 200) setAnswers(response.data);
    };
    getAnswers();
  }, [id, showModal]);

  // --- Answer Handling ---
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
        "http://localhost:5001/api/answers",
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // --- Like/Dislike logic (no minus math, just action toggle) ---
  const handleLike = () => {
    if (likeActive) {
      setLikeActive(false);
      setLikeCount((c) => c - 1);
    } else {
      setLikeActive(true);
      setLikeCount((c) => c + 1);
      if (dislikeActive) {
        setDislikeActive(false);
        setDislikeCount((c) => c - 1);
      }
    }
    // Optionally: update like/dislike to backend
  };
  const handleDislike = () => {
    if (dislikeActive) {
      setDislikeActive(false);
      setDislikeCount((c) => c - 1);
    } else {
      setDislikeActive(true);
      setDislikeCount((c) => c + 1);
      if (likeActive) {
        setLikeActive(false);
        setLikeCount((c) => c - 1);
      }
    }
    // Optionally: update like/dislike to backend
  };

  if (!question) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 min-h-screen">
        <p className="text-center text-gray-500">Loading question...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-10 min-h-screen">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Questions", href: "/" },
          { label: question.title },
        ]}
      />

      {/* Question Area */}
      <section className="flex flex-col md:flex-row bg-white rounded-xl shadow-md p-6 md:gap-8 gap-4 border border-orange-100 relative">
        {/* Voting */}
        <aside className="flex flex-col items-center mr-1 min-w-[52px]">
          <button
            aria-label="Like"
            onClick={handleLike}
            className={`p-2 rounded-full mb-1.5 transition-colors ${
              likeActive
                ? "bg-green-50 text-green-600"
                : "text-gray-400 hover:text-green-600 hover:bg-green-50"
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <span className="text-xs text-gray-700">{likeCount}</span>
          <button
            aria-label="Dislike"
            onClick={handleDislike}
            className={`p-2 rounded-full transition-colors ${
              dislikeActive
                ? "bg-red-50 text-red-600"
                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
          <span className="text-xs text-gray-700">{dislikeCount}</span>
        </aside>
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {question.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-orange-50 text-orange-800 border border-orange-200"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            {question.title}
          </h1>
          <div
            className="text-gray-700 leading-relaxed prose max-w-none mb-2"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />
          <div className="text-sm text-gray-500 mt-1"></div>
        </div>
      </section>

      {/* Answers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-orange-700 flex items-center gap-2">
            💡 Answers{" "}
            <span className="bg-orange-100 text-orange-800 rounded px-2 py-0.5 font-semibold text-base">
              {answers.length}
            </span>
          </h2>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center gap-2"
          >
            ✍️ Add Answer
          </Button>
        </div>

        <div className="space-y-6 mt-4">
          {answers.length === 0 && (
            <div className="text-center py-14 bg-white rounded-xl border border-gray-100 shadow-md">
              <p className="text-gray-500 text-base mb-3">
                No answers yet. Be the first to help!
              </p>
              <Button
                onClick={() => setShowModal(true)}
                className="mt-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Write the First Answer
              </Button>
            </div>
          )}
          {answers.map((ans, idx) => (
            <div
              key={ans._id}
              className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-lg p-5 shadow-sm"
            >
              <AnswerItem index={idx + 1} content={ans.content} />
            </div>
          ))}
        </div>
      </section>

      {/* Answer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden border border-orange-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  ✍️ Write Your Answer
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Help the community by sharing your knowledge!
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-orange-600"
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
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)] space-y-3">
              <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400 mb-4 text-orange-800 text-sm">
                <strong>Question:</strong> {question.title}
              </div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Your Answer *
              </label>
              <RichTextEditor
                value={newAnswer}
                onChange={(val) => {
                  setNewAnswer(val);
                  if (validationError) setValidationError("");
                }}
              />
              {validationError && (
                <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <span className="text-red-700 text-sm">{validationError}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                Your answer will be posted publicly and help other developers.
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
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-md min-w-[120px]"
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
