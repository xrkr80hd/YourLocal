@extends('layouts.admin')

@section('content')
<section class="card">
    <h1 style="margin-top:0">Create Post</h1>
    @include('admin.posts.form', ['post' => null, 'action' => route('admin.posts.store'), 'method' => 'POST'])
</section>
@endsection
