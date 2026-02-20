<?php

namespace App\Http\Controllers;

use App\Models\MediaItem;

class MediaController extends Controller
{
    public function index()
    {
        return view('media.index', [
            'photos' => MediaItem::query()->where('type', 'photo')->latest()->get(),
            'videos' => MediaItem::query()->where('type', 'video')->latest()->get(),
            'music' => MediaItem::query()->where('type', 'music')->latest()->get(),
        ]);
    }
}
