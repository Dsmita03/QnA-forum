'use client';

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type Props = {
  id: string;
  title: string;
  answersCount: number;
  tags: string[];
  username: string;
  createdAt?: string;
  views?: number;
  likes?: number;
  dislikes?: number;
};

export default function QuestionCard({
  id,
  title,
  answersCount,
  tags,
  username,
  createdAt,
  views,
  likes = 0,
  dislikes = 0,
}: Props) {
  const [isClient, setIsClient] = useState(false);
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);
  // Local only, replace with API/DB ops for persistence
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLike = () => {
    if (likeActive) {
      setLikeActive(false);
      setLikeCount((n) => n - 1);
    } else {
      setLikeActive(true);
      setLikeCount((n) => n + 1);
      // Remove dislike if switching (optional)
      if (dislikeActive) {
        setDislikeActive(false);
        setDislikeCount((n) => n - 1);
      }
    }
    // Optionally: trigger API here
  };

  const handleDislike = () => {
    if (dislikeActive) {
      setDislikeActive(false);
      setDislikeCount((n) => n - 1);
    } else {
      setDislikeActive(true);
      setDislikeCount((n) => n + 1);
      // Remove like if switching (optional)
      if (likeActive) {
        setLikeActive(false);
        setLikeCount((n) => n - 1);
      }
    }
    // Optionally: trigger API here
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

  return (
    <div className="border border-gray-200 bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex gap-4">
        {/* Like/Dislike column */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            aria-label="Like"
            onClick={handleLike}
            className={`p-1.5 rounded-full transition-colors ${
              likeActive ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <span className="text-xs text-gray-700">{likeCount}</span>
          <button
            aria-label="Dislike"
            onClick={handleDislike}
            className={`p-1.5 rounded-full transition-colors ${
              dislikeActive ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
          <span className="text-xs text-gray-700">{dislikeCount}</span>
        </div>

        {/* Question Content */}
        <Link href={`/questions/${id}`} className="flex-1">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              <span className="text-sm text-orange-600 font-medium">
                {answersCount} {answersCount === 1 ? "Answer" : "Answers"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-orange-400 text-orange-700 bg-orange-50 hover:bg-orange-100"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
              <div>
                Posted by <span className="font-medium">{username}</span>
                {createdAt && <span className="ml-2">• {formatDate(createdAt)}</span>}
              </div>
              {views !== undefined && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {/* <span>{views} views</span> */}
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
