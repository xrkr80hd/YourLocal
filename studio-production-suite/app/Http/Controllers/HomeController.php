<?php

namespace App\Http\Controllers;

use App\Models\SiteProfile;
use App\Models\Track;

class HomeController extends Controller
{
    public function __invoke()
    {
        $homeTracks = Track::query()->latest('release_date')->latest()->take(12)->get();

        return view('home', [
            'profile' => SiteProfile::query()->first(),
            'homeTracks' => $homeTracks,
        ]);
    }
}
