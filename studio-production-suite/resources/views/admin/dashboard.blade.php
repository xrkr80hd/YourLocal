@extends('layouts.admin')

@section('content')
<section class="card hero">
    <h1>Dashboard</h1>
    <p>One backend for your full production suite.</p>
</section>

<section class="grid cols-2" style="margin-top:1rem;">
    <article class="card">
        <h3>Tracks</h3>
        <p>{{ $counts['tracks'] }}</p>
        <p class="meta">Visible on Home, Hub, and Music pages.</p>
    </article>
    <article class="card">
        <h3>Bands</h3>
        <p>{{ $counts['bands'] }}</p>
        <p class="meta">Published: {{ $counts['bands_published'] }} | Draft: {{ $counts['bands'] - $counts['bands_published'] }}</p>
    </article>
    <article class="card">
        <h3>Podcast Episodes</h3>
        <p>{{ $counts['podcasts'] }}</p>
        <p class="meta">Published: {{ $counts['podcasts_published'] }} | Draft: {{ $counts['podcasts'] - $counts['podcasts_published'] }}</p>
    </article>
    <article class="card">
        <h3>Projects</h3>
        <p>{{ $counts['projects'] }}</p>
        <p class="meta">Visible on Projects and Hub pages.</p>
    </article>
    <article class="card">
        <h3>Blog Posts</h3>
        <p>{{ $counts['posts'] }}</p>
        <p class="meta">Published: {{ $counts['posts_published'] }} | Draft: {{ $counts['posts'] - $counts['posts_published'] }}</p>
    </article>
    <article class="card">
        <h3>Media Items</h3>
        <p>{{ $counts['media'] }}</p>
        <p class="meta">Photos: {{ $counts['media_photos'] }}, Videos: {{ $counts['media_videos'] }}, Music: {{ $counts['media_music'] }}</p>
    </article>
</section>
@endsection
