
import { useState, useCallback, useEffect } from 'react';
import { MarkdownFile } from '../types';

export function useEditorContent(
  selectedFileId: string | null,
  files: MarkdownFile[],
  setFiles: React.Dispatch<React.SetStateAction<MarkdownFile[]>>
) {
  // Editor content
  const [editorContent, setEditorContent] = useState<string>('');
  
  // Update editor content when selected file changes
  useEffect(() => {
    if (selectedFileId) {
      const selectedFile = files.find(f => f.id === selectedFileId);
      if (selectedFile) {
        setEditorContent(selectedFile.content);
      }
    }
  }, [selectedFileId, files]);

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
  }, [selectedFileId, setFiles]);

  // Get selected file content
  const getSelectedFileContent = useCallback(() => {
    return selectedFileId 
      ? files.find(f => f.id === selectedFileId)?.content || ''
      : editorContent;
  }, [selectedFileId, files, editorContent]);

  return {
    editorContent,
    setEditorContent,
    handleEditorChange,
    getSelectedFileContent
  };
}
