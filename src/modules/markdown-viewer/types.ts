
export interface MarkdownFile {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
}

export interface FileTreeItem {
  id: string;
  name: string;
  isSelected: boolean;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

export interface MarkdownViewerState {
  files: MarkdownFile[];
  selectedFileId: string | null;
  editorContent: string;
  uploadProgress: Record<string, UploadProgress>;
}

// For Prism global declaration
declare global {
  interface Window {
    Prism: typeof import('prismjs');
  }
}
