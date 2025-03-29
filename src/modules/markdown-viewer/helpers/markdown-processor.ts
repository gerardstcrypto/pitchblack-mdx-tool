
import { MarkdownFile } from '../types';
import Prism from 'prismjs';

// These imports are needed for Prism syntax highlighting
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

// Create a unique ID for each file
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Extract file name from a File object
export const getFileName = (file: File): string => {
  return file.name;
};

// Read file content as text
export const readFileAsText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Process a file into a MarkdownFile object
export const processMarkdownFile = async (file: File): Promise<MarkdownFile> => {
  try {
    const content = await readFileAsText(file);
    return {
      id: generateId(),
      name: getFileName(file),
      content,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error processing markdown file:', error);
    throw error;
  }
};

// Simple validation to check if a file is markdown
export const isMarkdownFile = (file: File): boolean => {
  return file.name.endsWith('.md') || file.name.endsWith('.mdx');
};

// Find code blocks with language specifications
const findCodeBlocks = (markdown: string): { language: string, code: string, original: string }[] => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const matches = [];
  let match;
  
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    matches.push({
      language: match[1] || 'markup',
      code: match[2],
      original: match[0]
    });
  }
  
  return matches;
};

// Apply syntax highlighting to code blocks while preserving newlines
const highlightCodeBlocks = (markdown: string): string => {
  const codeBlocks = findCodeBlocks(markdown);
  let result = markdown;
  
  codeBlocks.forEach(({ language, code, original }) => {
    // Map common language shortcuts to prism-supported languages
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'tsx': 'tsx',
      'jsx': 'jsx',
      'py': 'python',
      'rb': 'ruby',
      'sh': 'bash',
      'bash': 'bash',
      'css': 'css',
      'html': 'markup',
      'json': 'json',
      'md': 'markdown',
      'yaml': 'yaml',
      'yml': 'yaml',
    };
    
    const prismLanguage = languageMap[language] || language || 'markup';
    let highlighted;
    
    try {
      // Make sure the language is loaded in Prism
      if (Prism.languages[prismLanguage]) {
        highlighted = Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage)
          .replace(/\n/g, '<br>');
      } else {
        // Fallback to markup if language isn't supported
        highlighted = Prism.highlight(code, Prism.languages.markup, 'markup')
          .replace(/\n/g, '<br>');
      }
      
      // Create a highlighted code block with language class
      const highlightedBlock = `<pre class="language-${prismLanguage} p-4 my-4"><code class="language-${prismLanguage}">${highlighted}</code></pre>`;
      result = result.replace(original, highlightedBlock);
    } catch (error) {
      console.error(`Error highlighting code block with language ${prismLanguage}:`, error);
    }
  });
  
  return result;
};

// Convert plain text to HTML through a simple markdown parser
// This is a simple implementation for SSR, a more complete parser is loaded client-side
export const simpleMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  // First process links - [text](url)
  let html = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Then highlight code blocks
  html = highlightCodeBlocks(html);
  
  // Process paragraphs - split by double newlines first (to preserve intended paragraphs)
  // This approach handles paragraphs before inline formatting
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(paragraph => {
    // Skip processing if this is already a code block
    if (paragraph.trim().startsWith('<pre class="language-')) {
      return paragraph;
    }
    
    // Apply basic markdown transformations for non-code parts
    let processedParagraph = paragraph;
    
    // Replace headings (but not within code blocks)
    processedParagraph = processedParagraph.replace(/^#{6}\s(.+?)$/gm, '<h6 class="text-base font-bold my-2">$1</h6>');
    processedParagraph = processedParagraph.replace(/^#{5}\s(.+?)$/gm, '<h5 class="text-lg font-bold my-2">$1</h5>');
    processedParagraph = processedParagraph.replace(/^#{4}\s(.+?)$/gm, '<h4 class="text-xl font-bold my-3">$1</h4>');
    processedParagraph = processedParagraph.replace(/^#{3}\s(.+?)$/gm, '<h3 class="text-xl font-bold my-3">$1</h3>');
    processedParagraph = processedParagraph.replace(/^#{2}\s(.+?)$/gm, '<h2 class="text-2xl font-bold my-4">$1</h2>');
    processedParagraph = processedParagraph.replace(/^#{1}\s(.+?)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>');
    
    // Handle lists
    processedParagraph = processedParagraph.replace(/^\s*[-*+]\s+(.*?)$/gm, '<li>$1</li>');
    if (processedParagraph.includes('<li>')) {
      processedParagraph = `<ul class="list-disc pl-5 my-4">${processedParagraph}</ul>`;
    }
    
    // Handle numbered lists
    processedParagraph = processedParagraph.replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li>$2</li>');
    if (processedParagraph.includes('<li>') && !processedParagraph.startsWith('<ul')) {
      processedParagraph = `<ol class="list-decimal pl-5 my-4">${processedParagraph}</ol>`;
    }
    
    // Replace bold
    processedParagraph = processedParagraph.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Replace italic
    processedParagraph = processedParagraph.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Replace inline code (but not inside already processed code blocks)
    processedParagraph = processedParagraph.replace(/`([^`]+?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Handle line breaks within paragraphs (single newlines)
    processedParagraph = processedParagraph.replace(/\n/g, '<br>');
    
    // If it's not a heading, list, or other HTML element, wrap in paragraph tags
    if (!/^<(h[1-6]|ul|ol|pre)/.test(processedParagraph)) {
      return `<p class="my-4">${processedParagraph}</p>`;
    }
    
    return processedParagraph;
  }).join('\n\n');
  
  return html;
};
