@extends('layouts.admin')

@section('content')
<section class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
        <h1 style="margin:0">Blog Posts</h1>
        <a class="button primary" href="{{ route('admin.posts.create') }}">Add Post</a>
    </div>
</section>

<section class="grid" style="margin-top:1rem;">
    @forelse($posts as $post)
    <article class="card">
        <strong>{{ $post->title }}</strong> <span class="meta">/{{ $post->slug }}</span>
        <div class="status-row">
            <span class="status-pill {{ $post->is_published ? 'is-ok' : 'is-warn' }}">{{ $post->is_published ? 'Published' : 'Draft' }}</span>
            <span class="status-pill {{ $post->is_published ? 'is-info' : 'is-muted' }}">{{ $post->is_published ? 'Visible on Blog and Hub' : 'Hidden from Blog and Hub' }}</span>
        </div>
        <div class="actions">
            <a class="button" href="{{ route('admin.posts.edit', $post) }}">Edit</a>
            <form method="POST" action="{{ route('admin.posts.destroy', $post) }}" onsubmit="return confirm('Are you sure you want to delete this post? This action cannot be undone.')">@csrf @method('DELETE')<button class="button danger" type="submit">Delete</button></form>
        </div>
    </article>
    @empty
    <article class="card">
        <p class="meta">No posts yet.</p>
    </article>
    @endforelse
</section>
@endsection