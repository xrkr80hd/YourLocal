<?php

namespace App\Http\Controllers;

use App\Models\SiteProfile;
use App\Models\Track;
use Illuminate\Support\Facades\Schema;
use Throwable;

class HomeController extends Controller
{
    public function __invoke()
    {
        $homeTracks = collect();
        $profile = null;

        try {
            if (Schema::hasTable('tracks')) {
                $homeTracks = Track::query()->latest('release_date')->latest()->take(12)->get();
            }

            if (Schema::hasTable('site_profiles')) {
                $profile = SiteProfile::query()->first();
            }
        } catch (Throwable) {
            // Keep default empty state if database schema is not initialized yet.
        }

        return view('home', [
            'profile' => $profile,
            'homeTracks' => $homeTracks,
        ]);
    }
}
