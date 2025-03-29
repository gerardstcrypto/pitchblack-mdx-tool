
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
    // Replace markdown links [text](url) with <a href="url">text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
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
      return `<pre class="language-${lang} overflow-x-auto max-w-full rounded-md p-4 my-4"><code class="language-${lang}">${processedCode}</code></pre>`;
    })
    
    // Add paragraph wrapping
    .replace(/(?:^|\n\n)([^\n]+)(?:\n\n|$)/g, (_, text) => {
      // Skip if this is already a HTML element
      if (text.trim().startsWith('<') || text.trim() === '') {
        return `\n\n${text}\n\n`;
      }
      return `\n\n<p class="my-4">${text}</p>\n\n`;
    })
    
    // Replace single newlines with <br> in paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (match, paragraphContent) => {
      return `<p class="my-4">${paragraphContent.replace(/\n/g, '<br>')}</p>`;
    })
    
    // Handle headers (GitHub flavored markdown)
    .replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold my-4">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold my-4">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
    
    // Handle lists
    .replace(/^\s*[-*+]\s+(.*?)$/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li.*?<\/li>)(?:\n<li.*?<\/li>)+/g, '<ul class="list-disc my-4 ml-4">$&</ul>')
    
    // Handle numbered lists
    .replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li class="ml-4">$2</li>')
    .replace(/(<li.*?<\/li>)(?:\n<li.*?<\/li>)+/g, '<ol class="list-decimal my-4 ml-4">$&</ol>');

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
