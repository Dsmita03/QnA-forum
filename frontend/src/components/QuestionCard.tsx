import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Props = {
  id: string;
  title: string;
  answersCount: number;
  tags: string[];
  username: string;
};

export default function QuestionCard({
  id,
  title,
  answersCount,
  tags,
  username,
}: Props) {
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
          <div className="text-sm text-gray-500 mt-2">
            Posted by <span className="font-medium">@{username}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
