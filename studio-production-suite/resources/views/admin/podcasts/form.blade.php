<form method="POST" action="{{ $action }}">
    @csrf
    @if($method !== 'POST') @method($method) @endif

    <div class="form-row"><label>Title</label><input name="title" value="{{ old('title', $episode?->title) }}" required></div>
    <div class="form-row"><label>Slug</label><input name="slug" value="{{ old('slug', $episode?->slug) }}" required></div>
    <div class="form-row"><label>Summary</label><textarea name="summary">{{ old('summary', $episode?->summary) }}</textarea></div>
    <div class="form-row"><label>Description</label><textarea name="description">{{ old('description', $episode?->description) }}</textarea></div>
    <div class="form-row"><label>Audio URL</label><input name="audio_url" data-upload-kind="audio" value="{{ old('audio_url', $episode?->audio_url) }}" required></div>
    <div class="form-row"><label>Cover Image URL</label><input name="cover_image_url" data-upload-kind="image" value="{{ old('cover_image_url', $episode?->cover_image_url) }}"></div>
    <div class="form-row"><label>Published At</label><input type="datetime-local" name="published_at" value="{{ old('published_at', optional($episode?->published_at)->format('Y-m-d\\TH:i')) }}"></div>
    <div class="form-row"><label><input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $episode?->is_featured) ? 'checked' : '' }}> Featured</label></div>
    <div class="form-row"><label><input type="checkbox" name="is_published" value="1" {{ old('is_published', $episode?->is_published ?? true) ? 'checked' : '' }}> Published</label></div>

    <button class="button primary" type="submit">Save Episode</button>
</form>
