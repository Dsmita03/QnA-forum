import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

type Props = {
  id: string;
  title: string;
  answersCount: number;
  tags: string[];
  username: string;
  createdAt?: string;
  views?: number;
};

export default function QuestionCard({
  id,
  title,
  answersCount,
  tags,
  username,
  createdAt,
  views,
}: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format the creation date - only on client side to avoid hydration issues
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
    <Link href={`/questions/${id}`}>
      <div className="border border-gray-200 bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="flex flex-col gap-3">
          {/* Title & Answer Count */}
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <span className="text-sm text-orange-600 font-medium">
              {answersCount} {answersCount === 1 ? "Answer" : "Answers"}
            </span>
          </div>

          {/* Tags */}
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

          {/* Footer */}
          <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
            <div>
              Posted by <span className="font-medium">{username}</span>
              {createdAt && (
                <span className="ml-2">• {formatDate(createdAt)}</span>
              )}
            </div>
            {views !== undefined && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{views} views</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
