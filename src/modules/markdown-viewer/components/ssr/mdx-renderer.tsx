
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
    // Process code blocks first to avoid conflicts
    .replace(/```(\w*)([\s\S]*?)```/g, (_, language, code) => {
      const lang = language || 'markup';
      // Preserve all whitespace and newlines
      const processedCode = code.trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .split('\n').join('</br>');
      
      return `<pre class="language-${lang} overflow-x-auto max-w-full rounded-md p-4 my-4"><code class="language-${lang}">${processedCode}</code></pre>`;
    })
    
    // Process inline code with backticks (before other formatting)
    .replace(/`([^`\n]+)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-sm">$1</code>')
    
    // Process bold with double asterisks or double underscores
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/__([^_\n]+)__/g, '<strong class="font-bold">$1</strong>')
    
    // Process italic with single asterisk or single underscore
    .replace(/\*([^*\n]+)\*/g, '<em class="italic">$1</em>')
    .replace(/_([^_\n]+)_/g, '<em class="italic">$1</em>')
    
    // Process strikethrough with double tildes
    .replace(/~~([^~\n]+)~~/g, '<del class="line-through">$1</del>')
    
    // Replace markdown links [text](url) with <a href="url">text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Better handle headings (GitHub flavored markdown)
    .replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold my-4">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold my-4">$1</h3>')
    .replace(/^#### (.*?)$/gm, '<h4 class="text-lg font-bold my-3">$1</h4>')
    .replace(/^##### (.*?)$/gm, '<h5 class="text-base font-bold my-2">$1</h5>')
    .replace(/^###### (.*?)$/gm, '<h6 class="text-sm font-bold my-2">$1</h6>')
    
    // Handle lists
    .replace(/^\s*[-*+]\s+(.*?)$/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li.*?<\/li>)(?:\n<li.*?<\/li>)+/g, '<ul class="list-disc my-4 ml-4">$&</ul>')
    
    // Handle numbered lists
    .replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li class="ml-4">$2</li>')
    .replace(/(<li.*?<\/li>)(?:\n<li.*?<\/li>)+/g, '<ol class="list-decimal my-4 ml-4">$&</ol>')
    
    // Process blockquotes
    .replace(/^>\s*(.*?)$/gm, '<blockquote class="border-l-4 border-gray-500 pl-4 py-1 italic">$1</blockquote>')
    
    // Add paragraph wrapping for text not already wrapped in HTML tags
    .replace(/(?:^|\n\n)([^\n<]+)(?:\n\n|$)/g, (_, text) => {
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
