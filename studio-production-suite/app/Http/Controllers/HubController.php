<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\MediaItem;
use App\Models\Project;
use App\Models\Track;

class HubController extends Controller
{
    public function __invoke()
    {
        $tracks = Track::query()->latest('release_date')->latest()->take(8)->get();
        $projects = Project::query()->latest()->take(8)->get();
        $posts = BlogPost::query()->where('is_published', true)->latest('published_at')->take(8)->get();
        $photos = MediaItem::query()->where('type', 'photo')->latest()->take(8)->get();
        $videos = MediaItem::query()->where('type', 'video')->latest()->take(8)->get();
        $media = MediaItem::query()->latest()->take(8)->get();

        return view('hub.index', [
            'tracks' => $tracks,
            'projects' => $projects,
            'posts' => $posts,
            'photos' => $photos,
            'videos' => $videos,
            'media' => $media,
            'counts' => [
                'tracks' => Track::query()->count(),
                'projects' => Project::query()->count(),
                'posts' => BlogPost::query()->where('is_published', true)->count(),
                'media' => MediaItem::query()->count(),
            ],
        ]);
    }
}
