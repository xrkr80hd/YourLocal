@extends('layouts.app')

@section('content')
<section class="card hero band-hero">
    <span class="tag-badge">Podcast Channel</span>
    <h1><span class="hero-accent">YourLocal</span> Podcasts</h1>
    <p>Local stories, artist interviews, and scene conversations in one archive-friendly feed.</p>
    <div class="actions">
        <a class="button {{ request()->routeIs('bands.archive') ? 'primary' : '' }}" href="{{ route('bands.archive') }}">YourLocal Legends</a>
        <a class="button {{ request()->routeIs('bands.scene') ? 'primary' : '' }}" href="{{ route('bands.scene') }}">YourLocal Scene</a>
        <a class="button {{ request()->routeIs('podcast.*') ? 'primary' : '' }}" href="{{ route('podcast.index') }}">YourLocal Podcasts</a>
    </div>
</section>

<section class="section-space">
    <div class="band-grid">
    @forelse($episodes as $episode)
        <article class="band-card podcast-card">
            <div class="band-card-image">
                @if($episode->cover_image_url)
                    <img src="{{ $episode->cover_image_url }}" alt="{{ $episode->title }} cover">
                @else
                    <span class="image-placeholder">[ Podcast Cover ]</span>
                @endif
            </div>
            <div class="band-card-content">
                @if($episode->published_at)
                    <div class="band-card-year">{{ $episode->published_at->format('M d, Y') }}</div>
                @endif
                <h3 class="band-card-name">{{ $episode->title }}</h3>
                <span class="band-card-genre">Podcast Episode</span>
                @if($episode->summary)
                    <p class="band-card-desc">{{ $episode->summary }}</p>
                @elseif($episode->description)
                    <p class="band-card-desc">{{ $episode->description }}</p>
                @endif
                @if($episode->audio_url)
                    <audio controls preload="none" src="{{ $episode->audio_url }}"></audio>
                @endif
            </div>
        </article>
    @empty
        <article class="card"><p class="meta">No podcast episodes yet. Add one from Admin.</p></article>
    @endforelse
    </div>
</section>
@endsection
