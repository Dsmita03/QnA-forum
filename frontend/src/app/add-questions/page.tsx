'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { TagInput } from '@/components/TagInput';
import { useAppStore } from '@/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const AskQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  const user = useAppStore((state) => state.user);
  const { toast } = useToast();

  useEffect(() => {
    console.log("User", user);
  }, [user]);

  const validate = () => {
    const errorList: string[] = [];

    if (!title.trim()) errorList.push('Title is required.');
    else if (title.length < 10) errorList.push('Title must be at least 10 characters.');

    if (!description.trim() || description === '<p></p>') errorList.push('Description is required.');

    if (tags.length === 0) errorList.push('Please add at least one tag.');

    setErrors(errorList);
    setShowDialog(errorList.length > 0);

    return errorList.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const questionData = { title, description, tags };

    try {
      console.log('Submitted:', questionData);
      await new Promise((res) => setTimeout(res, 1000)); // simulate delay

      toast({
        title: 'Success',
        description: 'Your question has been posted!',
      });

      // Clear form
      setTitle('');
      setDescription('');
      setTags([]);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to post question. Please try again.',
        variant: 'destructive',
      });
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
