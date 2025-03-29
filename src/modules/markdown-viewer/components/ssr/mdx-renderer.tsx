
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

  // Process content for rendering with better handling of GitHub-flavored markdown
  const processedContent = content
    // Replace markdown links [text](url) with <a href="url">text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Better handle headings (GitHub flavored markdown)
    // Process headings before code blocks to avoid conflicts
    .replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold my-4">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold my-4">$1</h3>')
    .replace(/^#### (.*?)$/gm, '<h4 class="text-lg font-bold my-3">$1</h4>')
    .replace(/^##### (.*?)$/gm, '<h5 class="text-base font-bold my-2">$1</h5>')
    .replace(/^###### (.*?)$/gm, '<h6 class="text-sm font-bold my-2">$1</h6>')
    
    // Replace ```language\ncontent\n``` with <pre><code class="language-{language}">content</code></pre>
    // Improved to better preserve newlines and whitespace in code blocks
    .replace(/```(\w*)([\s\S]*?)```/g, (_, language, code) => {
      const lang = language || 'markup';
      // Preserve all whitespace and newlines, but convert them to HTML entities
      const processedCode = code.trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Use explicit line breaks for each newline in the code
        .split('\n').join('</br>');
      
      return `<pre class="language-${lang} overflow-x-auto max-w-full rounded-md p-4 my-4"><code class="language-${lang}">${processedCode}</code></pre>`;
    })
    
    // Handle lists
    .replace(/^\s*[-*+]\s+(.*?)$/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li.*?<\/li>)(?:\n<li.*?<\/li>)+/g, '<ul class="list-disc my-4 ml-4">$&</ul>')
    
    // Handle numbered lists
    .replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li class="ml-4">$2</li>')
    .replace(/(<li.*?<\/li>)(?:\n<li.*?<\/li>)+/g, '<ol class="list-decimal my-4 ml-4">$&</ol>')
    
    // Add paragraph wrapping for text not already wrapped in HTML tags
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
