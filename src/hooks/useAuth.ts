import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
    id: string;
    email: string;
    full_name?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name,
                });
            }
            setIsInit(true);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name,
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loginWithGoogle = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (err) {
            console.error('[useAuth] loginWithGoogle error', err);
            throw err;
        }
    }, []);

    const login = useCallback(async () => {
        // Supabase login logic will be implemented in a dedicated Modal/UI component
        // This hook just provides the user state and login trigger
    }, []);

    const logout = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('[useAuth] signOut error', error);
            }
        } catch (e) {
            console.error('[useAuth] signOut exception', e);
        } finally {
            // Force local state cleanup even if server request fails (e.g. 403)
            setUser(null);
        }
    }, []);

    return {
        user,
        isInit,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
    };
}
