

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
}

export function WelcomeModal({ isOpen, onClose, onLoginClick }: WelcomeModalProps) {
    if (!isOpen) return null;

    const handleLogin = () => {
        onClose();
        onLoginClick();
    };

    return (
        <div className="welcome-modal-overlay" onClick={onClose}>
            <div className="welcome-modal-box" onClick={(e) => e.stopPropagation()}>
                <button
                    className="welcome-modal-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>

                <div className="welcome-modal-icon">📖</div>

                <h2 className="welcome-modal-title">Welcome to Gegraptai</h2>

                <p className="welcome-modal-description">
                    A web app for biblical text study.<br />
                    All features available without login.
                </p>

                <p className="welcome-modal-subtitle">
                    Login to save your notes across devices.
                </p>

                <div className="welcome-modal-actions">
                    <button
                        className="welcome-modal-button primary"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                    <button
                        className="welcome-modal-button secondary"
                        onClick={onClose}
                    >
                        Continue without Login
                    </button>
                </div>
            </div>
        </div>
    );
}
