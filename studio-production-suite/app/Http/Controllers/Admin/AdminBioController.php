<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminBioController extends Controller
{
    public function edit(): View
    {
        return view('admin.bio.edit', [
            'profile' => SiteProfile::query()->firstOrCreate([], [
                'headline' => 'Artist, creator, and builder',
            ]),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'headline' => ['nullable', 'string', 'max:255'],
            'short_bio' => ['nullable', 'string', 'max:300'],
            'full_bio' => ['nullable', 'string'],
            'avatar_url' => ['nullable', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'location' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'spotify_url' => ['nullable', 'url', 'max:255'],
            'soundcloud_url' => ['nullable', 'url', 'max:255'],
        ]);

        SiteProfile::query()->firstOrCreate([])->update($data);

        return redirect()->route('admin.bio.edit')->with('status', 'Bio updated.');
    }
}
