import { useCallback, useEffect, useState } from 'react';
import { Settings } from '../types';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from '../data/storage';

interface UseSettingsReturn {
  settings: Settings;
  loading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from storage
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError(null);
        const storedSettings = await getSettings();
        setSettings(storedSettings);
      } catch (err) {
        setError('Failed to load settings');
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = useCallback(
    async (updates: Partial<Settings>): Promise<void> => {
      try {
        const newSettings = { ...settings, ...updates };
        await saveSettings(newSettings);
        setSettings(newSettings);
      } catch (err) {
        setError('Failed to save settings');
        throw err;
      }
    },
    [settings]
  );

  // Reset to default settings
  const resetSettings = useCallback(async (): Promise<void> => {
    try {
      await saveSettings(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
    } catch (err) {
      setError('Failed to reset settings');
      throw err;
    }
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
  };
}
