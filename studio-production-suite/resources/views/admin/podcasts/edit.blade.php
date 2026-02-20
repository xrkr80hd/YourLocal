@extends('layouts.admin')

@section('content')
<section class="card">
    <h1 style="margin-top:0">Edit Podcast Episode</h1>
    @include('admin.podcasts.form', ['episode' => $episode, 'action' => route('admin.podcasts.update', $episode), 'method' => 'PUT'])
</section>

<section class="card" style="margin-top:2rem;border:1px solid #dc3545;border-radius:8px;padding:1.5rem;">
    <h2 style="margin-top:0;color:#dc3545;">Danger Zone</h2>
    <p style="margin-bottom:1rem;">Permanently delete this podcast episode. This action cannot be undone.</p>
    <form method="POST" action="{{ route('admin.podcasts.destroy', $episode) }}" onsubmit="return confirm('Are you sure you want to delete this podcast episode? This action cannot be undone.')">
        @csrf
        @method('DELETE')
        <button class="button danger" type="submit">Delete Episode</button>
    </form>
</section>
@endsection