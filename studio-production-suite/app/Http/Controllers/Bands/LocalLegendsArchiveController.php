<?php

namespace App\Http\Controllers\Bands;

use App\Http\Controllers\Controller;
use App\Models\Band;
use Illuminate\View\View;

class LocalLegendsArchiveController extends Controller
{
    public function __invoke(): View
    {
        return view('bands.index', [
            'title' => 'YourLocal Legends',
            'badge' => 'Archive Collection',
            'headlineAccent' => 'YourLocal',
            'headlineRest' => 'Legends',
            'subtitle' => 'Legendary local bands that are no longer actively writing, releasing, or performing.',
            'era' => 'archive',
            'bands' => Band::query()
                ->where('era', 'archive')
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }
}
