<?php

namespace App\Http\Controllers\Bands;

use App\Http\Controllers\Controller;
use App\Models\Band;
use Illuminate\View\View;

class BandShowController extends Controller
{
    public function __invoke(Band $band): View
    {
        abort_unless($band->is_published, 404);

        return view('bands.show', [
            'band' => $band,
            'backRoute' => $band->era === 'archive' ? 'bands.archive' : 'bands.scene',
            'backLabel' => $band->era === 'archive' ? 'Back to YourLocal Legends' : 'Back to YourLocal Scene',
            'members' => collect($band->members_json ?? [])->values(),
        ]);
    }
}
