import { supabase } from '@/src/lib/supabase';
import {
    GoogleSignin,
    GoogleSigninButton,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function Login() {
    const [state, setState] = useState<{ userInfo: any | null }>({ userInfo: null });

    GoogleSignin.configure({
        webClientId: '665235672767-kp3nle1b9pq2d53knhb7odonuk90kp1k.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
        scopes: [
            /* what APIs you want to access on behalf of the user, default is email and profile
            this is just an example, most likely you don't need this option at all! */
            'https://www.googleapis.com/auth/drive.readonly',
        ],
        iosClientId: '665235672767-5egk0fi2s8glfd0tqapkbaqgag2m1bvr.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                setState({ userInfo: response.data });
                console.log(response.data);

                if (!response.data.idToken) {
                    const { data, error } = await supabase.auth.signInWithIdToken({
                        'provider': 'google',
                        'token': response.data.idToken ?? '',
                    });
                    console.log({ data, error });
                } else { throw new Error('No idToken found') }
                router.replace('/'); // Redirect to home page after successful login
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

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => {
                    signIn();
                }}
            />
        </View>
    )
}