<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Band;
use App\Models\BlogPost;
use App\Models\MediaItem;
use App\Models\PodcastEpisode;
use App\Models\Project;
use App\Models\Track;
use Illuminate\View\View;

class AdminDashboardController extends Controller
{
    public function __invoke(): View
    {
        return view('admin.dashboard', [
            'counts' => [
                'tracks' => Track::query()->count(),
                'bands' => Band::query()->count(),
                'bands_published' => Band::query()->where('is_published', true)->count(),
                'podcasts' => PodcastEpisode::query()->count(),
                'podcasts_published' => PodcastEpisode::query()->where('is_published', true)->count(),
                'projects' => Project::query()->count(),
                'posts' => BlogPost::query()->count(),
                'posts_published' => BlogPost::query()->where('is_published', true)->count(),
                'media' => MediaItem::query()->count(),
                'media_photos' => MediaItem::query()->where('type', 'photo')->count(),
                'media_videos' => MediaItem::query()->where('type', 'video')->count(),
                'media_music' => MediaItem::query()->where('type', 'music')->count(),
            ],
        ]);
    }
}
