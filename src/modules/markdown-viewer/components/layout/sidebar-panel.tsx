
import React, { Suspense, lazy } from 'react';
import { ResizablePanel } from "@/components/ui/resizable";
import { FileTreeItem, UploadProgress } from '../../types';

const FileTree = lazy(() => import('../client/file-tree'));

interface SidebarPanelProps {
  fileTreeItems: FileTreeItem[];
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onClearAll: () => void;
  onFileUpload: (files: File[]) => void;
  uploadProgress: Record<string, UploadProgress>;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  fileTreeItems,
  onSelectFile,
  onDeleteFile,
  onClearAll,
  onFileUpload,
  uploadProgress
}) => {
  return (
    <ResizablePanel defaultSize={12} minSize={12} maxSize={30} className="border-r border-muted">
      <div className="flex flex-col h-full">
        <Suspense fallback={<div className="p-4 text-center">Loading files...</div>}>
          <FileTree 
            files={fileTreeItems} 
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
            onClearAll={onClearAll}
            onFileUpload={onFileUpload}
            uploadProgress={uploadProgress}
          />
        </Suspense>
      </div>
    </ResizablePanel>
  );
};

export default SidebarPanel;
