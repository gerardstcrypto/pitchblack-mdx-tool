
import React from 'react';
import { 
  Bold, 
  Italic, 
  Code, 
  List, 
  ListOrdered, 
  Quote, 
  Link,
  Heading1,
  Heading2,
  Heading3,
  AlertTriangle,
  Info,
  CheckCircle,
  AlertOctagon
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface MarkdownToolbarProps {
  onAction: (type: string, selection?: { start: number; end: number }) => void;
  selection: { start: number; end: number } | null;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ 
  onAction,
  selection
}) => {
  const tools = [
    { 
      icon: Bold, 
      name: 'Bold', 
      action: 'bold',
      shortcut: 'Ctrl+B',
      tooltip: 'Bold (Ctrl+B)'
    },
    { 
      icon: Italic, 
      name: 'Italic', 
      action: 'italic',
      shortcut: 'Ctrl+I',
      tooltip: 'Italic (Ctrl+I)'
    },
    { 
      icon: Heading1, 
      name: 'H1', 
      action: 'h1',
      shortcut: 'Ctrl+1',
      tooltip: 'Heading 1 (Ctrl+1)'
    },
    { 
      icon: Heading2, 
      name: 'H2', 
      action: 'h2',
      shortcut: 'Ctrl+2',
      tooltip: 'Heading 2 (Ctrl+2)'
    },
    { 
      icon: Heading3, 
      name: 'H3', 
      action: 'h3',
      shortcut: 'Ctrl+3',
      tooltip: 'Heading 3 (Ctrl+3)'
    },
    { 
      icon: Code, 
      name: 'Code', 
      action: 'code',
      shortcut: 'Ctrl+K',
      tooltip: 'Code Block (Ctrl+K)'
    },
    { 
      icon: List, 
      name: 'Bullet List', 
      action: 'bulletList',
      shortcut: 'Ctrl+U',
      tooltip: 'Bullet List (Ctrl+U)'
    },
    { 
      icon: ListOrdered, 
      name: 'Numbered List', 
      action: 'numberedList',
      shortcut: 'Ctrl+O',
      tooltip: 'Numbered List (Ctrl+O)'
    },
    { 
      icon: Quote, 
      name: 'Quote', 
      action: 'quote',
      shortcut: 'Ctrl+Q',
      tooltip: 'Blockquote (Ctrl+Q)'
    },
    { 
      icon: Link, 
      name: 'Link', 
      action: 'link',
      shortcut: 'Ctrl+L',
      tooltip: 'Link (Ctrl+L)'
    },
    // GitHub-flavored markdown additions
    { 
      icon: Info, 
      name: 'Note', 
      action: 'note',
      tooltip: 'Note Block'
    },
    { 
      icon: AlertTriangle, 
      name: 'Warning', 
      action: 'warning',
      tooltip: 'Warning Block'
    },
    { 
      icon: CheckCircle, 
      name: 'Tip', 
      action: 'tip',
      tooltip: 'Tip Block'
    },
    { 
      icon: AlertOctagon, 
      name: 'Important', 
      action: 'important',
      tooltip: 'Important Block'
    }
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-md markdown-toolbar flex-wrap">
      {tools.map((tool) => (
        <TooltipProvider key={tool.action} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 toolbar-btn"
                onClick={() => onAction(tool.action, selection)}
                aria-label={tool.name}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{tool.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default MarkdownToolbar;
