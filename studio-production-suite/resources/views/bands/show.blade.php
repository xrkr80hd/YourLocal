@extends('layouts.app')

@section('content')
<section class="card band-page-hero">
    @if($band->banner_image_url)
        <div class="band-banner" style="background-image:url('{{ $band->banner_image_url }}');"></div>
    @endif
    <a class="button" href="{{ route($backRoute) }}">{{ $backLabel }}</a>
    <div class="band-profile-wrap {{ $band->is_solo_artist ? 'solo' : '' }}">
        <div class="band-photo">
            @if($band->band_photo_url ?: $band->image_url)
                <img src="{{ $band->band_photo_url ?: $band->image_url }}" alt="{{ $band->name }}">
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
                        <img src="{{ $member['image_url'] }}" alt="{{ $member['name'] ?? 'Member' }}">
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
@endsection
