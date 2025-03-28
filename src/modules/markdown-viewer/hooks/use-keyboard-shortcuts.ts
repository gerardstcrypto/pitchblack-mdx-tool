
import { useEffect } from 'react';
import { useSettingsStore } from '../store/settings-store';

export function useKeyboardShortcuts() {
  const { preferences, toggleSettings, isRecordingShortcut, updateShortcut } = useSettingsStore();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if input elements are focused
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }
      
      // If we're recording a shortcut
      if (isRecordingShortcut) {
        // Prevent default behavior
        e.preventDefault();
        
        const keys = [];
        if (e.ctrlKey) keys.push('Ctrl');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        if (e.metaKey) keys.push('Meta');
        
        // Add the key if it's not a modifier
        if (
          !['Control', 'Alt', 'Shift', 'Meta'].includes(e.key) &&
          !keys.includes(e.key)
        ) {
          keys.push(e.key.toLowerCase());
        }
        
        // Only update if we have at least one key
        if (keys.length > 0) {
          updateShortcut(isRecordingShortcut, keys);
        }
        
        return;
      }
      
      // Check for shortcuts
      const settingsShortcut = preferences.shortcuts.toggleSettings;
      
      // Check if shortcut keys match
      const isSettingsShortcut = checkShortcut(e, settingsShortcut.keys);
      
      if (isSettingsShortcut) {
        e.preventDefault();
        toggleSettings();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [preferences.shortcuts, toggleSettings, isRecordingShortcut, updateShortcut]);
}

// Helper to check if keyboard event matches shortcut keys
function checkShortcut(e: KeyboardEvent, shortcutKeys: string[]): boolean {
  const pressedModifiers = {
    Ctrl: e.ctrlKey,
    Alt: e.altKey,
    Shift: e.shiftKey,
    Meta: e.metaKey
  };
  
  // Copy the array to avoid mutating the original
  const keys = [...shortcutKeys];
  
  // Check if all required modifiers are pressed
  for (const modifier of ['Ctrl', 'Alt', 'Shift', 'Meta']) {
    const modifierIndex = keys.indexOf(modifier);
    if (modifierIndex !== -1) {
      // If modifier is in shortcut but not pressed, return false
      if (!pressedModifiers[modifier as keyof typeof pressedModifiers]) {
        return false;
      }
      // Remove modifier from keys array
      keys.splice(modifierIndex, 1);
    } else {
      // If modifier is pressed but not in shortcut, return false
      if (pressedModifiers[modifier as keyof typeof pressedModifiers]) {
        return false;
      }
    }
  }
  
  // Check if the main key matches
  return keys.length === 1 && keys[0].toLowerCase() === e.key.toLowerCase();
}

export default useKeyboardShortcuts;
