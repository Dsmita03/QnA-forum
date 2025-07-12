'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { TagInput } from '@/components/TagInput';
import { useAppStore } from '@/store';
import axios from 'axios';

const AskQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const user=useAppStore((state)=>state.user)
  
  // Inside your component
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !description || tags.length === 0) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const questionData = {
      title,
      description,
      tags,
      userId: user.userId, // your store should have the user with _id
    };

    const response = await axios.post("http://localhost:5000/api/questions", questionData, {
      withCredentials: true, 
    });
   if(response.status===201){
    alert("Question submitted successfully!");
    setTitle('');
    setDescription('');
    setTags([]);
   }
  } catch (error) {
    console.error("❌ Error submitting question:", error);
    alert("Failed to submit question. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcfcfc] to-[#f0f4ff] px-4 py-10">
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardContent className="space-y-6 p-6">
          <h2 className="text-2xl font-bold text-gray-800">Ask Question</h2>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your question title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput tags={tags} setTags={setTags} />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Submit Question
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Validation Errors</DialogTitle>
          </DialogHeader>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AskQuestionPage;
