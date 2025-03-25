
import { MarkdownFile } from '../types';

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

// Convert plain text to HTML through a simple markdown parser
// This is a simple implementation for SSR, a more complete parser is loaded client-side
export const simpleMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  // Replace new lines with <br>
  let html = markdown.replace(/\n/g, '<br>');
  
  // Replace headings
  html = html.replace(/#{6}\s(.+)/g, '<h6>$1</h6>');
  html = html.replace(/#{5}\s(.+)/g, '<h5>$1</h5>');
  html = html.replace(/#{4}\s(.+)/g, '<h4>$1</h4>');
  html = html.replace(/#{3}\s(.+)/g, '<h3>$1</h3>');
  html = html.replace(/#{2}\s(.+)/g, '<h2>$1</h2>');
  html = html.replace(/#{1}\s(.+)/g, '<h1>$1</h1>');
  
  // Replace bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Replace italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Replace code blocks
  html = html.replace(/```(.+?)```/gs, '<pre><code>$1</code></pre>');
  
  // Replace inline code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  
  return html;
};
