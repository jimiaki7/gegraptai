import React, { useState } from 'react';
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

    const handleAuth = async (e: React.FormEvent) => {
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
                setMessage('確認メールを送信しました。メールボックスを確認してください。');
            }
        } catch (err: any) {
            setError(err.message || '認証に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-prompt-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="auth-prompt-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '360px', padding: '32px' }}>
                <button
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '1.4rem', color: 'var(--color-text-muted)',
                        padding: '4px'
                    }}
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                        {mode === 'login' ? 'Login' : 'Sign Up'}
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Save your Bible study notes to the cloud.
                    </p>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-panel)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-panel)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {error && <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
                    {message && <p style={{ color: '#10b981', fontSize: '0.85rem', margin: 0 }}>{message}</p>}

                    <button
                        type="submit"
                        className="auth-button login"
                        disabled={isLoading}
                        style={{
                            width: '100%', marginTop: '8px', padding: '12px',
                            fontWeight: 600, fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        {isLoading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            style={{
                                background: 'none', border: 'none',
                                color: 'var(--color-accent)', cursor: 'pointer',
                                fontWeight: 600, marginLeft: '6px'
                            }}
                        >
                            {mode === 'login' ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
