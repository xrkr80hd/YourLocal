@extends('layouts.admin')

@section('content')
<section class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
        <h1 style="margin:0">Podcast Episodes</h1>
        <a class="button primary" href="{{ route('admin.podcasts.create') }}">Add Episode</a>
    </div>
</section>

<section class="grid" style="margin-top:1rem;">
    @forelse($episodes as $episode)
    <article class="card">
        <strong>{{ $episode->title }}</strong>
        <span class="meta">/{{ $episode->slug }}</span>
        <div class="status-row">
            <span class="status-pill {{ $episode->is_published ? 'is-ok' : 'is-warn' }}">{{ $episode->is_published ? 'Published' : 'Draft' }}</span>
            <span class="status-pill {{ $episode->is_published ? 'is-info' : 'is-muted' }}">{{ $episode->is_published ? 'Visible on Podcast page' : 'Hidden from Podcast page' }}</span>
        </div>
        <div class="actions">
            <a class="button" href="{{ route('admin.podcasts.edit', $episode) }}">Edit</a>
            <form method="POST" action="{{ route('admin.podcasts.destroy', $episode) }}" onsubmit="return confirm('Are you sure you want to delete this podcast episode? This action cannot be undone.')">@csrf @method('DELETE')<button class="button danger" type="submit">Delete</button></form>
        </div>
    </article>
    @empty
    <article class="card">
        <p class="meta">No episodes yet.</p>
    </article>
    @endforelse
</section>
@endsection