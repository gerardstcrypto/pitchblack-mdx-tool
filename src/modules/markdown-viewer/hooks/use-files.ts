
import { useState, useCallback } from 'react';
import { MarkdownFile, UploadProgress } from '../types';
import { processMarkdownFile } from '../helpers/markdown-processor';
import { toast } from "sonner";
import { generateId } from '../helpers/markdown-processor';

export function useFiles() {
  // State for markdown files
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});

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
    }

    toast.success('File deleted');
  }, [selectedFileId]);

  // Handle clearing all files
  const handleClearAll = useCallback(() => {
    setFiles([]);
    setSelectedFileId(null);
    toast.success('All files cleared');
  }, []);

  // Handle saving new file
  const handleSaveNewFile = useCallback((content: string) => {
    const newFileId = generateId();
    const newFile: MarkdownFile = {
      id: newFileId,
      name: `untitled-${newFileId.substring(0, 4)}.md`,
      content,
      createdAt: new Date(),
    };
    
    setFiles(prevFiles => [...prevFiles, newFile]);
    setSelectedFileId(newFileId);
    toast.success(`File saved as ${newFile.name}`);
  }, []);

  return {
    files,
    selectedFileId,
    uploadProgress,
    handleFileUpload,
    handleSelectFile,
    handleDeleteFile,
    handleClearAll,
    handleSaveNewFile,
    setFiles
  };
}
