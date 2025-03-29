
import React from 'react';
import { Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useSettingsStore } from '../../store/settings-store';
import ShortcutRecorder from './shortcut-recorder';

const SettingsPanel: React.FC = () => {
  const { isSettingsOpen, toggleSettings, preferences, resetToDefaults } = useSettingsStore();
  
  return (
    <TooltipProvider>
      <Popover open={isSettingsOpen} onOpenChange={toggleSettings}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings (Shift+S)</p>
          </TooltipContent>
        </Tooltip>
        
        <PopoverContent 
          className="w-96 p-4" 
          sideOffset={5}
          align="end"
          forceMount
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-base">Markdown Viewer Settings</h4>
            </div>
            
            <Separator />
            
            <div>
              <h5 className="mb-2 text-sm font-medium">Keyboard Shortcuts</h5>
              <div className="space-y-2">
                {Object.keys(preferences.shortcuts).map(shortcutId => (
                  <ShortcutRecorder
                    key={shortcutId}
                    shortcutId={shortcutId}
                  />
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetToDefaults}
              >
                Reset to defaults
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default SettingsPanel;
