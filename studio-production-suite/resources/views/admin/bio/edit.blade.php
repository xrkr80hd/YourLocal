@extends('layouts.admin')

@section('content')
<section class="card">
    <h1 style="margin-top:0">Edit Bio</h1>
    <form method="POST" action="{{ route('admin.bio.update') }}">
        @csrf
        @method('PUT')

        <div class="form-row"><label>Headline</label><input name="headline" value="{{ old('headline', $profile->headline) }}"></div>
        <div class="form-row"><label>Short Bio</label><textarea name="short_bio">{{ old('short_bio', $profile->short_bio) }}</textarea></div>
        <div class="form-row"><label>Full Bio</label><textarea name="full_bio">{{ old('full_bio', $profile->full_bio) }}</textarea></div>
        <div class="form-row"><label>Avatar / Photo URL</label><input name="avatar_url" data-upload-kind="image" value="{{ old('avatar_url', $profile->avatar_url) }}"></div>
        <div class="form-row"><label>Location</label><input name="location" value="{{ old('location', $profile->location) }}"></div>
        <div class="form-row"><label>Email</label><input type="email" name="email" value="{{ old('email', $profile->email) }}"></div>
        <div class="form-row"><label>Instagram URL</label><input name="instagram_url" value="{{ old('instagram_url', $profile->instagram_url) }}"></div>
        <div class="form-row"><label>YouTube URL</label><input name="youtube_url" value="{{ old('youtube_url', $profile->youtube_url) }}"></div>
        <div class="form-row"><label>Spotify URL</label><input name="spotify_url" value="{{ old('spotify_url', $profile->spotify_url) }}"></div>
        <div class="form-row"><label>SoundCloud URL</label><input name="soundcloud_url" value="{{ old('soundcloud_url', $profile->soundcloud_url) }}"></div>
        <button class="button primary" type="submit">Save Bio</button>
    </form>
</section>
@endsection
