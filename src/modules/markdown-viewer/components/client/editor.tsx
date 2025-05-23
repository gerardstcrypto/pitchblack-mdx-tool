import React, { useRef, useEffect, useState } from 'react';
import CopyButton from './copy-button';
import PasteButton from './paste-button';
import TemplateButton from './template-button';
import MarkdownToolbar from './markdown-toolbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import useKeyboardShortcuts from '../../hooks/use-keyboard-shortcuts';
import { toast } from "sonner";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  
  const { registerEditorCallbacks } = useKeyboardShortcuts();
  
  useEffect(() => {
    if (editorRef.current) {
      const minHeight = `${editorRef.current.scrollHeight}px`;
      editorRef.current.style.minHeight = minHeight;
    }
  }, []);

  useEffect(() => {
    const handleClearEditor = (newContent: string) => {
      onChange(newContent);
      toast.success('Editor cleared');
    };
    
    const handleCopyContent = () => {
      if (content) {
        navigator.clipboard.writeText(content)
          .then(() => toast.success('Content copied to clipboard'))
          .catch(() => toast.error('Failed to copy content'));
      } else {
        toast.info('Nothing to copy');
      }
    };
    
    registerEditorCallbacks(textareaRef.current, handleClearEditor, handleCopyContent);
  }, [content, onChange, registerEditorCallbacks]);

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      });
    }
  };

  const handlePaste = (text: string) => {
    onChange(content + text);
  };

  const handleInsertTemplate = (template: string) => {
    onChange(template);
    toast.success('Template inserted');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleToolbarAction = (action: string, sel?: { start: number; end: number }) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const currentSelection = sel || {
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    };
    
    const selectedText = content.substring(currentSelection.start, currentSelection.end);
    const beforeSelection = content.substring(0, currentSelection.start);
    const afterSelection = content.substring(currentSelection.end);
    
    let newText = '';
    let newCursorPos = currentSelection.end;
    
    switch (action) {
      case 'bold':
        newText = `${beforeSelection}**${selectedText || 'bold text'}**${afterSelection}`;
        newCursorPos = selectedText ? currentSelection.end + 4 : currentSelection.start + 10;
        break;
      case 'italic':
        newText = `${beforeSelection}_${selectedText || 'italic text'}_${afterSelection}`;
        newCursorPos = selectedText ? currentSelection.end + 2 : currentSelection.start + 11;
        break;
      case 'h1':
        newText = `${beforeSelection}# ${selectedText || 'Heading 1'}${afterSelection}`;
        newCursorPos = selectedText ? currentSelection.end + 2 : currentSelection.start + 10;
        break;
      case 'h2':
        newText = `${beforeSelection}## ${selectedText || 'Heading 2'}${afterSelection}`;
        newCursorPos = selectedText ? currentSelection.end + 3 : currentSelection.start + 11;
        break;
      case 'h3':
        newText = `${beforeSelection}### ${selectedText || 'Heading 3'}${afterSelection}`;
        newCursorPos = selectedText ? currentSelection.end + 4 : currentSelection.start + 12;
        break;
      case 'code':
        if (selectedText.includes('\n')) {
          newText = `${beforeSelection}\`\`\`\n${selectedText || 'code block'}\n\`\`\`${afterSelection}`;
          newCursorPos = selectedText ? currentSelection.end + 8 : currentSelection.start + 14;
        } else {
          newText = `${beforeSelection}\`${selectedText || 'code'}\`${afterSelection}`;
          newCursorPos = selectedText ? currentSelection.end + 2 : currentSelection.start + 6;
        }
        break;
      case 'bulletList':
        if (selectedText.includes('\n')) {
          const bulletedLines = selectedText.split('\n').map(line => `- ${line}`).join('\n');
          newText = `${beforeSelection}${bulletedLines}${afterSelection}`;
          newCursorPos = beforeSelection.length + bulletedLines.length;
        } else {
          newText = `${beforeSelection}- ${selectedText || 'List item'}${afterSelection}`;
          newCursorPos = selectedText ? currentSelection.end + 2 : currentSelection.start + 11;
        }
        break;
      case 'numberedList':
        if (selectedText.includes('\n')) {
          const lines = selectedText.split('\n');
          const numberedLines = lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
          newText = `${beforeSelection}${numberedLines}${afterSelection}`;
          newCursorPos = beforeSelection.length + numberedLines.length;
        } else {
          newText = `${beforeSelection}1. ${selectedText || 'List item'}${afterSelection}`;
          newCursorPos = selectedText ? currentSelection.end + 3 : currentSelection.start + 12;
        }
        break;
      case 'quote':
        if (selectedText.includes('\n')) {
          const quotedLines = selectedText.split('\n').map(line => `> ${line}`).join('\n');
          newText = `${beforeSelection}${quotedLines}${afterSelection}`;
          newCursorPos = beforeSelection.length + quotedLines.length;
        } else {
          newText = `${beforeSelection}> ${selectedText || 'Blockquote'}${afterSelection}`;
          newCursorPos = selectedText ? currentSelection.end + 2 : currentSelection.start + 12;
        }
        break;
      case 'link':
        newText = `${beforeSelection}[${selectedText || 'Link text'}](url)${afterSelection}`;
        newCursorPos = selectedText ? currentSelection.end + 3 : currentSelection.start + 15;
        break;
      case 'note':
        newText = `${beforeSelection}> [!NOTE]\n> ${selectedText || 'This is a note'}${afterSelection}`;
        newCursorPos = selectedText ? beforeSelection.length + 11 + selectedText.length + 3 : beforeSelection.length + 27;
        break;
      case 'warning':
        newText = `${beforeSelection}> [!WARNING]\n> ${selectedText || 'This is a warning'}${afterSelection}`;
        newCursorPos = selectedText ? beforeSelection.length + 14 + selectedText.length + 3 : beforeSelection.length + 30;
        break;
      case 'tip':
        newText = `${beforeSelection}> [!TIP]\n> ${selectedText || 'This is a tip'}${afterSelection}`;
        newCursorPos = selectedText ? beforeSelection.length + 10 + selectedText.length + 3 : beforeSelection.length + 26;
        break;
      case 'important':
        newText = `${beforeSelection}> [!IMPORTANT]\n> ${selectedText || 'This is important information'}${afterSelection}`;
        newCursorPos = selectedText ? beforeSelection.length + 16 + selectedText.length + 3 : beforeSelection.length + 32;
        break;
      default:
        return;
    }
    
    onChange(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
      }
    }, 0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== textareaRef.current) return;
      
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleToolbarAction('bold');
            break;
          case 'i':
            e.preventDefault();
            handleToolbarAction('italic');
            break;
          case 'k':
            e.preventDefault();
            handleToolbarAction('code');
            break;
          case 'l':
            e.preventDefault();
            handleToolbarAction('link');
            break;
          case 'q':
            e.preventDefault();
            handleToolbarAction('quote');
            break;
          case 'u':
            e.preventDefault();
            handleToolbarAction('bulletList');
            break;
          case 'o':
            e.preventDefault();
            handleToolbarAction('numberedList');
            break;
          case '1':
            e.preventDefault();
            handleToolbarAction('h1');
            break;
          case '2':
            e.preventDefault();
            handleToolbarAction('h2');
            break;
          case '3':
            e.preventDefault();
            handleToolbarAction('h3');
            break;
        }
      }
    };
    
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      textarea.addEventListener('select', handleSelectionChange);
      textarea.addEventListener('click', handleSelectionChange);
      textarea.addEventListener('keyup', handleSelectionChange);
    }
    
    return () => {
      if (textarea) {
        textarea.removeEventListener('keydown', handleKeyDown);
        textarea.removeEventListener('select', handleSelectionChange);
        textarea.removeEventListener('click', handleSelectionChange);
        textarea.removeEventListener('keyup', handleSelectionChange);
      }
    };
  }, [content]);

  return (
    <div className="relative h-full flex flex-col" ref={editorRef}>
      <div className="flex items-center justify-between p-2 border-b border-muted h-10 shrink-0">
        <div className="flex items-center gap-1">
          <TemplateButton onInsert={handleInsertTemplate} />
        </div>
        <div className="flex items-center gap-1">
          <PasteButton onPaste={handlePaste} />
          <CopyButton textToCopy={content} />
        </div>
      </div>
      
      <div className="p-2 border-b border-muted/50">
        <MarkdownToolbar onAction={handleToolbarAction} selection={selection} />
      </div>
      
      <ScrollArea className="flex-1 h-[calc(100%-90px)]">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full min-h-[400px] px-6 py-6 bg-transparent resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
          spellCheck="false"
          placeholder="Write or paste your markdown here..."
        />
      </ScrollArea>
    </div>
  );
};

export default Editor;
