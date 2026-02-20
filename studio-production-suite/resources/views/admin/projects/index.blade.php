@extends('layouts.admin')

@section('content')
<section class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
        <h1 style="margin:0">Projects</h1>
        <a class="button primary" href="{{ route('admin.projects.create') }}">Add Project</a>
    </div>
</section>

<section class="grid" style="margin-top:1rem;">
    @forelse($projects as $project)
    <article class="card">
        <strong>{{ $project->title }}</strong> <span class="meta">/{{ $project->slug }}</span>
        <div class="status-row">
            <span class="status-pill is-ok">Published</span>
            <span class="status-pill is-info">Visible on Projects and Hub</span>
        </div>
        <p>{{ $project->summary }}</p>
        <div class="actions">
            <a class="button" href="{{ route('admin.projects.edit', $project) }}">Edit</a>
            <form method="POST" action="{{ route('admin.projects.destroy', $project) }}" onsubmit="return confirm('Are you sure you want to delete this project? This action cannot be undone.')">@csrf @method('DELETE')<button class="button danger" type="submit">Delete</button></form>
        </div>
    </article>
    @empty
    <article class="card">
        <p class="meta">No projects yet.</p>
    </article>
    @endforelse
</section>
@endsection