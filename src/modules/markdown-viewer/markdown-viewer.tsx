
import React, { Suspense } from 'react';
import { FileTreeItem } from './types';
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import SettingsPanel from './components/client/settings-panel';
import useKeyboardShortcuts from './hooks/use-keyboard-shortcuts';
import { useFiles } from './hooks/use-files';
import { useEditorContent } from './hooks/use-editor-content';
import SidebarPanel from './components/layout/sidebar-panel';
import EditorPanel from './components/layout/editor-panel';
import PreviewPanel from './components/layout/preview-panel';
import { toast } from 'sonner';

// This represents a module facade that will be rendered in the page
const MarkdownViewer: React.FC = () => {
  console.log('MarkdownViewer component rendering');
  
  // Use keyboard shortcuts
  useKeyboardShortcuts();
  
  // Use files hook
  const {
    files,
    selectedFileId,
    uploadProgress,
    handleFileUpload,
    handleSelectFile,
    handleDeleteFile,
    handleClearAll,
    setFiles,
    handleSaveNewFile
  } = useFiles();

  // Use editor content hook
  const {
    editorContent,
    handleEditorChange,
    getSelectedFileContent
  } = useEditorContent(selectedFileId, files, setFiles);

  // Transform files for the file tree component
  const fileTreeItems: FileTreeItem[] = files.map(file => ({
    id: file.id,
    name: file.name,
    isSelected: file.id === selectedFileId
  }));

  // Get the content to display
  const selectedFileContent = getSelectedFileContent();

  // Handle save action
  const handleSave = () => {
    if (selectedFileId) {
      // Just update the UI since the content is already being saved on change
      toast.success("File saved successfully");
    } else if (editorContent.trim()) {
      // Save as a new file if there's content but no selected file
      handleSaveNewFile(editorContent);
    } else {
      toast.error("Nothing to save");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Top bar with settings */}
      <div className="flex items-center justify-end h-10 px-4 border-b border-muted">
        <SettingsPanel />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left sidebar with file tree */}
          <SidebarPanel 
            fileTreeItems={fileTreeItems}
            onSelectFile={handleSelectFile}
            onDeleteFile={handleDeleteFile}
            onClearAll={handleClearAll}
            onFileUpload={handleFileUpload}
            uploadProgress={uploadProgress}
          />
          
          <ResizableHandle withHandle />
          
          {/* Main editor and preview area */}
          <ResizablePanel defaultSize={88}>
            <ResizablePanelGroup direction="horizontal">
              {/* Editor panel */}
              <EditorPanel 
                content={editorContent} 
                onChange={handleEditorChange}
                onSave={handleSave}
              />
              
              <ResizableHandle withHandle />
              
              {/* Rendered preview panel */}
              <PreviewPanel content={selectedFileContent} />
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default MarkdownViewer;
