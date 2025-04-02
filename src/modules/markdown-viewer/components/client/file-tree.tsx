
import React from 'react';
import { FileText, Trash2, Upload } from 'lucide-react';
import { FileTreeItem, UploadProgress } from '../../types';
import { isMarkdownFile } from '../../helpers/markdown-processor';
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileTreeProps {
  files: FileTreeItem[];
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onClearAll: () => void;
  onFileUpload: (files: File[]) => void;
  uploadProgress: Record<string, UploadProgress>;
}

const FileTree: React.FC<FileTreeProps> = ({ 
  files, 
  onSelectFile, 
  onDeleteFile,
  onClearAll,
  onFileUpload,
  uploadProgress
}) => {
  // Drag and drop handlers
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const markdownFiles = files.filter(isMarkdownFile);

      if (markdownFiles.length === 0) {
        toast.error("Please upload .md or .mdx files only");
        return;
      }

      onFileUpload(markdownFiles);
    },
    [onFileUpload]
  );

  const handleFileInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      const markdownFiles = files.filter(isMarkdownFile);

      if (markdownFiles.length === 0) {
        toast.error("Please upload .md or .mdx files only");
        return;
      }

      onFileUpload(markdownFiles);
      e.target.value = ''; // Reset input value
    },
    [onFileUpload]
  );

  // Display upload progress if there are any uploads in progress
  const hasUploadsInProgress = Object.values(uploadProgress).some(
    (progress) => progress.status === 'loading'
  );

  return (
    <div className="h-full flex flex-col">
      {/* Files section */}
      <div className="flex items-center justify-between p-2 border-b border-muted h-10">
        <span className="text-sm font-medium">Files {files.length > 0 && `(${files.length})`}</span>
        {files.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* File list */}
      <ScrollArea className="flex-1">
        {files.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground text-sm">
            No files yet
          </div>
        ) : (
          <ul className="divide-y divide-muted/40">
            {files.map((file) => (
              <li 
                key={file.id}
                className={`flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-secondary/50 transition-colors group ${
                  file.isSelected ? 'bg-secondary' : ''
                }`}
                onClick={() => onSelectFile(file.id)}
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <FileText size={16} className="flex-shrink-0 text-blue-400" />
                  <span className="truncate text-sm">{file.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
      
      {/* File upload area */}
      <div 
        className={`p-4 border-t border-muted mt-auto ${isDragging ? 'bg-secondary/40' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-secondary/40'
            : 'border-muted hover:border-muted-foreground/50'
        }`}>
          <div className="flex flex-col items-center">
            <Upload 
              className="h-6 w-6 text-muted-foreground mb-2" 
              aria-hidden="true" 
            />
            
            <p className="text-xs text-muted-foreground mb-2">
              Drop markdown files here
            </p>
            
            <label
              htmlFor="file-upload"
              className="px-3 py-1 rounded-md bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer text-xs"
            >
              Browse
              <input
                id="file-upload"
                type="file"
                accept=".md,.mdx"
                multiple
                onChange={handleFileInput}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Upload progress indicators */}
        {hasUploadsInProgress && (
          <div className="mt-4 space-y-2">
            {Object.entries(uploadProgress).map(
              ([fileId, { fileId: id, progress, status }]) => {
                if (status !== 'loading') return null;
                return (
                  <div key={id} className="flex items-center space-x-2">
                    <FileText size={16} className="text-blue-400" />
                    <div className="flex-1">
                      <div className="h-1.5 w-full bg-secondary overflow-hidden rounded-full">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTree;
