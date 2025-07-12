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
import { useEffect, useState } from "react";
import Link from "next/link"; // ✅ FIXED: Import Link
import axios from "axios";

// const mockQuestions = [
//   {
//     id: "1",
//     title: "How to use Next.js dynamic routes?",
//     answersCount: 5,
//     tags: ["Next.js", "Routing"],
//     username: "alice123",
//     createdAt: "2024-12-10T10:30:00Z",
//     views: 150,
//   },
//   {
//     id: "2",
//     title: "What is shadcn/ui?",
//     answersCount: 2,
//     tags: ["shadcn", "UI", "React"],
//     username: "bob456",
//     createdAt: "2024-12-12T14:20:00Z",
//     views: 89,
//   },
//   {
//     id: "3",
//     title: "How to implement authentication in React?",
//     answersCount: 8,
//     tags: ["React", "Authentication", "Security"],
//     username: "charlie789",
//     createdAt: "2024-12-08T09:15:00Z",
//     views: 320,
//   },
//   {
//     id: "4",
//     title: "Best practices for TypeScript?",
//     answersCount: 3,
//     tags: ["TypeScript", "Best Practices"],
//     username: "diana101",
//     createdAt: "2024-12-13T16:45:00Z",
//     views: 75,
//   },
// ];

export default function Home() {
  const [questions,setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  

  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/questions");
      console.log(res.data);
      // Format backend response to match your mock shape
      const formatted = res.data.map((q: any) => ({
        id: q._id,
        title: q.title,
        answersCount: q.answers ? q.answers.length : 0, // if you populate answers later
        tags: q.tags || [],
        username: q.user.email || "anonymous", // if you populate user with username
        createdAt: q.createdAt,
        views: q.views || 0, // default if not in schema
      }));
      setQuestions(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch questions:", err);
    }
  };

  fetchQuestions();
}, []);
  // Filter questions based on search term
  const filteredQuestions = questions.filter(question => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      question.title.toLowerCase().includes(searchLower) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      question.username.toLowerCase().includes(searchLower)
    );
  });

  // Sort filtered questions
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        // Sort by answer count (descending)
        return b.answersCount - a.answersCount;
      
      case 'newest':
        // Sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      
      case 'oldest':
        // Sort by creation date (oldest first)
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      
      case 'most-viewed':
        // Sort by view count (descending)
        return b.views - a.views;
      
      case 'alphabetical':
        // Sort by title alphabetically
        return a.title.localeCompare(b.title);
      
      case 'unanswered':
        // Show unanswered questions first
        if (a.answersCount === 0 && b.answersCount > 0) return -1;
        if (a.answersCount > 0 && b.answersCount === 0) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      
      default: // 'latest'
        // Default to newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 bg-white shadow-md rounded-md">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">📅 Latest</SelectItem>
                <SelectItem value="newest">🆕 Newest</SelectItem>
                <SelectItem value="oldest">⏰ Oldest</SelectItem>
                <SelectItem value="popular">🔥 Most Popular</SelectItem>
                <SelectItem value="most-viewed">👁️ Most Viewed</SelectItem>
                <SelectItem value="alphabetical">🔤 A-Z</SelectItem>
                <SelectItem value="unanswered">❓ Unanswered</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search by keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          {/* Search Results Info */}
          {searchTerm.trim() && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800 text-sm">
                {filteredQuestions.length > 0 
                  ? `Found ${filteredQuestions.length} result${filteredQuestions.length !== 1 ? 's' : ''} for "${searchTerm}"`
                  : `No results found for "${searchTerm}"`
                }
              </p>
              {filteredQuestions.length === 0 && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-orange-600 hover:text-orange-700 text-sm underline mt-1"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {sortedQuestions.length > 0 ? (
            sortedQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                id={q.id}
                title={q.title}
                answersCount={q.answersCount}
                tags={q.tags}
                username={q.username}
                createdAt={q.createdAt}
                views={q.views}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm.trim() ? 'No questions found' : 'No questions available'}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchTerm.trim() 
                  ? 'Try different search terms or ask a new question!'
                  : 'Try different search terms or ask the first question!'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchTerm.trim() && (
                  <Button 
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Clear Search
                  </Button>
                )}
                <Link href="/add-questions">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 shadow-md">
                    Ask Question
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
