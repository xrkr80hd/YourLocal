<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PodcastEpisode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class AdminPodcastEpisodeController extends Controller
{
    public function index(): View
    {
        return view('admin.podcasts.index', [
            'episodes' => PodcastEpisode::query()->latest('published_at')->latest()->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.podcasts.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateEpisode($request);
        PodcastEpisode::query()->create($data);

        return redirect()->route('admin.podcasts.index')->with('status', 'Podcast episode created.');
    }

    public function edit(PodcastEpisode $podcast): View
    {
        return view('admin.podcasts.edit', ['episode' => $podcast]);
    }

    public function update(Request $request, PodcastEpisode $podcast): RedirectResponse
    {
        $data = $this->validateEpisode($request, $podcast->id);
        $podcast->update($data);

        return redirect()->route('admin.podcasts.index')->with('status', 'Podcast episode updated.');
    }

    public function destroy(PodcastEpisode $podcast): RedirectResponse
    {
        $podcast->delete();

        return redirect()->route('admin.podcasts.index')->with('status', 'Podcast episode deleted.');
    }

    private function validateEpisode(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('podcast_episodes', 'slug')->ignore($ignoreId)],
            'summary' => ['nullable', 'string', 'max:320'],
            'description' => ['nullable', 'string'],
            'audio_url' => ['required', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'cover_image_url' => ['nullable', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'published_at' => ['nullable', 'date'],
            'is_featured' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_published'] = $request->boolean('is_published');

        return $data;
    }
}
