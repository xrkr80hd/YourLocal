@extends('layouts.app')

@section('content')
<section class="card band-page-hero">
    @php($primaryPhoto = $band->band_photo_url ?: $band->image_url)
    @if($band->banner_image_url)
        <div class="band-banner" style="background-image:url('{{ $band->banner_image_url }}');"></div>
    @endif
    <a class="button" href="{{ route($backRoute) }}">{{ $backLabel }}</a>
    <div class="band-profile-wrap {{ $band->is_solo_artist ? 'solo' : '' }}">
        <div class="band-photo">
            @if($primaryPhoto)
                <button
                    type="button"
                    class="band-photo-trigger"
                    data-expand-photo-src="{{ $primaryPhoto }}"
                    data-expand-photo-alt="{{ $band->name }} photo"
                    aria-label="Expand {{ $band->name }} photo"
                >
                    <img src="{{ $primaryPhoto }}" alt="{{ $band->name }}">
                </button>
            @else
                <span>BND</span>
            @endif
        </div>
        <div class="band-main-copy">
            <h1>{{ $band->name }}</h1>
            <p class="meta">{{ $band->years_active ?: 'Years Active' }} • {{ $band->genre ?: 'Local Band' }}</p>
            @if($band->tagline)
                <p>{{ $band->tagline }}</p>
            @endif
        </div>
    </div>
</section>

<section class="card section-space">
    <h2 class="section-title">Story</h2>
    <p>{{ $band->story ?: $band->summary }}</p>
</section>

@if($members->count())
<section class="card section-space">
    <h2 class="section-title">{{ $band->is_solo_artist ? 'Artist Team' : 'Band Members' }}</h2>
    <div class="members-grid">
        @foreach($members as $member)
            <article class="member-card">
                <div class="member-avatar">
                    @if(!empty($member['image_url']))
                        <button
                            type="button"
                            class="member-avatar-trigger"
                            data-expand-photo-src="{{ $member['image_url'] }}"
                            data-expand-photo-alt="{{ ($member['name'] ?? 'Member') . ' photo' }}"
                            aria-label="Expand {{ $member['name'] ?? 'member' }} photo"
                        >
                            <img src="{{ $member['image_url'] }}" alt="{{ $member['name'] ?? 'Member' }}">
                        </button>
                    @else
                        <span>{{ strtoupper(substr($member['name'] ?? 'M', 0, 1)) }}</span>
                    @endif
                </div>
                <div class="member-name">{{ $member['name'] ?? 'Member' }}</div>
                @if(!empty($member['role']))
                    <div class="member-role">{{ $member['role'] }}</div>
                @endif
            </article>
        @endforeach
    </div>
</section>
@endif

<div class="band-lightbox" id="band-lightbox" aria-hidden="true">
    <div class="band-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Expanded band photo">
        <button type="button" class="band-lightbox-close" id="band-lightbox-close" aria-label="Close">×</button>
        <img id="band-lightbox-image" class="band-lightbox-image" src="" alt="">
    </div>
</div>

<script>
(() => {
    const modal = document.getElementById('band-lightbox');
    const modalImage = document.getElementById('band-lightbox-image');
    const closeButton = document.getElementById('band-lightbox-close');
    if (!modal || !modalImage || !closeButton) return;

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modalImage.src = '';
        modalImage.alt = '';
        document.body.classList.remove('no-scroll');
    };

    const openModal = (src, altText) => {
        if (!src) return;
        modalImage.src = src;
        modalImage.alt = altText || 'Expanded band photo';
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    };

    document.querySelectorAll('[data-expand-photo-src]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openModal(trigger.dataset.expandPhotoSrc || '', trigger.dataset.expandPhotoAlt || '');
        });
    });

    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
})();
</script>
@endsection
