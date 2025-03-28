
import React from 'react';
import { Button } from "@/components/ui/button";
import { useSettingsStore } from '../../store/settings-store';

interface ShortcutRecorderProps {
  shortcutId: string;
}

const ShortcutRecorder: React.FC<ShortcutRecorderProps> = ({ shortcutId }) => {
  const { 
    preferences, 
    isRecordingShortcut,
    startRecordingShortcut,
    stopRecordingShortcut
  } = useSettingsStore();
  
  const shortcut = preferences.shortcuts[shortcutId];
  const isRecording = isRecordingShortcut === shortcutId;
  
  if (!shortcut) return null;
  
  // Format the keys for display
  const keysText = shortcut.keys.join(' + ');
  
  return (
    <div className="flex flex-row items-center justify-between gap-4 mb-2">
      <div className="flex-1">
        <p className="text-sm font-medium">{shortcut.name}</p>
        <p className="text-xs text-muted-foreground">{shortcut.description}</p>
      </div>
      
      {isRecording ? (
        <div className="relative">
          <div className="flex items-center justify-center bg-primary/10 border border-primary/30 rounded-md px-3 py-1 min-w-[100px] animate-pulse">
            <span className="text-sm">Recording...</span>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={stopRecordingShortcut}
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
          >
            ✕
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => startRecordingShortcut(shortcutId)}
          className="flex items-center gap-1"
        >
          <span className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded">{keysText}</span>
          <span className="ml-1">Record</span>
        </Button>
      )}
    </div>
  );
};

export default ShortcutRecorder;
