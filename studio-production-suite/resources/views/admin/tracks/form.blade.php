<form method="POST" action="{{ $action }}">
    @csrf
    @if($method !== 'POST') @method($method) @endif

    <div class="form-row"><label>Title</label><input name="title" value="{{ old('title', $track?->title) }}" required></div>
    <div class="form-row"><label>Artist Name</label><input name="artist_name" value="{{ old('artist_name', $track?->artist_name ?? 'xrkr80hd') }}" required></div>
    <div class="form-row"><label>Genre</label><input name="genre" value="{{ old('genre', $track?->genre) }}"></div>
    <div class="form-row"><label>Description</label><textarea name="description">{{ old('description', $track?->description) }}</textarea></div>
    <div class="form-row"><label>Audio URL</label><input name="audio_url" data-upload-kind="audio" value="{{ old('audio_url', $track?->audio_url) }}" required></div>
    <div class="form-row"><label>Cover Image URL</label><input name="cover_image_url" data-upload-kind="image" value="{{ old('cover_image_url', $track?->cover_image_url) }}"></div>
    <div class="form-row"><label>External URL</label><input name="external_url" value="{{ old('external_url', $track?->external_url) }}"></div>
    <div class="form-row"><label>Release Date</label><input type="date" name="release_date" value="{{ old('release_date', optional($track?->release_date)->format('Y-m-d')) }}"></div>
    <div class="form-row"><label><input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $track?->is_featured) ? 'checked' : '' }}> Featured</label></div>

    <button class="button primary" type="submit">Save Track</button>
</form>
