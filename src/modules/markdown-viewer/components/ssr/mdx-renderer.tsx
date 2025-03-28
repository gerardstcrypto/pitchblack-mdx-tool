
// This is a server component imported in the client
// It's used to render markdown content as HTML

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';

// Import Prism directly instead of declaring it
import Prism from 'prismjs';

interface MdxRendererProps {
  content: string;
}

const MdxRenderer: React.FC<MdxRendererProps> = ({ content }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      Prism.highlightAllUnder(containerRef.current);
    }
  }, [content]);

  // Process content for rendering
  const processedContent = content
    // Replace ```language\ncontent\n``` with <pre><code class="language-{language}">content</code></pre>
    .replace(/```(\w*)([\s\S]*?)```/g, (_, language, code) => {
      const lang = language || 'markup';
      return `<pre class="language-${lang} overflow-x-auto max-w-full"><code class="language-${lang}">${code.trim()}</code></pre>`;
    })
    // Add paragraph wrapping
    .replace(/(?:^|\n\n)([^\n]+)(?:\n\n|$)/g, (_, text) => {
      if (text.trim().startsWith('<pre') || text.trim() === '') {
        return `\n\n${text}\n\n`;
      }
      return `\n\n<p>${text}</p>\n\n`;
    })
    // Replace single newlines with <br> in paragraphs
    .replace(/<p>([\s\S]*?)<\/p>/g, (match, content) => {
      return `<p>${content.replace(/\n/g, '<br>')}</p>`;
    });

  return (
    <ScrollArea className="h-full">
      <div 
        ref={containerRef}
        className="prose prose-sm dark:prose-invert max-w-none p-4 overflow-x-hidden"
        dangerouslySetInnerHTML={{ __html: processedContent }} 
      />
    </ScrollArea>
  );
};

export default MdxRenderer;
