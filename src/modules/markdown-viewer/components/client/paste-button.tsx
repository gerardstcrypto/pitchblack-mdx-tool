
import React from 'react';
import { Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PasteButtonProps {
  onPaste: (text: string) => void;
}

const PasteButton: React.FC<PasteButtonProps> = ({ onPaste }) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onPaste(text);
        toast.success('Content pasted');
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      toast.error('Failed to read clipboard');
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handlePaste}
      title="Paste from clipboard"
      aria-label="Paste from clipboard"
    >
      <Clipboard className="h-4 w-4" />
    </Button>
  );
};

export default PasteButton;
