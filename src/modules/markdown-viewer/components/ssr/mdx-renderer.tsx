
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
    // This captures the code block, including all whitespace and newlines inside
    .replace(/```(\w*)([\s\S]*?)```/g, (_, language, code) => {
      const lang = language || 'markup';
      // Preserve original whitespace and newlines in code blocks
      const processedCode = code.trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
      return `<pre class="language-${lang} overflow-x-auto max-w-full rounded-md"><code class="language-${lang}">${processedCode}</code></pre>`;
    })
    // Add paragraph wrapping
    .replace(/(?:^|\n\n)([^\n]+)(?:\n\n|$)/g, (_, text) => {
      if (text.trim().startsWith('<pre') || text.trim() === '') {
        return `\n\n${text}\n\n`;
      }
      return `\n\n<p class="my-4">${text}</p>\n\n`;
    })
    // Replace single newlines with <br> in paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (match, paragraphContent) => {
      return `<p class="my-4">${paragraphContent.replace(/\n/g, '<br>')}</p>`;
    });

  return (
    <ScrollArea className="h-full">
      <div 
        ref={containerRef}
        className="prose prose-sm dark:prose-invert max-w-none px-6 py-6 overflow-hidden mdx-renderer"
        dangerouslySetInnerHTML={{ __html: processedContent }} 
      />
    </ScrollArea>
  );
};

export default MdxRenderer;
