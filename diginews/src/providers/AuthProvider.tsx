import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { Session } from '@supabase/supabase-js';
import { Alert, AppState } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/src/lib/supabase';
import { makeRedirectUri } from 'expo-auth-session';

type AuthContextType = {
    session: Session | null;
    user: Session['user'] | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isLoading: true,
    signOut: async () => { },
});

// Auto-refresh session when app is in foreground
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);
                setSession(session);
                setIsLoading(false);

                // Store provider tokens when user signs in
                if (event === 'SIGNED_IN' && session) {
                    const { provider_token, provider_refresh_token } = session;

                    if (provider_refresh_token) {
                        // Store tokens in your database for Gmail API access
                        await supabase
                            .from('user_tokens')
                            .upsert({
                                user_id: session.user.id,
                                provider_token,
                                provider_refresh_token,
                                updated_at: new Date().toISOString(),
                            });
                    }
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        }
    };


    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                isLoading,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
