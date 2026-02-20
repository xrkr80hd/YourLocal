@extends('layouts.admin')

@section('content')
<section class="card">
    <h1 style="margin-top:0">Edit Project</h1>
    @include('admin.projects.form', ['project' => $project, 'action' => route('admin.projects.update', $project), 'method' => 'PUT'])
</section>

<section class="card" style="margin-top:2rem;border:1px solid #dc3545;border-radius:8px;padding:1.5rem;">
    <h2 style="margin-top:0;color:#dc3545;">Danger Zone</h2>
    <p style="margin-bottom:1rem;">Permanently delete this project. This action cannot be undone.</p>
    <form method="POST" action="{{ route('admin.projects.destroy', $project) }}" onsubmit="return confirm('Are you sure you want to delete this project? This action cannot be undone.')">
        @csrf
        @method('DELETE')
        <button class="button danger" type="submit">Delete Project</button>
    </form>
</section>
@endsection