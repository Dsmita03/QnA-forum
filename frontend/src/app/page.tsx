'use client';

import Navbar from "@/components/navbar";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link"; // ✅ FIXED: Import Link

const mockQuestions = [
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
  },
];

export default function Home() {
  const [questions] = useState(mockQuestions);

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10 bg-gradient-to-br from-[#fcfcfc] to-[#f0f4ff] min-h-screen">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            🧠 Explore Questions
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select>
              <SelectTrigger className="w-full sm:w-44 bg-white shadow-md rounded-md">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search by keywords..."
              className="w-full sm:w-72 bg-white shadow-md rounded-md"
            />

            <Link href="/add-questions">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 shadow-md">
                Ask Question
              </Button>
            </Link>
          </div>
        </header>

        {/* Questions Section */}
        <section className="grid gap-6">
          {questions.length > 0 ? (
            questions.map((q) => (
              <QuestionCard
                key={q.id}
                id={q.id}
                title={q.title}
                answersCount={q.answersCount}
                tags={q.tags}
                username={q.username}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No questions found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Try different search terms or ask the first question!
              </p>
              <Link href="/add-questions">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 shadow-md">
                  Ask Question
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
