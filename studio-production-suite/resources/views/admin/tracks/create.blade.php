@extends('layouts.admin')

@section('content')
<section class="card">
    <h1 style="margin-top:0">Create Track</h1>
    @include('admin.tracks.form', ['track' => null, 'action' => route('admin.tracks.store'), 'method' => 'POST'])
</section>
@endsection
