import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import AnswerItem from "@/components/AnswerItem";


// Example mock data
const mockQuestion = {
  id: "1",
  title: "How to use dynamic routing in Next.js?",
  description:
    "I am trying to understand how dynamic routes work in Next.js App Router. Can someone explain with an example?",
  tags: ["Next.js", "Routing", "App Router"],
  answers: [
    {
      id: "a1",
      content:
        "You can create a folder with [id]/page.tsx inside your /app folder. Next.js will automatically handle the dynamic routing for you.",
    },
    {
      id: "a2",
      content:
        "Check out the official docs too — they have great examples! You can also use generateStaticParams for SSG.",
    },
  ],
};

interface Props {
  params: { id: string };
}

export default function QuestionPage({ params }: Props) {
  // Normally you'd fetch the question by ID here
  const question = mockQuestion;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Questions", href: "/" },
          { label: question.title },
        ]}
      />

      {/* Question Title */}
      <h1 className="text-3xl font-bold">{question.title}</h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      {/* Description */}
      <p className="text-lg">{question.description}</p>

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Answers</h2>
        {question.answers.map((ans, idx) => (
          <AnswerItem
            key={ans.id}
            index={idx + 1}
            content={ans.content}
          />
        ))}
      </div>

      {/* Submit Your Answer */}
      {/* <AnswerForm /> */}
    </main>
  );
}
