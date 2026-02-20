<form method="POST" action="{{ $action }}">
    @csrf
    @if($method !== 'POST') @method($method) @endif

    <div class="form-row"><label>Name</label><input name="name" value="{{ old('name', $band?->name) }}" required></div>
    <div class="form-row"><label>Slug</label><input name="slug" value="{{ old('slug', $band?->slug) }}" required></div>

    <div class="form-row">
        <label>Scene</label>
        <select name="era" required>
            <option value="archive" @selected(old('era', $band?->era) === 'archive')>YourLocal Legends</option>
            <option value="scene" @selected(old('era', $band?->era) === 'scene')>YourLocal Scene</option>
        </select>
    </div>

    <div class="form-row"><label>Years Active</label><input name="years_active" value="{{ old('years_active', $band?->years_active) }}" placeholder="2008 - 2012"></div>
    <div class="form-row">
        <label>Genre</label>
        <select name="genre">
            <option value="">Select genre</option>
            @foreach($genres as $genreOption)
                <option value="{{ $genreOption }}" @selected(old('genre', in_array($band?->genre, $genres ?? [], true) ? $band?->genre : 'other') === $genreOption)>{{ ucfirst($genreOption) }}</option>
            @endforeach
        </select>
    </div>
    <div class="form-row"><label>Genre (if Other)</label><input name="genre_other" value="{{ old('genre_other', !in_array($band?->genre, $genres ?? [], true) ? $band?->genre : '') }}" placeholder="e.g. Post-Rock"></div>
    <div class="form-row"><label>Tagline</label><input name="tagline" value="{{ old('tagline', $band?->tagline) }}"></div>
    <div class="form-row"><label>Card Summary</label><textarea name="summary" required>{{ old('summary', $band?->summary) }}</textarea></div>
    <div class="form-row"><label>Story (Band Page)</label><textarea name="story">{{ old('story', $band?->story) }}</textarea></div>
    <div class="form-row"><label>Card Image URL (16:10, 1200x750)</label><input name="image_url" data-upload-kind="image" value="{{ old('image_url', $band?->image_url) }}"></div>
    <div class="form-row"><label>Banner Image URL (16:9, 2560x1440)</label><input name="banner_image_url" data-upload-kind="image" value="{{ old('banner_image_url', $band?->banner_image_url) }}"></div>
    <div class="form-row"><label>Band Photo URL (3:4 portrait, 1500x2000)</label><input name="band_photo_url" data-upload-kind="image" value="{{ old('band_photo_url', $band?->band_photo_url) }}"></div>
    <div class="form-row"><label><input type="checkbox" name="is_solo_artist" value="1" {{ old('is_solo_artist', $band?->is_solo_artist) ? 'checked' : '' }}> Solo Artist</label></div>
    <div class="form-row">
        <label>Band Members (one per line: Name | Role | Image URL)</label>
        <textarea name="members_text" rows="7" placeholder="Jane Doe | Vocals | https://...">{{ old('members_text', collect($band?->members_json ?? [])->map(fn($m) => ($m['name'] ?? '') . ' | ' . ($m['role'] ?? '') . ' | ' . ($m['image_url'] ?? ''))->implode(PHP_EOL)) }}</textarea>
    </div>
    <div class="form-row"><label>Sort Order</label><input type="number" name="sort_order" value="{{ old('sort_order', $band?->sort_order ?? 0) }}" min="0"></div>
    <div class="form-row"><label><input type="checkbox" name="is_published" value="1" {{ old('is_published', $band?->is_published ?? true) ? 'checked' : '' }}> Published</label></div>

    <button class="button primary" type="submit">Save Band</button>
</form>
