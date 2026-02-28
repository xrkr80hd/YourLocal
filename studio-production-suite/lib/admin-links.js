function extractProjectRef(supabaseUrl) {
  if (!supabaseUrl) {
    return '';
  }

  const match = String(supabaseUrl).match(/^https:\/\/([a-z0-9-]+)\.supabase\.co/i);
  return match ? match[1] : '';
}

export function getSupabaseAdminLinks() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const ref = extractProjectRef(supabaseUrl);

  if (!ref) {
    return {
      project: 'https://supabase.com/dashboard',
      tableEditor: 'https://supabase.com/dashboard',
      storage: 'https://supabase.com/dashboard',
    };
  }

  return {
    project: `https://supabase.com/dashboard/project/${ref}`,
    tableEditor: `https://supabase.com/dashboard/project/${ref}/editor`,
    storage: `https://supabase.com/dashboard/project/${ref}/storage/buckets`,
  };
}
