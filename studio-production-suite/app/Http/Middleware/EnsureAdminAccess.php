<?php

namespace App\Http\Middleware;

use App\Services\SupabaseAuthService;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAccess
{
    public function __construct(private readonly SupabaseAuthService $supabaseAuth)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            return $next($request);
        }

        $accessToken = $this->extractAccessToken($request);
        if ($accessToken === null) {
            return $this->redirectToLogin($request);
        }

        $supabaseUser = $this->supabaseAuth->fetchUserFromToken($accessToken);
        if (! is_array($supabaseUser) || ! $this->supabaseAuth->isAdminUser($supabaseUser)) {
            return $this->redirectToLogin($request);
        }

        $request->attributes->set('supabase_user', $supabaseUser);

        return $next($request);
    }

    private function extractAccessToken(Request $request): ?string
    {
        $bearerToken = $request->bearerToken();
        if (is_string($bearerToken) && $bearerToken !== '') {
            return $bearerToken;
        }

        $cookieName = (string) config('supabase.access_token_cookie', 'sb_access_token');
        $cookieToken = $request->cookie($cookieName);
        if (is_string($cookieToken) && $cookieToken !== '') {
            return $cookieToken;
        }

        return null;
    }

    private function redirectToLogin(Request $request): RedirectResponse|Response
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return redirect()
            ->route('admin.login')
            ->withErrors(['email' => 'Please sign in with an authorized admin account.']);
    }
}
