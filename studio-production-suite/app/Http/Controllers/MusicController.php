<?php

namespace App\Http\Controllers;

use App\Models\Track;

class MusicController extends Controller
{
    public function index()
    {
        return view('music.index', [
            'tracks' => Track::query()->latest('release_date')->latest()->get(),
        ]);
    }
}
