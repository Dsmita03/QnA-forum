'use client';

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";  // import your toast hook!

type Props = {
  id: string;
  title: string;
  answersCount: number;
  tags: string[];
  username: string;
  createdAt?: string;
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
  likes = 0,
  dislikes = 0,
}: Props) {
  const [isClient, setIsClient] = useState(false);
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);

  const { toast } = useToast(); // <<===

  useEffect(() => { setIsClient(true); }, []);

  const handleLike = () => {
    if (likeActive) {
      setLikeActive(false);
      setLikeCount((n) => n - 1);
    } else {
      setLikeActive(true);
      setLikeCount((n) => n + 1);
      if (dislikeActive) {
        setDislikeActive(false);
        setDislikeCount((n) => n - 1);
      }
    }
  };

  const handleDislike = () => {
    if (dislikeActive) {
      setDislikeActive(false);
      setDislikeCount((n) => n - 1);
    } else {
      setDislikeActive(true);
      setDislikeCount((n) => n + 1);
      if (likeActive) {
        setLikeActive(false);
        setLikeCount((n) => n - 1);
      }
    }
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toast("Report received! Our moderators will review this question soon.");
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
    <div className="relative border border-orange-100 bg-gradient-to-br from-white via-orange-50 to-white rounded-2xl px-6 py-5 shadow-[0_2px_8px_0_rgba(245,81,0,.05)] transition-all duration-200 group">
      {/* Report Button (top right) */}
      <button
        type="button"
        onClick={handleReport}
        aria-label="Report question"
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 rounded-full transition-colors z-10 bg-white shadow hover:bg-orange-50"
      >
        <Flag className="w-5 h-5" />
      </button>

      <div className="flex gap-6 items-start">
        {/* Like/Dislike column */}
        <div className="flex flex-col items-center pt-1 gap-1">
          <button
            aria-label="Like"
            onClick={handleLike}
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
            onClick={handleDislike}
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
              </div>
              <span className="ml-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-3 py-0.5 font-semibold text-xs shadow-sm">
                {answersCount} {answersCount === 1 ? 'Answer' : 'Answers'}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
