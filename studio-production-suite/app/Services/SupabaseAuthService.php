<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseAuthService
{
    public function fetchUserFromToken(?string $accessToken): ?array
    {
        $baseUrl = rtrim((string) config('supabase.url', ''), '/');
        $anonKey = (string) config('supabase.anon_key', '');

        if ($accessToken === null || $accessToken === '' || $baseUrl === '' || $anonKey === '') {
            return null;
        }

        $response = Http::acceptJson()
            ->timeout((int) config('supabase.http_timeout_seconds', 5))
            ->withHeaders([
                'apikey' => $anonKey,
                'Authorization' => 'Bearer '.$accessToken,
            ])
            ->get($baseUrl.'/auth/v1/user');

        if (! $response->ok()) {
            return null;
        }

        $user = $response->json();

        return is_array($user) ? $user : null;
    }

    public function isAdminUser(array $user): bool
    {
        $adminEmails = config('supabase.admin_emails', []);
        $email = strtolower((string) ($user['email'] ?? ''));

        if ($email !== '' && is_array($adminEmails) && in_array($email, $adminEmails, true)) {
            return true;
        }

        if ((bool) data_get($user, 'user_metadata.is_admin', false)) {
            return true;
        }

        $allowedRoles = config('supabase.admin_roles', []);
        if (! is_array($allowedRoles) || $allowedRoles === []) {
            return false;
        }

        $candidateRoles = [];
        $appRole = data_get($user, 'app_metadata.role');
        if (is_string($appRole) && $appRole !== '') {
            $candidateRoles[] = strtolower($appRole);
        }

        $appRoles = data_get($user, 'app_metadata.roles', []);
        if (is_array($appRoles)) {
            foreach ($appRoles as $role) {
                if (is_string($role) && $role !== '') {
                    $candidateRoles[] = strtolower($role);
                }
            }
        }

        foreach ($candidateRoles as $candidateRole) {
            if (in_array($candidateRole, $allowedRoles, true)) {
                return true;
            }
        }

        return false;
    }
}
