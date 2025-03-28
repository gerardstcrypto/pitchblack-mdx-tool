
import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { MarkdownFile, FileTreeItem, UploadProgress } from './types';
import { processMarkdownFile } from './helpers/markdown-processor';
import { toast } from "sonner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import SettingsPanel from './components/client/settings-panel';
import useKeyboardShortcuts from './hooks/use-keyboard-shortcuts';

// SSR Components (load immediately)
import MdxRenderer from './components/ssr/mdx-renderer';
import CopyButton from './components/client/copy-button';

// Lazy loaded client components (load after initial render)
const Editor = lazy(() => import('./components/client/editor'));
const FileTree = lazy(() => import('./components/client/file-tree'));

// This represents a module facade that will be rendered in the page
const MarkdownViewer: React.FC = () => {
  console.log('MarkdownViewer component rendering');
  
  // Use keyboard shortcuts
  useKeyboardShortcuts();
  
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
    <div className="fixed inset-0 flex flex-col">
      {/* Top bar with settings */}
      <div className="flex items-center justify-end h-10 px-4 border-b border-muted">
        <SettingsPanel />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left sidebar with file tree - make it narrower by default */}
          <ResizablePanel defaultSize={12} minSize={12} maxSize={30} className="border-r border-muted">
            <div className="flex flex-col h-full">
              <Suspense fallback={<div className="p-4 text-center">Loading files...</div>}>
                <FileTree 
                  files={fileTreeItems} 
                  onSelectFile={handleSelectFile}
                  onDeleteFile={handleDeleteFile}
                  onClearAll={handleClearAll}
                  onFileUpload={handleFileUpload}
                  uploadProgress={uploadProgress}
                />
              </Suspense>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Main editor and preview area */}
          <ResizablePanel defaultSize={88}>
            <ResizablePanelGroup direction="horizontal">
              {/* Editor panel */}
              <ResizablePanel defaultSize={50}>
                <Suspense fallback={<div className="p-4">Loading editor...</div>}>
                  <Editor 
                    content={editorContent} 
                    onChange={handleEditorChange} 
                  />
                </Suspense>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Rendered preview panel */}
              <ResizablePanel defaultSize={50}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-2 border-b border-muted h-10">
                    <span className="text-sm font-medium">Rendered Output</span>
                    <CopyButton textToCopy={selectedFileContent} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <MdxRenderer content={selectedFileContent} />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default MarkdownViewer;
