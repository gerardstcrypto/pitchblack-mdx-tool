
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

// Apply syntax highlighting to code blocks
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
        highlighted = Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage);
      } else {
        // Fallback to markup if language isn't supported
        highlighted = Prism.highlight(code, Prism.languages.markup, 'markup');
      }
      
      // Create a highlighted code block with language class
      const highlightedBlock = `<pre class="language-${prismLanguage}"><code class="language-${prismLanguage}">${highlighted}</code></pre>`;
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
  
  // First highlight code blocks
  let html = highlightCodeBlocks(markdown);
  
  // Apply basic markdown transformations for non-code parts
  // Replace new lines with <br>
  html = html.replace(/\n(?!<\/code>|<\/pre>)/g, '<br>');
  
  // Replace headings (but not within code blocks)
  html = html.replace(/(?<!```[\s\S]*?)#{6}\s(.+?)(?=<br>|$)/g, '<h6>$1</h6>');
  html = html.replace(/(?<!```[\s\S]*?)#{5}\s(.+?)(?=<br>|$)/g, '<h5>$1</h5>');
  html = html.replace(/(?<!```[\s\S]*?)#{4}\s(.+?)(?=<br>|$)/g, '<h4>$1</h4>');
  html = html.replace(/(?<!```[\s\S]*?)#{3}\s(.+?)(?=<br>|$)/g, '<h3>$1</h3>');
  html = html.replace(/(?<!```[\s\S]*?)#{2}\s(.+?)(?=<br>|$)/g, '<h2>$1</h2>');
  html = html.replace(/(?<!```[\s\S]*?)#{1}\s(.+?)(?=<br>|$)/g, '<h1>$1</h1>');
  
  // Replace bold
  html = html.replace(/(?<!```[\s\S]*?)\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Replace italic
  html = html.replace(/(?<!```[\s\S]*?)\*(.+?)\*/g, '<em>$1</em>');
  
  // Replace inline code (but not inside already processed code blocks)
  html = html.replace(/(?<!<code[^>]*>[\s\S]*?)`([^`]+?)`(?![\s\S]*?<\/code>)/g, '<code>$1</code>');
  
  return html;
};
