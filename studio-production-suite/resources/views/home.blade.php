@extends('layouts.app')

@section('content')
<section class="hero home-hero home-unboxed">
    <div class="home-hero-profile">
        <div class="home-hero-avatar">
            @if($profile?->avatar_url)
                <img src="{{ $profile->avatar_url }}" alt="XRKR80HD avatar">
            @else
                <span>XR</span>
            @endif
        </div>
        <div>
            @php
                $headline = $profile?->headline ?: 'XRKR80HD';
                $styledHeadline = str_ireplace(
                    'XRKR80HD',
                    '<span class="split-cool">XRKR</span><span class="split-80">80</span><span class="split-cool">HD</span>',
                    e($headline)
                );
            @endphp
            <h1>{!! $styledHeadline !!}</h1>
            @if($profile?->short_bio)
                <p>{{ $profile->short_bio }}</p>
            @endif
            @if($profile?->full_bio)
                <p>{{ $profile->full_bio }}</p>
            @endif
        </div>
    </div>
    <div class="actions">
        <a class="button primary" href="{{ route('hub.index') }}">Open XRKR80HDLocal Hub</a>
        <a class="button" href="{{ route('contact.index') }}">Band Feature Contact</a>
    </div>
</section>

<section class="section-space home-radio home-unboxed">
    <div class="home-player-head">
        <h3 class="section-title">Local Radio</h3>
        <span class="meta">Bands, artists, and XRKR80HD tracks</span>
    </div>
    @if($homeTracks->count())
        <p><strong id="home-current-track">{{ $homeTracks->first()->title }}</strong> <span class="meta">{{ $homeTracks->first()->artist_name }}</span></p>
        <audio id="home-main-player" class="home-mini-player" controls src="{{ $homeTracks->first()->audio_url }}"></audio>
        <div class="home-track-list" id="home-track-list">
            @foreach($homeTracks as $track)
                <button
                    type="button"
                    class="home-track-pill {{ $loop->first ? 'active' : '' }}"
                    data-title="{{ $track->title }}"
                    data-artist="{{ $track->artist_name }}"
                    data-audio="{{ $track->audio_url }}"
                >
                    {{ $track->title }} <span class="meta">{{ $track->artist_name }}</span>
                </button>
            @endforeach
        </div>
    @else
        <p class="meta">No tracks uploaded yet.</p>
    @endif
</section>

<section class="section-space home-guide home-unboxed">
    <h3 class="section-title">Site Guide</h3>
    <p class="meta">Quick jump into each page from the navbar.</p>
    <div class="home-page-flow">
        <article class="home-feature">
            <div class="home-feature-media" style="background-image: url('{{ asset('assets/bg/djent-1.png') }}');"></div>
            <div class="home-feature-copy">
                <h4>XRKR80HDLocal Hub</h4>
                <p>Your all-in-one control room. Stream tracks, check visuals, watch clips, and catch updates without bouncing between pages. It is built to feel like one continuous feed for your own work and your local ecosystem.</p>
                <a class="button" href="{{ route('hub.index') }}">Open Hub</a>
            </div>
        </article>
        <article class="home-feature">
            <div class="home-feature-media" style="background-image: url('{{ asset('assets/bg/90s-era.png') }}');"></div>
            <div class="home-feature-copy">
                <h4>YourLocal Legends</h4>
                <p>An archive for influential local bands that are no longer actively writing, releasing, or performing. This keeps the history alive and gives new listeners a place to discover the sound that built the scene.</p>
                <a class="button" href="{{ route('bands.archive') }}">Open Legends</a>
            </div>
        </article>
        <article class="home-feature">
            <div class="home-feature-media" style="background-image: url('{{ asset('assets/bg/2012-post-hardcore.png') }}');"></div>
            <div class="home-feature-copy">
                <h4>YourLocal Scene</h4>
                <p>The current movement. Active bands, fresh releases, and artists who are still on stages now. This section is built for discovery, community support, and finding who to follow next in your area.</p>
                <a class="button" href="{{ route('bands.scene') }}">Open Scene</a>
            </div>
        </article>
        <article class="home-feature">
            <div class="home-feature-media" style="background-image: url('{{ asset('assets/bg/djent.png') }}');"></div>
            <div class="home-feature-copy">
                <h4>YourLocal Podcast</h4>
                <p>Conversations, stories, and scene insight from artists, producers, and creators. Use this space to document what is happening behind the music and spotlight the voices that keep local culture moving.</p>
                <a class="button" href="{{ route('podcast.index') }}">Open Podcast</a>
            </div>
        </article>
        <article class="home-feature">
            <div class="home-feature-media" style="background-image: url('{{ asset('assets/bg/90s-era-ii.png') }}');"></div>
            <div class="home-feature-copy">
                <h4>Contact</h4>
                <p>Want your band, solo project, or podcast featured? Submit your links, photos, and profile details here. This is the entry point for being added to YourLocal and growing your reach in the scene.</p>
                <a class="button" href="{{ route('contact.index') }}">Contact Page</a>
            </div>
        </article>
    </div>
</section>

<script>
(() => {
    const player = document.getElementById('home-main-player');
    const title = document.getElementById('home-current-track');
    const list = document.getElementById('home-track-list');
    if (!player || !title || !list) return;

    list.querySelectorAll('button[data-audio]').forEach((button) => {
        button.addEventListener('click', () => {
            list.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            player.src = button.dataset.audio;
            title.textContent = button.dataset.title || 'Track';
            player.play().catch(() => {});
        });
    });
})();
</script>
@endsection
