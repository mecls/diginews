import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
type AuthContextType = {
    session: Session | null;
    user: Session['user'] | null;
    isLoading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isLoading: true,
    signIn: async () => { },
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
GoogleSignin.configure({
    webClientId: '665235672767-kp3nle1b9pq2d53knhb7odonuk90kp1k.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    iosClientId: '665235672767-5egk0fi2s8glfd0tqapkbaqgag2m1bvr.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
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

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);
                setSession(session);
                setIsLoading(false);
            }
        );


        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!isLoading && session) {
            router.replace('/');
        }
    }, [session, isLoading]);

    const [state, setState] = useState<{ userInfo: any | null }>({ userInfo: null });

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                setState({ userInfo: response.data });
                console.log(response.data);
                if (response.data.idToken) {
                    const { data, error } = await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: response.data.idToken,
                    });

                    if (error) {
                        console.error('Supabase sign-in error:', error);
                    }
                } else {
                    throw new Error('No idToken found');
                }
            } else {
                // sign in was cancelled by user
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // Android only, play services not available or outdated
                        break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
            }
        }
    };

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
                signIn,
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
