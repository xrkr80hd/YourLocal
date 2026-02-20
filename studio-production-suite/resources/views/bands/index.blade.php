@extends('layouts.app')

@section('content')
<section class="card hero band-hero">
    <span class="tag-badge">{{ $badge }}</span>
    <h1><span class="hero-accent">{{ $headlineAccent }}</span> {{ $headlineRest }}</h1>
    <p>{{ $subtitle }}</p>
    <div class="actions">
        <a class="button {{ $era === 'archive' ? 'primary' : '' }}" href="{{ route('bands.archive') }}">YourLocal Legends</a>
        <a class="button {{ $era === 'scene' ? 'primary' : '' }}" href="{{ route('bands.scene') }}">YourLocal Scene</a>
        <a class="button {{ request()->routeIs('podcast.*') ? 'primary' : '' }}" href="{{ route('podcast.index') }}">YourLocal Podcasts</a>
    </div>
</section>

<section class="section-space">
    <div class="band-grid" id="band-grid">
        @forelse($bands as $band)
            <a href="{{ route('bands.show', $band) }}" class="band-card" data-genre="{{ strtolower($band->genre ?? 'other') }}">
                <div class="band-card-image">
                    @if($band->image_url)
                        <img src="{{ $band->image_url }}" alt="{{ $band->name }}">
                    @else
                        <span class="image-placeholder">[ Band Photo ]</span>
                    @endif
                </div>
                <div class="band-card-content">
                    <div class="band-card-year">{{ $band->years_active ?: 'Years Active' }}</div>
                    <h3 class="band-card-name">{{ $band->name }}</h3>
                    <span class="band-card-genre">{{ $band->genre ?: 'Local Band' }}</span>
                    <p class="band-card-desc">{{ $band->summary }}</p>
                    <div class="band-card-arrow">View Full Story</div>
                </div>
            </a>
        @empty
            <article class="card"><p class="meta">No bands published yet. Add them from Admin.</p></article>
        @endforelse
    </div>
</section>
@endsection
