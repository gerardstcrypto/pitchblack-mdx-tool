
import React from 'react';
import { ResizablePanel } from "@/components/ui/resizable";
import Editor from '../client/editor';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EditorPanelProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ content, onChange, onSave }) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      toast.error("No file selected to save");
    }
  };

  return (
    <ResizablePanel defaultSize={50} className="min-h-0 flex flex-col bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between p-2 border-b border-muted h-10 shrink-0">
        <span className="text-sm font-medium">Markdown Input</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSave}
          className="h-8 px-2"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
      <Editor 
        content={content} 
        onChange={onChange} 
      />
    </ResizablePanel>
  );
};

export default EditorPanel;
