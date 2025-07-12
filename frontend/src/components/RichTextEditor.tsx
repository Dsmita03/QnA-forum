
'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Image from '@tiptap/extension-image';
import { PiTextBBold, PiTextItalic, PiTextStrikethrough } from 'react-icons/pi';
import { IoList } from 'react-icons/io5';
import { HiNumberedList } from 'react-icons/hi2';
import { CiTextAlignCenter, CiTextAlignLeft, CiTextAlignRight } from 'react-icons/ci';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const RichTextEditor = ({ value, onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'prose-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'prose-ordered-list',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'prose-list-item',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'prose-image',
        },
      }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ 
        types: ['heading', 'paragraph', 'listItem'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'min-h-[160px] p-3 border border-input bg-white rounded-b-md text-gray-900 focus:outline-none prose prose-sm max-w-none',
      },
    },
  });

  const insertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
       (editor?.chain().focus() as any).setImage({ src: result }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEmojiClick = (emojiData: any) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmojiPicker(false);
  };

  const handleAddLink = () => {
    if (linkUrl.trim()) {
      const selection = editor?.state.selection;
      const hasSelection = selection && !selection.empty;
      
      if (hasSelection) {
        // If text is selected, add link to selected text
        editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run();
      } else {
        // If no text is selected, insert the URL as clickable text
        editor?.chain().focus().insertContent(`<a href="${linkUrl.trim()}">${linkUrl.trim()}</a> `).run();
      }
      
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleRemoveLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  const toggleLinkInput = () => {
    setShowLinkInput(!showLinkInput);
    setLinkUrl('');
  };

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gradient-to-r from-orange-50 to-orange-100 border border-b-0 border-orange-200 rounded-t-md">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn('btn', { 'bg-orange-200': editor.isActive('bold') })}><PiTextBBold /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn('btn', { 'bg-orange-200': editor.isActive('italic') })}><PiTextItalic /></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={cn('btn', { 'bg-orange-200': editor.isActive('strike') })}><PiTextStrikethrough /></button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn('btn', { 'bg-orange-200': editor.isActive('bulletList') })}><IoList /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn('btn', { 'bg-orange-200': editor.isActive('orderedList') })}><HiNumberedList /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={cn('btn', { 'bg-orange-200': editor.isActive({ textAlign: 'left' }) })}><CiTextAlignLeft /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={cn('btn', { 'bg-orange-200': editor.isActive({ textAlign: 'center' }) })}><CiTextAlignCenter /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={cn('btn', { 'bg-orange-200': editor.isActive({ textAlign: 'right' }) })}><CiTextAlignRight /></button>
        <button
          onClick={toggleLinkInput}
          className={cn('btn', { 'bg-orange-200': showLinkInput })}
        >🔗</button>
        <button
          onClick={handleRemoveLink}
          className={cn('btn', { 'bg-orange-200': editor.isActive('link') })}
          disabled={!editor.isActive('link')}
        >🔗❌</button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={insertImage}
          hidden
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn"
        >🖼️</button>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="btn"
        >😊</button>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 border border-b-0 border-orange-200">
          <input
            type="url"
            placeholder="Enter URL (e.g., https://example.com)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddLink();
              } else if (e.key === 'Escape') {
                setShowLinkInput(false);
                setLinkUrl('');
              }
            }}
            autoFocus
          />
          <button
            onClick={handleAddLink}
            disabled={!linkUrl.trim()}
            className="px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add Link
          </button>
          <button
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute z-50 mt-1">
          <EmojiPicker onEmojiClick={handleEmojiClick} height={400} width={300} />
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};
