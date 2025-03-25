
import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { UploadProgress } from '../../types';
import { isMarkdownFile } from '../../helpers/markdown-processor';
import { toast } from "@/components/ui/sonner";

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  uploadProgress: Record<string, UploadProgress>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadProgress }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
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

  const handleFileInput = useCallback(
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
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-secondary/40'
            : 'border-muted hover:border-muted-foreground/50'
        }`}
      >
        <div className="flex flex-col items-center">
          <Upload 
            className="h-10 w-10 text-muted-foreground mb-2" 
            aria-hidden="true" 
          />
          
          <p className="text-sm font-medium mb-1">
            Drag and drop your markdown files here
          </p>
          
          <p className="text-xs text-muted-foreground mb-4">
            Supports .md and .mdx files
          </p>
          
          <label
            htmlFor="file-upload"
            className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer text-sm"
          >
            Select Files
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
  );
};

export default FileUpload;
