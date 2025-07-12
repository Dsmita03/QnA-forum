'use client';

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import AnswerItem from "@/components/AnswerItem";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useState } from "react";

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
  const [newAnswer, setNewAnswer] = useState('');
  const [answers, setAnswers] = useState(question.answers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Function to validate answer content
  const validateAnswerContent = (content: string): boolean => {
    if (!content || !content.trim()) {
      setValidationError('Please write an answer before posting.');
      return false;
    }

    // Remove HTML tags and check if there's actual text content
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    
    if (!textContent || textContent.length === 0) {
      setValidationError('Please add some text content to your answer.');
      return false;
    }

    // Check for meaningful content (at least 10 characters)
    if (textContent.length < 10) {
      setValidationError('Please write a more detailed answer (at least 10 characters).');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleSubmitAnswer = async () => {
    if (!validateAnswerContent(newAnswer)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const answer = {
        id: `a${answers.length + 1}`,
        content: newAnswer,
        author: "Current User", // This would come from auth context
        timestamp: new Date().toISOString(),
      };
      
      setAnswers([...answers, answer]);
      setNewAnswer('');
      setIsSubmitting(false);
      setShowAnswerModal(false); // Close modal after submission
    }, 1000);
  };

  const handleCloseModal = () => {
    setShowAnswerModal(false);
    setNewAnswer('');
    setValidationError('');
  };

  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 bg-gradient-to-br from-[#fcfcfc] to-[#f0f4ff] min-h-screen rounded-xl shadow-sm">
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-orange-700">💡 Answers ({answers.length})</h2>
          
          {/* Add Answer Button */}
          <Button
            onClick={() => setShowAnswerModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center gap-2"
          >
            <span>✍️</span>
            Add Answer
          </Button>
        </div>
        
        {answers.map((ans, idx) => (
          <AnswerItem key={ans.id} index={idx + 1} content={ans.content} />
        ))}
        
        {answers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className="space-y-4">
              <p className="text-gray-500 text-lg">No answers yet. Be the first to answer!</p>
              <Button
                onClick={() => setShowAnswerModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              >
                Write the First Answer
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Answer Modal */}
      {showAnswerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">✍️ Write Your Answer</h3>
                <p className="text-sm text-gray-600 mt-1">Help the community by sharing your knowledge!</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                {/* Question Reference */}
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-medium text-gray-800 mb-2">Question:</h4>
                  <p className="text-gray-700 text-sm">{question.title}</p>
                </div>

                {/* Answer Editor */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Your Answer *
                  </label>
                  <RichTextEditor 
                    value={newAnswer} 
                    onChange={(value) => {
                      setNewAnswer(value);
                      // Clear validation error when user starts typing
                      if (validationError) {
                        setValidationError('');
                      }
                    }}
                  />
                  
                  {/* Validation Error */}
                  {validationError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm text-red-700">{validationError}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500">
                Your answer will be posted publicly and help other developers
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !newAnswer?.trim() || newAnswer.replace(/<[^>]*>/g, '').trim().length < 10}
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-md min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Posting...
                    </div>
                  ) : (
                    'Post Answer'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      
     
      </main>
    </>
  );
}
