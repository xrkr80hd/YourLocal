<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SupabaseAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class AdminSupabaseSessionController extends Controller
{
    public function store(Request $request, SupabaseAuthService $supabaseAuth): RedirectResponse
    {
        $validated = $request->validate([
            'access_token' => ['required', 'string', 'max:4096'],
        ]);

        $supabaseUser = $supabaseAuth->fetchUserFromToken($validated['access_token']);
        if (! is_array($supabaseUser) || ! $supabaseAuth->isAdminUser($supabaseUser)) {
            return back()->withErrors([
                'access_token' => 'Supabase admin authorization failed.',
            ]);
        }

        $cookieName = (string) config('supabase.access_token_cookie', 'sb_access_token');
        $cookieMinutes = (int) config('supabase.access_token_cookie_minutes', 10080);
        $cookieSecure = (bool) config('supabase.access_token_cookie_secure', false);

        return redirect()
            ->route('admin.dashboard')
            ->withCookie(Cookie::make(
                $cookieName,
                $validated['access_token'],
                $cookieMinutes,
                '/',
                null,
                $cookieSecure,
                true,
                false,
                'lax'
            ));
    }

    public function destroy(Request $request): RedirectResponse
    {
        if (Auth::check()) {
            Auth::logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()
            ->route('admin.login')
            ->withoutCookie((string) config('supabase.access_token_cookie', 'sb_access_token'));
    }
}
