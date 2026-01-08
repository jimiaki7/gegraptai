import { UserSettings } from '../types';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    settings: UserSettings;
    onThemeChange: (theme: UserSettings['theme']) => void;
    onFontSizeHebrewChange: (size: number) => void;
    onFontSizeGreekChange: (size: number) => void;
    onFontFamilyHebrewChange: (family: string) => void;
    onFontFamilyGreekChange: (family: string) => void;
    onLineHeightChange: (height: number) => void;
    onExportAnnotations: () => void;
    onImportAnnotations: (file: File) => Promise<void>;
}

export function SettingsPanel({
    isOpen,
    onClose,
    settings,
    onThemeChange,
    onFontSizeHebrewChange,
    onFontSizeGreekChange,
    onFontFamilyHebrewChange,
    onFontFamilyGreekChange,
    onLineHeightChange,
    onExportAnnotations,
    onImportAnnotations,
}: SettingsPanelProps) {
    return (
        <div className={`settings-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
                <div className="settings-header">
                    <h2 className="settings-title">Settings</h2>
                    <button className="settings-close" onClick={onClose} aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="settings-body">
                    {/* Theme Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">Theme</h3>
                        <div className="theme-toggle">
                            <button
                                className={`theme-toggle-option ${settings.theme === 'light' ? 'active' : ''}`}
                                onClick={() => onThemeChange('light')}
                            >
                                Light
                            </button>
                            <button
                                className={`theme-toggle-option ${settings.theme === 'system' ? 'active' : ''}`}
                                onClick={() => onThemeChange('system')}
                            >
                                System
                            </button>
                            <button
                                className={`theme-toggle-option ${settings.theme === 'dark' ? 'active' : ''}`}
                                onClick={() => onThemeChange('dark')}
                            >
                                Dark
                            </button>
                        </div>
                    </div>

                    {/* Font Family Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">Font Family</h3>

                        <div className="settings-field">
                            <label className="settings-label">Hebrew / Aramaic</label>
                            <select
                                className="settings-select"
                                value={settings.fontFamilyHebrew}
                                onChange={(e) => onFontFamilyHebrewChange(e.target.value)}
                            >
                                <option value="Frank Ruhl Libre">Frank Ruhl Libre (Serif)</option>
                                <option value="David Libre">David Libre (Serif)</option>
                                <option value="Noto Sans Hebrew">Noto Sans (Sans-serif)</option>
                            </select>
                        </div>

                        <div className="settings-field">
                            <label className="settings-label">Greek</label>
                            <select
                                className="settings-select"
                                value={settings.fontFamilyGreek}
                                onChange={(e) => onFontFamilyGreekChange(e.target.value)}
                            >
                                <option value="Noto Serif">Noto Serif (Serif)</option>
                                <option value="Cardo">Cardo (Scholar)</option>
                                <option value="Inter">Inter (Sans-serif - for UI)</option>
                            </select>
                        </div>
                    </div>

                    {/* Font Size Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">Font Size</h3>

                        <div className="settings-field">
                            <label className="settings-label">Hebrew / Aramaic</label>
                            <div className="settings-slider">
                                <input
                                    type="range"
                                    min="20"
                                    max="48"
                                    value={settings.fontSizeHebrew}
                                    onChange={(e) => onFontSizeHebrewChange(Number(e.target.value))}
                                />
                                <span className="settings-slider-value">{settings.fontSizeHebrew}px</span>
                            </div>
                        </div>

                        <div className="settings-field">
                            <label className="settings-label">Greek</label>
                            <div className="settings-slider">
                                <input
                                    type="range"
                                    min="20"
                                    max="36"
                                    value={settings.fontSizeGreek}
                                    onChange={(e) => onFontSizeGreekChange(Number(e.target.value))}
                                />
                                <span className="settings-slider-value">{settings.fontSizeGreek}px</span>
                            </div>
                        </div>


                    </div>

                    {/* Line Height Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">Line Height</h3>
                        <div className="settings-field">
                            <label className="settings-label">Line Height: {settings.lineHeight.toFixed(1)}</label>
                            <div className="settings-slider">
                                <input
                                    type="range"
                                    min="2.0"
                                    max="5.0"
                                    step="0.1"
                                    value={settings.lineHeight}
                                    onChange={(e) => onLineHeightChange(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Management Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">Data Management</h3>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                            You can export and import your annotations in JSON format. (入力した文法パースや釈義メモを JSON ファイルとして保存・復元できます)
                        </p>
                        <div className="settings-actions">
                            <button className="settings-button primary" onClick={onExportAnnotations}>
                                Export Data (JSON)
                            </button>
                            <label className="settings-button secondary">
                                Import Data (JSON)
                                <input
                                    type="file"
                                    accept=".json"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (confirm('Current data will be overwritten. Are you sure? 現在のデータは上書きされます。よろしいですか？')) {
                                                onImportAnnotations(file).then(() => {
                                                    alert('Import completed: インポートが完了しました');
                                                }).catch((err) => {
                                                    alert('Import failed: インポートに失敗しました: ' + err.message);
                                                });
                                            }
                                            e.target.value = ''; // Reset input
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Settings Toggle Button Component
export function SettingsToggle({ onClick }: { onClick: () => void }) {
    return (
        <button className="settings-toggle" onClick={onClick} aria-label="Open Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        </button>
    );
}
