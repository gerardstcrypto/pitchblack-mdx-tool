
import React, { useEffect } from 'react';
import { simpleMarkdownToHtml } from '../../helpers/markdown-processor';
import { ScrollArea } from '@/components/ui/scroll-area';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme for code highlighting

interface MdxRendererProps {
  content: string;
}

// This is the SSR version which uses a simple markdown parser
// It's fast and will be hydrated by the client-side parser
const MdxRenderer: React.FC<MdxRendererProps> = ({ content }) => {
  const html = simpleMarkdownToHtml(content);

  // Apply Prism highlighting on client-side for dynamic content
  useEffect(() => {
    // We're using the already highlighted content from simpleMarkdownToHtml
    // This is just a fallback if needed
    if (typeof window !== 'undefined' && window.Prism) {
      window.Prism.highlightAll();
    }
  }, [content]);

  return (
    <ScrollArea className="h-full w-full">
      <div 
        className="mdx-renderer p-6 min-h-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </ScrollArea>
  );
};

export default MdxRenderer;
