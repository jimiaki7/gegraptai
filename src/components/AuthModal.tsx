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

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Google Login failed.');
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

                <div className="auth-social-buttons">
                    <button
                        onClick={handleGoogleLogin}
                        className="welcome-modal-button google-auth-button"
                        disabled={isLoading}
                    >
                        <span className="google-icon">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.23.81-.61z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </span>
                        Continue with Google
                    </button>
                </div>

                <div className="auth-divider">
                    <span className="auth-divider-text">OR</span>
                </div>

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
