<?php

namespace App\Http\Controllers\Bands;

use App\Http\Controllers\Controller;
use App\Models\Band;
use Illuminate\View\View;

class YourLocalSceneController extends Controller
{
    public function __invoke(): View
    {
        return view('bands.index', [
            'title' => 'YourLocal Scene',
            'badge' => 'Current Scene',
            'headlineAccent' => 'YourLocal',
            'headlineRest' => 'Scene',
            'subtitle' => 'Current local bands that are actively writing, releasing, and performing now.',
            'era' => 'scene',
            'bands' => Band::query()
                ->where('era', 'scene')
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }
}
