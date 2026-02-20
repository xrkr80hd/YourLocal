<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminMediaController extends Controller
{
    public function index(): View
    {
        return view('admin.media.index', [
            'mediaItems' => MediaItem::query()->latest()->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.media.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateMedia($request);
        MediaItem::query()->create($data);

        return redirect()->route('admin.media.index')->with('status', 'Media item created.');
    }

    public function edit(MediaItem $medium): View
    {
        return view('admin.media.edit', ['mediaItem' => $medium]);
    }

    public function update(Request $request, MediaItem $medium): RedirectResponse
    {
        $data = $this->validateMedia($request);
        $medium->update($data);

        return redirect()->route('admin.media.index')->with('status', 'Media item updated.');
    }

    public function destroy(MediaItem $medium): RedirectResponse
    {
        $medium->delete();

        return redirect()->route('admin.media.index')->with('status', 'Media item deleted.');
    }

    private function validateMedia(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:photo,video,music'],
            'thumbnail_url' => ['nullable', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'media_url' => ['required', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'caption' => ['nullable', 'string'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $data['is_featured'] = $request->boolean('is_featured');

        return $data;
    }
}
