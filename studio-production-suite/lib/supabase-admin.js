import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

function readEnv(name) {
  return process.env[name] || '';
}

export function getSupabaseAdmin() {
  if (cachedClient) {
    return cachedClient;
  }

  const url = readEnv('SUPABASE_URL') || readEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = readEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!url || !key) {
    return null;
  }

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
