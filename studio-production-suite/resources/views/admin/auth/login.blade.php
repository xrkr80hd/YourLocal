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
    <p class="meta" style="margin-top:1rem">Seeded admin: <code>xrkr80hd@gmail.com</code> / <code>changeme123!</code></p>
</section>
@endsection
