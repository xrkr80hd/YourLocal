@extends('layouts.app')

@section('content')
<section class="card hero">
    <h1>Music</h1>
    <p>Original tracks built across guitar, bass, drums, and keys. Hit shuffle for retro-style discovery mode.</p>
</section>

<section class="card section-space">
    <div class="player">
        <strong id="current-track">{{ $tracks->first()?->title ?? 'No track selected' }}</strong>
        <audio id="main-player" controls @if($tracks->first()) src="{{ $tracks->first()->audio_url }}" @endif></audio>
        <div class="actions">
            <button class="button primary" id="shuffle-btn" type="button">Shuffle / Random Track</button>
        </div>
    </div>
</section>

<section class="stack-grid section-space" id="track-list">
    @forelse($tracks as $track)
        <article class="card" data-title="{{ $track->title }}" data-audio="{{ $track->audio_url }}">
            @if($track->cover_image_url)
                <img class="cover" src="{{ $track->cover_image_url }}" alt="{{ $track->title }} cover">
            @endif
            <h3 class="section-title">{{ $track->title }}</h3>
            <p class="meta">{{ $track->artist_name }} @if($track->genre)- {{ $track->genre }}@endif</p>
            @if($track->description)
                <p>{{ $track->description }}</p>
            @endif
            <div class="actions">
                <button class="button play-btn" type="button">Play</button>
                @if($track->external_url)
                    <a class="button" href="{{ $track->external_url }}" target="_blank" rel="noreferrer">Open Link</a>
                @endif
            </div>
        </article>
    @empty
        <article class="card"><p class="meta">No tracks published yet.</p></article>
    @endforelse
</section>

<script>
const player = document.getElementById('main-player');
const currentTrackLabel = document.getElementById('current-track');
const cards = Array.from(document.querySelectorAll('#track-list article[data-audio]'));
const shuffleButton = document.getElementById('shuffle-btn');

function loadTrack(card) {
    if (!card || !player) return;
    const src = card.dataset.audio;
    const title = card.dataset.title;
    player.src = src;
    currentTrackLabel.textContent = title;
    player.play();
}

document.querySelectorAll('.play-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
        const card = event.target.closest('article[data-audio]');
        loadTrack(card);
    });
});

if (shuffleButton) {
    shuffleButton.addEventListener('click', () => {
        if (!cards.length) return;
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        loadTrack(randomCard);
    });
}
</script>
@endsection
