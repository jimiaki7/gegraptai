import React from 'react';
import { ReferenceInput } from './ReferenceInput';
import { SettingsToggle } from './SettingsPanel';

interface HeaderProps {
    isAuthenticated: boolean;
    onLogin: () => void;
    onLogout: () => void;
    onPrint: () => void;
    onOpenSettings: () => void;
    onReferenceSubmit: (input: string) => void;
    error: string | null;
    disablePrint: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    isAuthenticated,
    onLogin,
    onLogout,
    onPrint,
    onOpenSettings,
    onReferenceSubmit,
    error,
    disablePrint
}) => {
    return (
        <header className="app-header" onClick={(e) => e.stopPropagation()}>
            <div className="app-logo">📖 <span>Gegraptai</span></div>

            <ReferenceInput onSubmit={onReferenceSubmit} error={error} />

            <div className="header-actions">


                <button
                    className={`header-button auth-toggle ${isAuthenticated ? 'is-authenticated' : 'is-guest'}`}
                    onClick={isAuthenticated ? onLogout : onLogin}
                    title={isAuthenticated ? 'Logout' : 'Login'}
                >
                    {isAuthenticated ? (
                        <span className="header-button-text">Logout</span>
                    ) : (
                        <span className="header-button-text">Login</span>
                    )}
                </button>

                <button
                    className="header-button"
                    onClick={onPrint}
                    title="Print / PDF Export"
                    disabled={disablePrint}
                >
                    <span className="header-button-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9V2h12v7" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                    </span>
                </button>

                <SettingsToggle onClick={onOpenSettings} />
            </div>
        </header>
    );
};
