import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabase_url = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabase_anon_key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabase_url, supabase_anon_key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable to detect session from URL (for OAuth callbacks)
  },
});
