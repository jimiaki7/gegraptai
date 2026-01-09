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
                <a
                    href="https://www.buymeacoffee.com/tzkOt5b5yf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="coffee-link"
                >
                    <img
                        src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=tzkOt5b5yf&button_colour=676767&font_colour=ffffff&font_family=Cookie&outline_colour=ffffff&coffee_colour=FFDD00"
                        alt="Buy me a coffee"
                    />
                </a>

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
                    <span className="header-button-text">Print</span>
                </button>

                <SettingsToggle onClick={onOpenSettings} />

                <button
                    className={`header-button auth-toggle ${isAuthenticated ? 'is-authenticated' : 'is-guest'}`}
                    onClick={isAuthenticated ? onLogout : onLogin}
                    title={isAuthenticated ? 'Logout' : 'Sign In'}
                >
                    {isAuthenticated ? (
                        <>
                            <span className="header-button-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <span className="header-button-text">Logout</span>
                        </>
                    ) : (
                        <>
                            <span className="header-button-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                            </span>
                            <span className="header-button-text">Sign In</span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
};
