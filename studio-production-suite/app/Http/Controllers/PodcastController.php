<?php

namespace App\Http\Controllers;

use App\Models\PodcastEpisode;

class PodcastController extends Controller
{
    public function index()
    {
        return view('podcast.index', [
            'episodes' => PodcastEpisode::query()
                ->where('is_published', true)
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }
}
