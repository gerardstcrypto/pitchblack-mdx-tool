
import React from 'react';
import MarkdownViewer from '@/modules/markdown-viewer/markdown-viewer';

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarkdownViewer />
    </div>
  );
};

export default Page;
