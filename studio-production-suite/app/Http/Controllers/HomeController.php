<?php

namespace App\Http\Controllers;

use App\Models\SiteProfile;
use App\Models\Track;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Schema;

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
        } catch (QueryException) {
            // Keep default empty state if database schema is not initialized yet.
        }

        return view('home', [
            'profile' => $profile,
            'homeTracks' => $homeTracks,
        ]);
    }
}
