@extends('layouts.admin')

@section('content')
<section class="card">
    <h1 style="margin-top:0">Add Podcast Episode</h1>
    @include('admin.podcasts.form', ['episode' => null, 'action' => route('admin.podcasts.store'), 'method' => 'POST'])
</section>
@endsection
