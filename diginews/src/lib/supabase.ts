import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabase_url = process.env.SUPABASE_URL as string;
const supabase_anon_key = process.env.SUPABASE_ANON_KEY as string;

export const supabase = createClient("https://iwutjfyqfyslfrsbqypz.supabase.co", "sb_publishable_qa9lhdvKAlcAC32UWCmU0w_CBAS_a8q", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable to detect session from URL (for OAuth callbacks)
  },
});
