<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'headline',
        'short_bio',
        'full_bio',
        'avatar_url',
        'location',
        'email',
        'instagram_url',
        'youtube_url',
        'spotify_url',
        'soundcloud_url',
    ];
}
