'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { TagInput } from '@/components/TagInput';

const AskQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questionData = { title, description, tags };
    console.log('Submitted:', questionData);
    // TODO: Add to backend / Firebase
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-10">
      <Card className="max-w-2xl mx-auto shadow-sm">
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
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AskQuestionPage;
