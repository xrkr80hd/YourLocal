@extends('layouts.admin')

@section('content')
<section class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
        <h1 style="margin:0">Bands</h1>
        <a class="button primary" href="{{ route('admin.bands.create') }}">Add Band</a>
    </div>
    <div class="actions" style="margin-top:0.85rem;flex-wrap:wrap;">
        <a class="button {{ !$eraFilter ? 'primary' : '' }}" href="{{ route('admin.bands.index') }}">All ({{ $counts['all'] ?? 0 }})</a>
        <a class="button {{ $eraFilter === 'scene' ? 'primary' : '' }}" href="{{ route('admin.bands.index', ['era' => 'scene']) }}">YourLocal Scene ({{ $counts['scene'] ?? 0 }})</a>
        <a class="button {{ $eraFilter === 'archive' ? 'primary' : '' }}" href="{{ route('admin.bands.index', ['era' => 'archive']) }}">YourLocal Legends ({{ $counts['archive'] ?? 0 }})</a>
    </div>
</section>

<section class="grid" style="margin-top:1rem;">
    @forelse($bands as $band)
    <article class="card">
        <strong>{{ $band->name }}</strong>
        <span class="meta">/{{ $band->slug }} • {{ $band->era === 'archive' ? 'YourLocal Legends' : 'YourLocal Scene' }}</span>
        <div class="status-row">
            <span class="status-pill {{ $band->is_published ? 'is-ok' : 'is-warn' }}">{{ $band->is_published ? 'Published' : 'Draft' }}</span>
            <span class="status-pill {{ $band->is_published ? 'is-info' : 'is-muted' }}">{{ $band->is_published ? 'Visible on frontend' : 'Hidden from frontend' }}</span>
        </div>
        <p>{{ $band->summary }}</p>
        <div class="actions">
            <a class="button" href="{{ route('bands.show', $band) }}" target="_blank" rel="noreferrer">View</a>
            <a class="button" href="{{ route('admin.bands.edit', $band) }}">Edit</a>
            <form method="POST" action="{{ route('admin.bands.destroy', $band) }}" onsubmit="return confirm('Are you sure you want to delete this band? This action cannot be undone.')">@csrf @method('DELETE')<button class="button danger" type="submit">Delete</button></form>
        </div>
    </article>
    @empty
    <article class="card">
        <p class="meta">No bands yet.</p>
    </article>
    @endforelse
</section>
@endsection
