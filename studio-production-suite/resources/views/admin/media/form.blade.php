<form method="POST" action="{{ $action }}">
    @csrf
    @if($method !== 'POST') @method($method) @endif

    <div class="form-row"><label>Title</label><input name="title" value="{{ old('title', $mediaItem?->title) }}" required></div>
    <div class="form-row">
        <label>Type</label>
        <select name="type" required>
            @foreach(['photo', 'video', 'music'] as $type)
                <option value="{{ $type }}" {{ old('type', $mediaItem?->type) === $type ? 'selected' : '' }}>{{ ucfirst($type) }}</option>
            @endforeach
        </select>
    </div>
    <div class="form-row"><label>Thumbnail URL</label><input name="thumbnail_url" data-upload-kind="image" value="{{ old('thumbnail_url', $mediaItem?->thumbnail_url) }}"></div>
    <div class="form-row"><label>Media URL</label><input name="media_url" data-upload-kind="media-from-type" value="{{ old('media_url', $mediaItem?->media_url) }}" required></div>
    <div class="form-row"><label>Caption</label><textarea name="caption">{{ old('caption', $mediaItem?->caption) }}</textarea></div>
    <div class="form-row"><label><input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $mediaItem?->is_featured) ? 'checked' : '' }}> Featured</label></div>

    <button class="button primary" type="submit">Save Media</button>
</form>
