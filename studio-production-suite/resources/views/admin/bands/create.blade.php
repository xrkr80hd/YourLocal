@extends('layouts.admin')

@section('content')
<section class="card">
    <h1 style="margin-top:0">Add Band</h1>
    @include('admin.bands.form', ['band' => null, 'action' => route('admin.bands.store'), 'method' => 'POST'])
</section>
@endsection
