
import React, { useState, useEffect } from 'react';
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
    stopRecordingShortcut,
    updateShortcut
  } = useSettingsStore();
  
  const shortcut = preferences.shortcuts[shortcutId];
  const isRecording = isRecordingShortcut === shortcutId;
  const [keysPressed, setKeysPressed] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isRecording) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      // Create new array with current keys
      const newKeys = [...keysPressed];
      
      // Add modifiers if pressed
      if (e.ctrlKey && !newKeys.includes('Ctrl')) newKeys.push('Ctrl');
      if (e.altKey && !newKeys.includes('Alt')) newKeys.push('Alt');
      if (e.shiftKey && !newKeys.includes('Shift')) newKeys.push('Shift');
      if (e.metaKey && !newKeys.includes('Meta')) newKeys.push('Meta');
      
      // Add the key if it's not a modifier and not already added
      const key = e.key.toLowerCase();
      if (!['control', 'alt', 'shift', 'meta'].includes(key) && 
          !newKeys.includes(key)) {
        newKeys.push(key);
      }
      
      setKeysPressed(newKeys);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Only stop recording when all keys are released
      if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && keysPressed.length > 0) {
        // Update the shortcut with the keys pressed
        updateShortcut(shortcutId, keysPressed);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording, keysPressed, shortcutId, updateShortcut]);
  
  if (!shortcut) return null;
  
  // Format the keys for display
  const keysText = isRecording 
    ? keysPressed.join(' + ') || 'Press keys...' 
    : shortcut.keys.join(' + ');
  
  return (
    <div className="flex flex-row items-center justify-between gap-4 mb-2">
      <div className="flex-1">
        <p className="text-sm font-medium">{shortcut.name}</p>
        <p className="text-xs text-muted-foreground">{shortcut.description}</p>
      </div>
      
      {isRecording ? (
        <div className="relative">
          <div className="flex items-center justify-center bg-primary/10 border border-primary/30 rounded-md px-3 py-1 min-w-[120px]">
            <span className="text-sm font-mono">{keysText}</span>
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
          onClick={() => {
            startRecordingShortcut(shortcutId);
            setKeysPressed([]);
          }}
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
