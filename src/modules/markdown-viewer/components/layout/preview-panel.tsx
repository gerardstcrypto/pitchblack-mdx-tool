
import React from 'react';
import { ResizablePanel } from "@/components/ui/resizable";
import MdxRenderer from '../ssr/mdx-renderer';
import CopyButton from '../client/copy-button';

interface PreviewPanelProps {
  content: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ content }) => {
  return (
    <ResizablePanel defaultSize={50}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 border-b border-muted h-10">
          <span className="text-sm font-medium">Rendered Output</span>
          <CopyButton textToCopy={content} />
        </div>
        <div className="flex-1 overflow-hidden">
          <MdxRenderer content={content} />
        </div>
      </div>
    </ResizablePanel>
  );
};

export default PreviewPanel;
