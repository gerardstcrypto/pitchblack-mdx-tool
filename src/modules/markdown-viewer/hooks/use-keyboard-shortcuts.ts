
import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settings-store';

export function useKeyboardShortcuts() {
  const { 
    preferences, 
    toggleSettings, 
    isRecordingShortcut, 
    updateShortcut 
  } = useSettingsStore();
  
  // Create references to store callback functions
  const editorFocusRef = useRef<HTMLTextAreaElement | null>(null);
  const editorClearRef = useRef<((content: string) => void) | null>(null);
  const editorCopyRef = useRef<(() => void) | null>(null);

  // Register editor element and callbacks
  const registerEditorCallbacks = (
    editorElement: HTMLTextAreaElement | null, 
    clearCallback: ((content: string) => void) | null,
    copyCallback: (() => void) | null
  ) => {
    editorFocusRef.current = editorElement;
    editorClearRef.current = clearCallback;
    editorCopyRef.current = copyCallback;
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if we're recording a shortcut
      if (isRecordingShortcut) {
        return;
      }
      
      // Skip if input elements are focused (except for specific shortcuts)
      if (
        (document.activeElement instanceof HTMLInputElement ||
         document.activeElement instanceof HTMLTextAreaElement) &&
        !(e.altKey && ['e', 'c', 'x'].includes(e.key.toLowerCase()))
      ) {
        return;
      }
      
      // Check for shortcuts
      const { shortcuts } = preferences;
      
      // Check each shortcut
      for (const shortcutId in shortcuts) {
        const shortcut = shortcuts[shortcutId];
        const isShortcutTriggered = checkShortcut(e, shortcut.keys);
        
        if (isShortcutTriggered) {
          e.preventDefault();
          
          // Handle the shortcut based on ID
          switch (shortcutId) {
            case 'toggleSettings':
              toggleSettings();
              break;
            case 'focusEditor':
              if (editorFocusRef.current) {
                editorFocusRef.current.focus();
              }
              break;
            case 'clearEditor':
              if (editorClearRef.current) {
                editorClearRef.current('');
              }
              break;
            case 'copyContent':
              if (editorCopyRef.current) {
                editorCopyRef.current();
              }
              break;
          }
          
          break; // Stop checking after finding a match
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [preferences.shortcuts, toggleSettings, isRecordingShortcut, updateShortcut]);
  
  return { registerEditorCallbacks };
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
