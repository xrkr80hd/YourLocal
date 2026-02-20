@extends('layouts.app')

@section('content')
<section class="card hero">
    <h1><span class="hero-accent"><span class="split-cool">XRKR</span><span class="split-80">80</span><span class="split-cool">HD</span>Local</span> Hub</h1>
    <p>Everything in one place: music, photos, videos, projects, blog updates, and media drops.</p>
</section>

<section class="card section-space hub-player">
    <div class="hub-player-head">
        <h3 class="section-title">Tracks</h3>
        <span class="meta">{{ $counts['tracks'] }} total</span>
    </div>
    @if($tracks->count())
        @php
            $orderedTracks = $tracks->sortBy(function ($track) {
                $genreKey = strtolower(trim($track->genre ?: 'Other'));
                $titleKey = strtolower($track->title ?? '');
                return $genreKey . '|' . $titleKey;
            });
            $initialTrack = $orderedTracks->first();
            $tracksByGenre = $orderedTracks
                ->groupBy(fn ($track) => strtolower(trim($track->genre ?: 'Other')))
                ->sortKeys(SORT_NATURAL | SORT_FLAG_CASE);
            $defaultGenres = collect([
                'metal',
                'rock',
                'christian',
                'covers',
                'orchestral/soundtrack',
                'indie',
                'djent',
                'gospel',
                'country',
                'hip-hop',
                'other',
            ]);
            $allGenres = $defaultGenres
                ->merge($tracksByGenre->keys())
                ->map(fn ($genre) => strtolower(trim($genre)))
                ->unique()
                ->sort(SORT_NATURAL | SORT_FLAG_CASE)
                ->values();
            $isFirstTrack = true;
        @endphp
        <p class="hub-now-playing"><strong id="hub-current-track">{{ $initialTrack->title }}</strong> <span class="meta">{{ $initialTrack->artist_name }}</span></p>
        <audio id="hub-main-player" class="hub-main-player" controls src="{{ $initialTrack->audio_url }}"></audio>
        <div class="hub-genre-filter-wrap">
            <label class="meta" for="hub-genre-filter">Choose your genre:</label>
            <select id="hub-genre-filter" class="hub-genre-filter">
                @foreach($allGenres as $genre)
                    <option value="{{ $genre }}" {{ $loop->first ? 'selected' : '' }}>
                        {{ \Illuminate\Support\Str::title($genre) }}
                    </option>
                @endforeach
            </select>
        </div>
        <div class="hub-track-groups" id="hub-track-list">
            @foreach($allGenres as $genre)
                @php $genreTracks = $tracksByGenre->get($genre, collect()); @endphp
                <details
                    class="hub-genre-section {{ $loop->first ? 'is-visible' : '' }}"
                    data-genre-section="{{ $genre }}"
                    {{ $loop->first ? 'open' : '' }}
                >
                    <summary class="hub-genre-heading">
                        Track List
                        <span class="meta">{{ $genreTracks->count() }}</span>
                    </summary>
                    <div class="hub-genre-list-plain">
                        @forelse($genreTracks as $track)
                            <button
                                type="button"
                                class="hub-track-line {{ $isFirstTrack ? 'active' : '' }}"
                                data-title="{{ $track->title }}"
                                data-artist="{{ $track->artist_name }}"
                                data-audio="{{ $track->audio_url }}"
                            >
                                {{ $track->title }}
                            </button>
                            @php $isFirstTrack = false; @endphp
                        @empty
                            <div class="hub-track-empty">No tracks in this genre yet.</div>
                        @endforelse
                    </div>
                </details>
            @endforeach
        </div>
    @else
        <p class="meta">No tracks yet.</p>
    @endif
</section>

<section class="hub-stack section-space">
    <details class="hub-panel card">
        <summary>
            <span class="section-title">Photos</span>
            <span class="meta">{{ $photos->count() }} latest</span>
        </summary>
        <div class="hub-panel-content">
            <div class="hub-thumb-strip">
                @forelse($photos as $item)
                    <button
                        type="button"
                        class="hub-thumb"
                        data-modal-type="image"
                        data-modal-src="{{ $item->media_url }}"
                        data-modal-title="{{ $item->title }}"
                    >
                        @if($item->thumbnail_url)
                            <img src="{{ $item->thumbnail_url }}" alt="{{ $item->title }}">
                        @else
                            <span>{{ $item->title }}</span>
                        @endif
                    </button>
                @empty
                    <p class="meta">No photos yet.</p>
                @endforelse
            </div>
        </div>
    </details>

    <details class="hub-panel card">
        <summary>
            <span class="section-title">Videos</span>
            <span class="meta">{{ $videos->count() }} latest</span>
        </summary>
        <div class="hub-panel-content">
            <div class="hub-thumb-strip">
                @forelse($videos as $item)
                    <button
                        type="button"
                        class="hub-thumb hub-video-thumb"
                        data-modal-type="video"
                        data-modal-src="{{ $item->media_url }}"
                        data-modal-title="{{ $item->title }}"
                    >
                        @if($item->thumbnail_url)
                            <img src="{{ $item->thumbnail_url }}" alt="{{ $item->title }}">
                        @else
                            <span>{{ $item->title }}</span>
                        @endif
                        <span class="hub-play-icon">▶</span>
                    </button>
                @empty
                    <p class="meta">No videos yet.</p>
                @endforelse
            </div>
        </div>
    </details>
</section>

<section class="card section-space hub-blog-section">
    <div class="hub-player-head">
        <h3 class="section-title">Blog</h3>
        <span class="meta">{{ $counts['posts'] }} published</span>
    </div>
    <div class="hub-blog-shell">
        <div class="hub-blog-scroll">
            @forelse($posts as $post)
                @php
                    $postContent = $post->excerpt ?: $post->body ?: $post->content;
                    $postPreview = trim(strip_tags((string) $postContent));
                @endphp
                <article class="hub-blog-entry">
                    <h4>{{ $post->title }}</h4>
                    <p class="meta">{{ optional($post->published_at)->format('M d, Y') }}</p>
                    <p>{{ $postPreview !== '' ? \Illuminate\Support\Str::limit($postPreview, 340) : 'No preview text available yet.' }}</p>
                    <a class="hub-blog-read" href="{{ route('blog.show', $post) }}">Read full post</a>
                </article>
            @empty
                <p class="meta">No posts yet.</p>
            @endforelse
        </div>
    </div>
</section>

<div class="hub-modal" id="hub-modal" aria-hidden="true">
    <div class="hub-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="hub-modal-title">
        <button type="button" class="hub-modal-close" id="hub-modal-close" aria-label="Close">×</button>
        <h4 id="hub-modal-title" class="section-title"></h4>
        <div id="hub-modal-content"></div>
    </div>
</div>

<script>
(() => {
    const player = document.getElementById('hub-main-player');
    const title = document.getElementById('hub-current-track');
    const trackList = document.getElementById('hub-track-list');
    const genreFilter = document.getElementById('hub-genre-filter');
    if (player && title && trackList) {
        trackList.querySelectorAll('button[data-audio]').forEach((button) => {
            button.addEventListener('click', () => {
                trackList.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
                button.classList.add('active');
                player.src = button.dataset.audio;
                title.textContent = button.dataset.title || 'Track';
                player.play().catch(() => {});
            });
        });

        const genreSections = Array.from(trackList.querySelectorAll('[data-genre-section]'));
        if (genreFilter && genreSections.length) {
            const selectGenre = (genreValue) => {
                genreSections.forEach((section) => {
                    const isMatch = section.dataset.genreSection === genreValue;
                    section.classList.toggle('is-visible', isMatch);
                    section.open = isMatch;
                });
            };

            selectGenre(genreFilter.value);
            genreFilter.addEventListener('change', () => {
                selectGenre(genreFilter.value);
            });
        }

    }

    const modal = document.getElementById('hub-modal');
    const modalTitle = document.getElementById('hub-modal-title');
    const modalContent = document.getElementById('hub-modal-content');
    const closeButton = document.getElementById('hub-modal-close');
    if (!modal || !modalTitle || !modalContent || !closeButton) return;

    const openModal = (type, src, titleText) => {
        modalTitle.textContent = titleText || '';
        modalContent.innerHTML = '';
        if (type === 'video') {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            video.className = 'hub-modal-video';
            modalContent.appendChild(video);
        } else {
            const image = document.createElement('img');
            image.src = src;
            image.alt = titleText || 'Media';
            image.className = 'hub-modal-image';
            modalContent.appendChild(image);
        }
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modalContent.innerHTML = '';
    };

    document.querySelectorAll('.hub-thumb[data-modal-src]').forEach((button) => {
        button.addEventListener('click', () => {
            openModal(
                button.dataset.modalType || 'image',
                button.dataset.modalSrc,
                button.dataset.modalTitle || ''
            );
        });
    });

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
})();
</script>
@endsection
