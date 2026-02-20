@extends('layouts.app')

@section('content')
<section class="card hero">
    <h1>Projects</h1>
    <p>From creative tools to game-inspired experiments, these are the builds that carry the vision.</p>
</section>

<section class="stack-grid section-space">
    @forelse($projects as $project)
        <article class="card">
            @if($project->cover_image_url)
                <img class="cover" src="{{ $project->cover_image_url }}" alt="{{ $project->title }}">
            @endif
            <h3 class="section-title">{{ $project->title }}</h3>
            <p>{{ $project->summary }}</p>
            <div class="actions">
                @if($project->project_url)
                    <a class="button primary" target="_blank" rel="noreferrer" href="{{ $project->project_url }}">Visit Site</a>
                @endif
                @if($project->repo_url)
                    <a class="button" target="_blank" rel="noreferrer" href="{{ $project->repo_url }}">Repository</a>
                @endif
            </div>
        </article>
    @empty
        <article class="card"><p class="meta">No projects yet.</p></article>
    @endforelse
</section>
@endsection
