<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Band extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'era',
        'years_active',
        'genre',
        'tagline',
        'summary',
        'story',
        'image_url',
        'banner_image_url',
        'band_photo_url',
        'is_solo_artist',
        'members_json',
        'is_published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'is_solo_artist' => 'boolean',
            'members_json' => 'array',
            'sort_order' => 'integer',
        ];
    }
}
