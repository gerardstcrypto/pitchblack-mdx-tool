
import React from 'react';
import { ResizablePanel } from "@/components/ui/resizable";
import Editor from '../client/editor';

interface EditorPanelProps {
  content: string;
  onChange: (content: string) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ content, onChange }) => {
  return (
    <ResizablePanel defaultSize={50} className="min-h-0 flex flex-col">
      <Editor 
        content={content} 
        onChange={onChange} 
      />
    </ResizablePanel>
  );
};

export default EditorPanel;
