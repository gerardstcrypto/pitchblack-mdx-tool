
import React from 'react';
import { simpleMarkdownToHtml } from '../../helpers/markdown-processor';

interface MdxRendererProps {
  content: string;
}

// This is the SSR version which uses a simple markdown parser
// It's fast and will be hydrated by the client-side parser
const MdxRenderer: React.FC<MdxRendererProps> = ({ content }) => {
  const html = simpleMarkdownToHtml(content);

  return (
    <div 
      className="mdx-renderer p-6 h-full overflow-auto editor-mask"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MdxRenderer;
