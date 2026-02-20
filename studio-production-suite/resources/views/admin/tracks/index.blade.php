@extends('layouts.admin')

@section('content')
<section class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
        <h1 style="margin:0">Tracks</h1>
        <a class="button primary" href="{{ route('admin.tracks.create') }}">Add Track</a>
    </div>
</section>

<section class="grid" style="margin-top:1rem;">
    @forelse($tracks as $track)
    <article class="card">
        <strong>{{ $track->title }}</strong> <span class="meta">{{ $track->artist_name }}</span>
        <div class="status-row">
            <span class="status-pill is-ok">Published</span>
            <span class="status-pill is-info">Visible on Home, Hub, and Music</span>
        </div>
        <div class="actions">
            <a class="button" href="{{ route('admin.tracks.edit', $track) }}">Edit</a>
            <form method="POST" action="{{ route('admin.tracks.destroy', $track) }}" onsubmit="return confirm('Are you sure you want to delete this track? This action cannot be undone.')">
                @csrf @method('DELETE')
                <button class="button danger" type="submit">Delete</button>
            </form>
        </div>
    </article>
    @empty
    <article class="card">
        <p class="meta">No tracks yet.</p>
    </article>
    @endforelse
</section>
@endsection