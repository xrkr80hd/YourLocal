@extends('layouts.app')

@section('content')
<section class="card hero">
    <h1><span class="hero-accent">Contact</span> YourLocal Feature Desk</h1>
    <p>If your band, artist project, or podcast should be featured on YourLocal, send details and links.</p>
</section>

<section class="card section-space contact-card">
    <h3 class="section-title">Submit Your Project</h3>
    <p>Send your band/artist/podcast name, genre, city, short bio, and links to your best tracks or episodes.</p>
    <div class="actions">
        <a class="button primary" href="mailto:{{ $profile?->email ?: 'contact@xrkr80hd.studio' }}">
            Email {{ $profile?->email ?: 'contact@xrkr80hd.studio' }}
        </a>
    </div>
    <p class="meta">Recommended assets: banner image 2560x1440, profile image 1080x1080, member photos 1080x1350.</p>
</section>
@endsection
