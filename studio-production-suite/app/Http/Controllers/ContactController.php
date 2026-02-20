<?php

namespace App\Http\Controllers;

use App\Models\SiteProfile;

class ContactController extends Controller
{
    public function __invoke()
    {
        return view('contact', [
            'profile' => SiteProfile::query()->first(),
        ]);
    }
}
