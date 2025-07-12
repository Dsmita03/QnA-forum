'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const newTag = input.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInput('');
      }
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border border-input rounded-md p-2 bg-white">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1 text-xs hover:text-red-500"
          >
            ✕
          </button>
        </span>
      ))}
      <Input
        placeholder="Press Enter to add tag"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addTag}
        className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};
