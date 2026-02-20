@extends('layouts.admin')

@section('content')
<section class="card">
    <h1 style="margin-top:0">Create Project</h1>
    @include('admin.projects.form', ['project' => null, 'action' => route('admin.projects.store'), 'method' => 'POST'])
</section>
@endsection
