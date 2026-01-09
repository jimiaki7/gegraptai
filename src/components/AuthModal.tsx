import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    if (!isOpen) return null;

    const handleAuth = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onClose();
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('Confirmation email sent. Please check your inbox.');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setIsLoading(false);
        }
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

                <div className="welcome-modal-icon">🔐</div>

                <h2 className="welcome-modal-title">
                    {mode === 'login' ? 'Login' : 'Sign Up'}
                </h2>

                <p className="welcome-modal-description">
                    Save your notes to the cloud<br />
                    and sync across devices.
                </p>

                <form onSubmit={handleAuth} className="auth-form">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />

                    {error && <p className="auth-error">{error}</p>}
                    {message && <p className="auth-success">{message}</p>}

                    <button
                        type="submit"
                        className="welcome-modal-button primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-switch">
                    <span className="auth-switch-text">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <button
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="auth-switch-button"
                    >
                        {mode === 'login' ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
}
