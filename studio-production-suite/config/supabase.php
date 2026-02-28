<?php

$parseCsv = static function (string $value): array {
    if ($value === '') {
        return [];
    }

    return array_values(array_filter(array_map(
        static fn (string $item): string => strtolower(trim($item)),
        explode(',', $value)
    )));
};

return [
    'url' => env('SUPABASE_URL', ''),
    'anon_key' => env('SUPABASE_ANON_KEY', ''),
    'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY', ''),
    'enabled' => env('SUPABASE_ENABLED', false),
    'http_timeout_seconds' => (int) env('SUPABASE_HTTP_TIMEOUT_SECONDS', 5),
    'storage' => [
        'enabled' => env('SUPABASE_STORAGE_ENABLED', false),
        'bucket' => env('SUPABASE_STORAGE_BUCKET', ''),
        'path_prefix' => trim((string) env('SUPABASE_STORAGE_PATH_PREFIX', 'uploads'), '/'),
    ],

    'access_token_cookie' => env('SUPABASE_ACCESS_TOKEN_COOKIE', 'sb_access_token'),
    'access_token_cookie_minutes' => (int) env('SUPABASE_ACCESS_TOKEN_COOKIE_MINUTES', 10080),
    'access_token_cookie_secure' => env('SUPABASE_ACCESS_TOKEN_COOKIE_SECURE', env('APP_ENV') === 'production'),

    'admin_emails' => $parseCsv((string) env('SUPABASE_ADMIN_EMAILS', '')),
    'admin_roles' => $parseCsv((string) env('SUPABASE_ADMIN_ROLES', 'admin,owner')),
];
