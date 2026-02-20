@extends('layouts.app')

@section('content')
<section class="card hero">
    <h1>Blog</h1>
    <p>Thoughts on music, creative process, faith, and building with purpose.</p>
</section>

<section class="stack-grid section-space">
    @forelse($posts as $post)
        <article class="card">
            <h3 class="section-title"><a href="{{ route('blog.show', $post) }}">{{ $post->title }}</a></h3>
            <p class="meta">{{ optional($post->published_at)->format('M d, Y') }}</p>
            @if($post->excerpt)<p>{{ $post->excerpt }}</p>@endif
        </article>
    @empty
        <article class="card"><p class="meta">No published posts yet.</p></article>
    @endforelse
</section>
@endsection
