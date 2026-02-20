<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Band;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class AdminBandController extends Controller
{
    private const GENRES = [
        'rock', 'metal', 'country', 'djent', 'gospel', 'indie', 'christian', 'punk',
        'alternative', 'hardcore', 'worship', 'pop', 'hip-hop', 'electronic', 'other',
    ];

    public function index(): View
    {
        $eraFilter = request()->query('era');
        $eraFilter = in_array($eraFilter, ['archive', 'scene'], true) ? $eraFilter : null;

        $bandsQuery = Band::query();
        if ($eraFilter) {
            $bandsQuery->where('era', $eraFilter);
        }

        return view('admin.bands.index', [
            'bands' => $bandsQuery->orderBy('era')->orderBy('sort_order')->orderBy('name')->get(),
            'eraFilter' => $eraFilter,
            'counts' => [
                'all' => Band::query()->count(),
                'archive' => Band::query()->where('era', 'archive')->count(),
                'scene' => Band::query()->where('era', 'scene')->count(),
            ],
        ]);
    }

    public function create(): View
    {
        return view('admin.bands.create', ['genres' => self::GENRES]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateBand($request);
        Band::query()->create($data);

        return redirect()->route('admin.bands.index')->with('status', 'Band created.');
    }

    public function edit(Band $band): View
    {
        return view('admin.bands.edit', ['band' => $band, 'genres' => self::GENRES]);
    }

    public function update(Request $request, Band $band): RedirectResponse
    {
        $data = $this->validateBand($request, $band->id);
        $band->update($data);

        return redirect()->route('admin.bands.index')->with('status', 'Band updated.');
    }

    public function destroy(Band $band): RedirectResponse
    {
        $band->delete();

        return redirect()->route('admin.bands.index')->with('status', 'Band deleted.');
    }

    private function validateBand(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('bands', 'slug')->ignore($ignoreId)],
            'era' => ['required', Rule::in(['archive', 'scene'])],
            'years_active' => ['nullable', 'string', 'max:60'],
            'genre' => ['nullable', Rule::in(self::GENRES)],
            'genre_other' => ['nullable', 'string', 'max:80'],
            'tagline' => ['nullable', 'string', 'max:180'],
            'summary' => ['required', 'string', 'max:320'],
            'story' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'banner_image_url' => ['nullable', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'band_photo_url' => ['nullable', 'string', 'max:255', 'regex:/^(https?:\/\/|\/).+/i'],
            'is_solo_artist' => ['nullable', 'boolean'],
            'members_text' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $data['is_published'] = $request->boolean('is_published');
        $data['is_solo_artist'] = $request->boolean('is_solo_artist');
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);
        $data['genre'] = $data['genre'] === 'other' && !empty($data['genre_other'])
            ? trim($data['genre_other'])
            : $data['genre'];
        $data['members_json'] = $this->parseMembers($request->input('members_text'));

        unset($data['genre_other'], $data['members_text']);

        return $data;
    }

    private function parseMembers(?string $text): array
    {
        $text = trim((string) ($text ?? ''));
        if ($text === '') {
            return [];
        }

        $lines = preg_split('/\r\n|\r|\n/', $text);
        $members = [];

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            $parts = array_map('trim', explode('|', $line));
            $members[] = [
                'name' => $parts[0] ?? '',
                'role' => $parts[1] ?? '',
                'image_url' => $parts[2] ?? '',
            ];
        }

        return array_values(array_filter($members, fn ($m) => $m['name'] !== ''));
    }
}
