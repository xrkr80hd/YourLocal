<form method="POST" action="{{ $action }}">
    @csrf
    @if($method !== 'POST') @method($method) @endif

    <div class="form-row"><label>Title</label><input name="title" value="{{ old('title', $project?->title) }}" required></div>
    <div class="form-row"><label>Slug</label><input name="slug" value="{{ old('slug', $project?->slug) }}" required></div>
    <div class="form-row"><label>Summary</label><textarea name="summary" required>{{ old('summary', $project?->summary) }}</textarea></div>
    <div class="form-row"><label>Body</label><textarea name="body">{{ old('body', $project?->body) }}</textarea></div>
    <div class="form-row"><label>Cover Image URL</label><input name="cover_image_url" data-upload-kind="image" value="{{ old('cover_image_url', $project?->cover_image_url) }}"></div>
    <div class="form-row"><label>Project URL</label><input name="project_url" value="{{ old('project_url', $project?->project_url) }}"></div>
    <div class="form-row"><label>Repo URL</label><input name="repo_url" value="{{ old('repo_url', $project?->repo_url) }}"></div>
    <div class="form-row"><label><input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $project?->is_featured) ? 'checked' : '' }}> Featured</label></div>

    <button class="button primary" type="submit">Save Project</button>
</form>
