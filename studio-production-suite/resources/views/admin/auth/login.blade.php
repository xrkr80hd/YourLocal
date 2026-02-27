@extends('layouts.app')

@section('content')
<section class="card admin-login-card" style="max-width:460px;margin:0 auto;">
    <h1 style="margin-top:0">Admin Login</h1>
    <p class="meta">Manage bio, music, projects, blog, and media.</p>

    <form method="POST" action="{{ route('admin.login.attempt') }}">
        @csrf
        <div class="form-row">
            <label>Email</label>
            <input name="email" type="email" value="{{ old('email') }}" required>
            @error('email')<p class="error">{{ $message }}</p>@enderror
        </div>
        <div class="form-row">
            <label>Password</label>
            <input name="password" type="password" required>
        </div>
        <button class="button primary" type="submit">Login</button>
    </form>

    @if(config('supabase.enabled'))
        <hr style="margin:1.25rem 0;border:0;border-top:1px solid rgba(255,255,255,0.16);">
        <p class="meta" style="margin:0 0 .5rem">Supabase admin session token</p>
        <form method="POST" action="{{ route('admin.supabase.session.store') }}">
            @csrf
            <div class="form-row">
                <label>Access Token</label>
                <textarea name="access_token" rows="4" required>{{ old('access_token') }}</textarea>
                @error('access_token')<p class="error">{{ $message }}</p>@enderror
            </div>
            <button class="button" type="submit">Continue with Supabase</button>
        </form>
    @endif
</section>
@endsection
