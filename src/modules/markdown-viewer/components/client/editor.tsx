
import React, { useRef, useEffect } from 'react';
import CopyButton from './copy-button';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="relative h-full">
      <div className="flex items-center justify-between p-2 border-b border-muted">
        <span className="text-sm font-medium">Markdown Input</span>
        <CopyButton textToCopy={content} />
      </div>
      <div className="overflow-auto h-[calc(100%-40px)] editor-mask">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full min-h-[400px] p-4 bg-transparent resize-none focus:outline-none font-mono text-sm"
          spellCheck="false"
          placeholder="Write or paste your markdown here..."
        />
      </div>
    </div>
  );
};

export default Editor;
