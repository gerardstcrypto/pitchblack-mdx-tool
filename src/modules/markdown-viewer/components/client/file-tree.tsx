
import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { FileTreeItem } from '../../types';

interface FileTreeProps {
  files: FileTreeItem[];
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onClearAll: () => void;
}

const FileTree: React.FC<FileTreeProps> = ({ 
  files, 
  onSelectFile, 
  onDeleteFile,
  onClearAll 
}) => {
  if (files.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-2 border-b border-muted">
          <span className="text-sm font-medium">No files</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground text-sm">
          Drag & drop markdown files here
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-muted">
        <span className="text-sm font-medium">Files ({files.length})</span>
        {files.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="overflow-auto flex-1">
        <ul className="divide-y divide-muted/40">
          {files.map((file) => (
            <li 
              key={file.id}
              className={`flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-secondary/50 transition-colors ${
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
      </div>
    </div>
  );
};

export default FileTree;
