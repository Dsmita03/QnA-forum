'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // optional for conditional classes

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const RichTextEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[160px] p-3 border border-input bg-white rounded-b-md text-gray-900 focus:outline-none',
      },
    },
  });

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-100 border border-b-0 border-gray-300 rounded-t-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn('text-sm px-2 py-1 rounded hover:bg-gray-200', {
            'bg-gray-300': editor.isActive('bold'),
          })}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn('text-sm px-2 py-1 rounded hover:bg-gray-200', {
            'bg-gray-300': editor.isActive('italic'),
          })}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('text-sm px-2 py-1 rounded hover:bg-gray-200', {
            'bg-gray-300': editor.isActive('bulletList'),
          })}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn('text-sm px-2 py-1 rounded hover:bg-gray-200', {
            'bg-gray-300': editor.isActive('orderedList'),
          })}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn('text-sm px-2 py-1 rounded hover:bg-gray-200', {
            'bg-gray-300': editor.isActive('blockquote'),
          })}
        >
          “ ”
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn('text-sm px-2 py-1 rounded hover:bg-gray-200', {
            'bg-gray-300': editor.isActive({ textAlign: 'left' }),
          })}
        >
          ⬅
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn('text-sm px-2 py-1 rounded hover:bg-gray-200', {
            'bg-gray-300': editor.isActive({ textAlign: 'center' }),
          })}
        >
          ⬍
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn('text-sm px-2 py-1 rounded hover:bg-gray-200', {
            'bg-gray-300': editor.isActive({ textAlign: 'right' }),
          })}
        >
          ➡
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};
