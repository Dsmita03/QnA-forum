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
  const question = mockQuestion;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 bg-gradient-to-br from-[#fffdfa] to-[#f9f5ff] min-h-screen rounded-xl shadow-sm">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Questions", href: "/" },
          { label: question.title },
        ]}
      />

      {/* Question Title */}
      <h1 className="text-3xl font-bold text-gray-800">{question.title}</h1>

      {/* Tags */}
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

      {/* Description */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-700 text-base leading-relaxed">{question.description}</p>
      </div>

      {/* Answers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-700">💡 Answers</h2>
        {question.answers.map((ans, idx) => (
          <AnswerItem key={ans.id} index={idx + 1} content={ans.content} />
        ))}
      </section>

      {/* Future: Submit Your Answer */}
      {/* <AnswerForm /> */}
    </main>
  );
}
