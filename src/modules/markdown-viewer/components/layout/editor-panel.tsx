
import React, { Suspense, lazy } from 'react';
import { ResizablePanel } from "@/components/ui/resizable";

const Editor = lazy(() => import('../client/editor'));

interface EditorPanelProps {
  content: string;
  onChange: (content: string) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ content, onChange }) => {
  return (
    <ResizablePanel defaultSize={50}>
      <Suspense fallback={<div className="p-4">Loading editor...</div>}>
        <Editor 
          content={content} 
          onChange={onChange} 
        />
      </Suspense>
    </ResizablePanel>
  );
};

export default EditorPanel;
