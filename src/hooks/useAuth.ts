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

    const login = useCallback(async () => {
        // Supabase login logic will be implemented in a dedicated Modal/UI component
        // This hook just provides the user state and login trigger
        console.log('[Gegraptai Auth] login trigger');
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    return {
        user,
        isInit,
        login,
        logout,
        isAuthenticated: !!user,
    };
}
