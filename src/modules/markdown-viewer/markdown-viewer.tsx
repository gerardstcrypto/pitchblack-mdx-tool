
import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { MarkdownFile, FileTreeItem, UploadProgress } from './types';
import { processMarkdownFile } from './helpers/markdown-processor';
import { toast } from "@/components/ui/sonner";

// SSR Components (load immediately)
import MdxRenderer from './components/ssr/mdx-renderer';
import FileUpload from './components/client/file-upload';
import CopyButton from './components/client/copy-button';

// Lazy loaded client components (load after initial render)
const Editor = lazy(() => import('./components/client/editor'));
const FileTree = lazy(() => import('./components/client/file-tree'));

// This represents a module facade that will be rendered in the page
const MarkdownViewer: React.FC = () => {
  // State for markdown files
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  // Editor content
  const [editorContent, setEditorContent] = useState<string>('');
  
  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});

  // Get selected file content
  const selectedFileContent = selectedFileId 
    ? files.find(f => f.id === selectedFileId)?.content || ''
    : editorContent;

  // Update editor content when selected file changes
  useEffect(() => {
    if (selectedFileId) {
      const selectedFile = files.find(f => f.id === selectedFileId);
      if (selectedFile) {
        setEditorContent(selectedFile.content);
      }
    }
  }, [selectedFileId, files]);

  // Transform files for the file tree component
  const fileTreeItems: FileTreeItem[] = files.map(file => ({
    id: file.id,
    name: file.name,
    isSelected: file.id === selectedFileId
  }));

  // Handle file upload
  const handleFileUpload = useCallback(async (newFiles: File[]) => {
    // Process files one by one to avoid UI blocking
    for (const file of newFiles) {
      const fileId = Math.random().toString(36).substring(2, 11);
      
      // Initialize progress
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { fileId, progress: 0, status: 'loading' }
      }));

      try {
        // Simulate staged upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: { ...prev[fileId], progress }
          }));
        }

        // Process the file
        const processedFile = await processMarkdownFile(file);
        
        // Add to files
        setFiles(prevFiles => [...prevFiles, processedFile]);
        
        // Select the file if it's the first one
        if (files.length === 0 && !selectedFileId) {
          setSelectedFileId(processedFile.id);
        }

        // Mark as success
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], status: 'success' }
        }));

        // Remove from progress after a delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const { [fileId]: _, ...rest } = prev;
            return rest;
          });
        }, 1000);

        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { 
            ...prev[fileId], 
            status: 'error',
            error: 'Failed to process file' 
          }
        }));

        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }, [files, selectedFileId]);

  // Handle selecting a file from the tree
  const handleSelectFile = useCallback((id: string) => {
    setSelectedFileId(id);
  }, []);

  // Handle deleting a file
  const handleDeleteFile = useCallback((id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    
    // Reset selected file if the deleted file was selected
    if (selectedFileId === id) {
      setSelectedFileId(null);
      setEditorContent('');
    }

    toast.success('File deleted');
  }, [selectedFileId]);

  // Handle clearing all files
  const handleClearAll = useCallback(() => {
    setFiles([]);
    setSelectedFileId(null);
    setEditorContent('');
    toast.success('All files cleared');
  }, []);

  // Handle editor content change
  const handleEditorChange = useCallback((content: string) => {
    setEditorContent(content);
    
    // Update file content if a file is selected
    if (selectedFileId) {
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === selectedFileId 
            ? { ...file, content } 
            : file
        )
      );
    }
  }, [selectedFileId]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left sidebar with file tree */}
        <div className="w-full lg:w-64 border-r border-muted overflow-hidden lg:h-screen">
          <Suspense fallback={<div className="p-4 text-center">Loading files...</div>}>
            <FileTree 
              files={fileTreeItems} 
              onSelectFile={handleSelectFile}
              onDeleteFile={handleDeleteFile}
              onClearAll={handleClearAll}
            />
          </Suspense>
        </div>

        {/* Main editor and preview area */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Editor panel */}
          <div className="w-full md:w-1/2 border-r border-muted h-[calc(100vh-13rem)] md:h-screen">
            <Suspense fallback={<div className="p-4">Loading editor...</div>}>
              <Editor 
                content={editorContent} 
                onChange={handleEditorChange} 
              />
            </Suspense>
          </div>
          
          {/* Rendered preview panel */}
          <div className="w-full md:w-1/2 h-[calc(100vh-13rem)] md:h-screen overflow-hidden">
            <div className="flex items-center justify-between p-2 border-b border-muted">
              <span className="text-sm font-medium">Rendered Output</span>
              <CopyButton textToCopy={selectedFileContent} />
            </div>
            <MdxRenderer content={selectedFileContent} />
          </div>
        </div>
      </div>

      {/* Bottom panel for uploading files */}
      <div className="p-4 border-t border-muted">
        <FileUpload 
          onFileUpload={handleFileUpload} 
          uploadProgress={uploadProgress}
        />
      </div>
    </div>
  );
};

export default MarkdownViewer;
