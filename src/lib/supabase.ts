import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvvryyrkmarfwuxnanue.supabase.co';
const supabaseAnonKey = 'sb_publishable_NBT0Old1OtOwtwALCYOh1g_TdMnpiu0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
