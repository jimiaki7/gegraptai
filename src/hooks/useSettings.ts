import { useState, useEffect, useCallback } from 'react';
import { UserSettings } from '../types';

const STORAGE_KEY = 'bible-study-settings';

const DEFAULT_SETTINGS: UserSettings = {
    theme: 'system',
    fontSizeHebrew: 28,
    fontSizeGreek: 28,
    fontFamilyHebrew: 'Frank Ruhl Libre',
    fontFamilyGreek: 'Noto Serif',
    lineHeight: 1.6,
    showMorphUnderWords: true,
    showHighlights: true,
};

export function useSettings() {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    }, []);

    // Save to localStorage when settings change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }, [settings]);

    // Apply theme
    useEffect(() => {
        const applyTheme = () => {
            const { theme } = settings;
            let effectiveTheme: 'light' | 'dark' = 'light';

            if (theme === 'system') {
                effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } else {
                effectiveTheme = theme;
            }

            document.documentElement.setAttribute('data-theme', effectiveTheme);
        };

        applyTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            if (settings.theme === 'system') {
                applyTheme();
            }
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [settings.theme]);

    const updateSetting = useCallback(<K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    }, []);

    const setTheme = useCallback((theme: UserSettings['theme']) => {
        updateSetting('theme', theme);
    }, [updateSetting]);

    const setFontSizeHebrew = useCallback((size: number) => {
        updateSetting('fontSizeHebrew', size);
    }, [updateSetting]);

    const setFontSizeGreek = useCallback((size: number) => {
        updateSetting('fontSizeGreek', size);
    }, [updateSetting]);

    const setFontFamilyHebrew = useCallback((family: string) => {
        updateSetting('fontFamilyHebrew', family);
    }, [updateSetting]);

    const setFontFamilyGreek = useCallback((family: string) => {
        updateSetting('fontFamilyGreek', family);
    }, [updateSetting]);

    const setLineHeight = useCallback((height: number) => {
        updateSetting('lineHeight', height);
    }, [updateSetting]);

    // Apply font settings to CSS variables
    useEffect(() => {
        document.documentElement.style.setProperty('--font-family-hebrew', `"${settings.fontFamilyHebrew}", "SBL Hebrew", "Ezra SIL", serif`);
        document.documentElement.style.setProperty('--font-family-greek', `"${settings.fontFamilyGreek}", "SBL Greek", "Gentium", serif`);
        document.documentElement.style.setProperty('--line-height', settings.lineHeight.toString());
    }, [settings.fontFamilyHebrew, settings.fontFamilyGreek, settings.lineHeight]);

    return {
        settings,
        setTheme,
        setFontSizeHebrew,
        setFontSizeGreek,
        setFontFamilyHebrew,
        setFontFamilyGreek,
        setLineHeight,
        updateSetting,
    };
}
