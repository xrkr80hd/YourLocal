@extends('layouts.admin')

@section('content')
<section class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
        <h1 style="margin:0">Media</h1>
        <a class="button primary" href="{{ route('admin.media.create') }}">Add Media</a>
    </div>
</section>

<section class="grid" style="margin-top:1rem;">
    @forelse($mediaItems as $item)
    @php
    $visibility = match ($item->type) {
    'photo' => 'Visible on Hub and Media pages',
    'video' => 'Visible on Hub and Media pages',
    'music' => 'Visible on Media page',
    default => 'Visibility unknown',
    };
    @endphp
    <article class="card">
        <strong>{{ $item->title }}</strong> <span class="pill">{{ $item->type }}</span>
        <div class="status-row">
            <span class="status-pill is-ok">Saved</span>
            <span class="status-pill is-info">{{ $visibility }}</span>
        </div>
        <div class="actions">
            <a class="button" href="{{ route('admin.media.edit', $item) }}">Edit</a>
            <form method="POST" action="{{ route('admin.media.destroy', $item) }}" onsubmit="return confirm('Are you sure you want to delete this media item? This action cannot be undone.')">@csrf @method('DELETE')<button class="button danger" type="submit">Delete</button></form>
        </div>
    </article>
    @empty
    <article class="card">
        <p class="meta">No media items yet.</p>
    </article>
    @endforelse
</section>
@endsection