<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminTrackController extends Controller
{
    public function index(): View
    {
        return view('admin.tracks.index', [
            'tracks' => Track::query()->latest()->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.tracks.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'artist_name' => ['required', 'string', 'max:255'],
            'genre' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'audio_url' => ['required', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'cover_image_url' => ['nullable', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'external_url' => ['nullable', 'url', 'max:255'],
            'release_date' => ['nullable', 'date'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $data['is_featured'] = $request->boolean('is_featured');

        Track::query()->create($data);

        return redirect()->route('admin.tracks.index')->with('status', 'Track created.');
    }

    public function edit(Track $track): View
    {
        return view('admin.tracks.edit', ['track' => $track]);
    }

    public function update(Request $request, Track $track): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'artist_name' => ['required', 'string', 'max:255'],
            'genre' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'audio_url' => ['required', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'cover_image_url' => ['nullable', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'external_url' => ['nullable', 'url', 'max:255'],
            'release_date' => ['nullable', 'date'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $data['is_featured'] = $request->boolean('is_featured');

        $track->update($data);

        return redirect()->route('admin.tracks.index')->with('status', 'Track updated.');
    }

    public function destroy(Track $track): RedirectResponse
    {
        $track->delete();

        return redirect()->route('admin.tracks.index')->with('status', 'Track deleted.');
    }
}
