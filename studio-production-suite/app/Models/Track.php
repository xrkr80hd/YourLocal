<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Track extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'artist_name',
        'genre',
        'description',
        'audio_url',
        'cover_image_url',
        'external_url',
        'release_date',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'release_date' => 'date',
            'is_featured' => 'boolean',
        ];
    }
}
