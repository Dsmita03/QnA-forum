import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export default function Home() {
   const questions = [
    {
      id: "1",
      title: "How to use Next.js dynamic routes?",
      answersCount: 5,
      tags: ["Next.js", "Routing"],
      username: "alice123",
    },
    {
      id: "2",
      title: "What is shadcn/ui?",
      answersCount: 2,
      tags: ["shadcn", "UI", "React"],
      username: "bob456",
    },]
  return (
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button className="w-full sm:w-auto">Ask New Question</Button>

        <Select>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Search questions..." className="w-full sm:w-80" />
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            id={q.id}
            title={q.title}
            answersCount={q.answersCount}
            tags={q.tags}
            username={q.username}
          />
        ))}
      </div>
    </main>
  );
}
