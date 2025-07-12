import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Props = {
  id: string;
  title: string;
  answersCount: number;
  tags: string[];
  username: string;
};

export default function QuestionCard({ id, title, answersCount, tags, username }: Props) {
  return (
    <Link href={`/questions/${id}`}>
      <div className="border rounded-lg p-4 hover:shadow transition flex flex-col gap-2 my-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">{title}</h2>
          <span className="text-sm text-gray-500">[{answersCount} ans]</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="text-sm text-gray-600">Posted by: {username}</div>
      </div>
    </Link>
  );
}
