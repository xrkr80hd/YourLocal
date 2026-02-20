@extends('layouts.app')

@section('content')
<section class="card hero">
    <h1>Media</h1>
    <p>Snapshots and video moments from sessions, releases, and behind-the-scenes grind.</p>
</section>

<section class="card section-space">
    <h3 class="section-title">Photos</h3>
    <div class="grid cols-3">
        @forelse($photos as $item)
            <article>
                <img class="cover" src="{{ $item->thumbnail_url ?: $item->media_url }}" alt="{{ $item->title }}">
                <strong>{{ $item->title }}</strong>
                @if($item->caption)<p class="meta">{{ $item->caption }}</p>@endif
            </article>
        @empty
            <p class="meta">No photos yet.</p>
        @endforelse
    </div>
</section>

<section class="card section-space">
    <h3 class="section-title">Videos</h3>
    @forelse($videos as $item)
        <p><strong>{{ $item->title }}</strong> <a class="button" href="{{ $item->media_url }}" target="_blank" rel="noreferrer">Watch</a></p>
    @empty
        <p class="meta">No videos yet.</p>
    @endforelse
</section>

<section class="card section-space">
    <h3 class="section-title">Music</h3>
    @forelse($music as $item)
        <article style="margin-bottom:1rem;">
            <p><strong>{{ $item->title }}</strong></p>
            <audio controls preload="none" src="{{ $item->media_url }}"></audio>
            @if($item->caption)<p class="meta">{{ $item->caption }}</p>@endif
        </article>
    @empty
        <p class="meta">No music items yet.</p>
    @endforelse
</section>
@endsection
