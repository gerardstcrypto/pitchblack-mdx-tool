
import React, { useRef, useEffect } from 'react';
import CopyButton from './copy-button';
import PasteButton from './paste-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  // Use ResizeObserver to prevent layout shifts
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Prevent layout shift by setting min-height based on initial render
    if (editorRef.current) {
      const minHeight = `${editorRef.current.scrollHeight}px`;
      editorRef.current.style.minHeight = minHeight;
    }
  }, []);

  const handlePaste = (text: string) => {
    onChange(content + text);
  };

  return (
    <div className="relative h-full flex flex-col" ref={editorRef}>
      <div className="flex items-center justify-between p-2 border-b border-muted h-10 shrink-0">
        <span className="text-sm font-medium">Markdown Input</span>
        <div className="flex items-center gap-1">
          <PasteButton onPaste={handlePaste} />
          <CopyButton textToCopy={content} />
        </div>
      </div>
      <ScrollArea className="flex-1 h-[calc(100%-40px)]">
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full min-h-[400px] px-6 py-4 bg-transparent resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
          spellCheck="false"
          placeholder="Write or paste your markdown here..."
        />
      </ScrollArea>
    </div>
  );
};

export default Editor;
