
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Shortcut {
  id: string;
  name: string;
  keys: string[];
  description: string;
}

export interface UserPreferences {
  shortcuts: Record<string, Shortcut>;
  syntaxTheme: string;
  keepSettingsOpen: boolean;
  fonts: {
    headings: string;
    body: string;
    code: string;
  };
}

interface SettingsState {
  preferences: UserPreferences;
  isSettingsOpen: boolean;
  isRecordingShortcut: string | null;
  
  toggleSettings: () => void;
  updateShortcut: (id: string, keys: string[]) => void;
  startRecordingShortcut: (id: string) => void;
  stopRecordingShortcut: () => void;
  resetToDefaults: () => void;
  updatePreference: <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  shortcuts: {
    toggleSettings: {
      id: 'toggleSettings',
      name: 'Toggle Settings',
      keys: ['Shift', 's'],
      description: 'Open or close the settings panel'
    },
    focusEditor: {
      id: 'focusEditor',
      name: 'Focus Editor',
      keys: ['Alt', 'e'],
      description: 'Focus the markdown editor'
    },
    clearEditor: {
      id: 'clearEditor',
      name: 'Clear Editor',
      keys: ['Alt', 'c'],
      description: 'Clear the entire editor content'
    },
    copyContent: {
      id: 'copyContent',
      name: 'Copy Content',
      keys: ['Alt', 'x'],
      description: 'Copy all editor content to clipboard'
    }
  },
  syntaxTheme: 'tomorrow',
  keepSettingsOpen: false,
  fonts: {
    headings: 'system-ui',
    body: 'system-ui',
    code: 'monospace'
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      preferences: DEFAULT_PREFERENCES,
      isSettingsOpen: false,
      isRecordingShortcut: null,
      
      toggleSettings: () => set((state) => ({ 
        isSettingsOpen: !state.isSettingsOpen 
      })),
      
      updateShortcut: (id, keys) => set((state) => ({
        preferences: {
          ...state.preferences,
          shortcuts: {
            ...state.preferences.shortcuts,
            [id]: {
              ...state.preferences.shortcuts[id],
              keys
            }
          }
        },
        isRecordingShortcut: null
      })),
      
      startRecordingShortcut: (id) => set({
        isRecordingShortcut: id
      }),
      
      stopRecordingShortcut: () => set({
        isRecordingShortcut: null
      }),
      
      resetToDefaults: () => set({
        preferences: DEFAULT_PREFERENCES
      }),
      
      updatePreference: (key, value) => set((state) => ({
        preferences: {
          ...state.preferences,
          [key]: value
        }
      }))
    }),
    {
      name: 'markdown-viewer-settings',
    }
  )
);
