@extends('layouts.admin')

@section('content')
<section class="card">
    <h1 style="margin-top:0">Create Media</h1>
    @include('admin.media.form', ['mediaItem' => null, 'action' => route('admin.media.store'), 'method' => 'POST'])
</section>
@endsection
