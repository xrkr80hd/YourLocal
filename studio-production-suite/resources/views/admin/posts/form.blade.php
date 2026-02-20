<form method="POST" action="{{ $action }}">
    @csrf
    @if($method !== 'POST') @method($method) @endif

    <div class="form-row"><label>Title</label><input name="title" value="{{ old('title', $post?->title) }}" required></div>
    <div class="form-row"><label>Slug</label><input name="slug" value="{{ old('slug', $post?->slug) }}" required></div>
    <div class="form-row"><label>Excerpt</label><textarea name="excerpt">{{ old('excerpt', $post?->excerpt) }}</textarea></div>
    <div class="form-row"><label>Content</label><textarea name="content" required>{{ old('content', $post?->content) }}</textarea></div>
    <div class="form-row"><label>Cover Image URL</label><input name="cover_image_url" data-upload-kind="image" value="{{ old('cover_image_url', $post?->cover_image_url) }}"></div>
    <div class="form-row"><label>Published At</label><input type="datetime-local" name="published_at" value="{{ old('published_at', $post?->published_at?->format('Y-m-d\\TH:i')) }}"></div>
    <div class="form-row"><label><input type="checkbox" name="is_published" value="1" {{ old('is_published', $post?->is_published ?? true) ? 'checked' : '' }}> Published</label></div>

    <button class="button primary" type="submit">Save Post</button>
</form>
