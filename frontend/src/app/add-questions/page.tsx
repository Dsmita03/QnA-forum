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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const AskQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  const user = useAppStore((state) => state.user);

  useEffect(() => {
    console.log('User', user);
  }, [user]);

  const validateFields = () => {
    const issues: string[] = [];

    if (!title.trim()) issues.push('Title is required.');
    else if (title.length < 10) issues.push('Title must be at least 10 characters.');

    if (!description.trim() || description === '<p></p>') issues.push('Description is required.');

    if (tags.length === 0) issues.push('At least one tag is required.');

    setErrors(issues);
    setShowDialog(issues.length > 0);

    return issues.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const questionData = {
        title,
        description,
        tags,
        userId: user?.userId,
      };

      const response = await axios.post('http://localhost:5000/api/questions', questionData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        setTitle('');
        setDescription('');
        setTags([]);
        alert('✅ Question submitted successfully!');
      }
    } catch (error: any) {
      console.error('❌ Error submitting question:', error);
      setErrors([
        error?.response?.data?.message || 'Failed to submit question. Please try again.',
      ]);
      setShowDialog(true);
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

      {/* Error Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Something went wrong</DialogTitle>
          </DialogHeader>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
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
