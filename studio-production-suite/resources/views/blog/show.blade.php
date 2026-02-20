@extends('layouts.app')

@section('content')
<article class="card">
    <h1 class="section-title">{{ $post->title }}</h1>
    <p class="meta">{{ optional($post->published_at)->format('M d, Y') }}</p>
    @if($post->cover_image_url)
        <img class="cover" src="{{ $post->cover_image_url }}" alt="{{ $post->title }}">
    @endif
    <p>{!! nl2br(e($post->content)) !!}</p>
</article>
@endsection
