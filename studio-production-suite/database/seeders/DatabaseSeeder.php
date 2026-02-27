<?php

namespace Database\Seeders;

use App\Models\Band;
use App\Models\BlogPost;
use App\Models\MediaItem;
use App\Models\PodcastEpisode;
use App\Models\Project;
use App\Models\SiteProfile;
use App\Models\Track;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        if (filter_var(env('ADMIN_SEED_ENABLED', false), FILTER_VALIDATE_BOOL)) {
            $seedAdminEmail = (string) env('ADMIN_SEED_EMAIL', '');
            $seedAdminPassword = (string) env('ADMIN_SEED_PASSWORD', '');

            if ($seedAdminEmail !== '' && $seedAdminPassword !== '') {
                User::query()->updateOrCreate(
                    ['email' => $seedAdminEmail],
                    [
                        'name' => (string) env('ADMIN_SEED_NAME', 'Admin'),
                        'password' => Hash::make($seedAdminPassword),
                    ]
                );
            }
        }

        SiteProfile::query()->updateOrCreate(
            ['id' => 1],
            [
                'headline' => 'XRKR80HD',
                'short_bio' => 'I build sonic worlds, ship creative tech projects, and document the process.',
                'full_bio' => 'I am xrkr80hd. I produce original music, create visuals, and develop web experiences that connect sound, story, and technology. This site is my production suite for releases, media drops, projects, and writing.',
                'avatar_url' => null,
                'location' => 'United States',
                'email' => 'contact@xrkr80hd.studio',
            ]
        );

        Track::query()->firstOrCreate(
            ['title' => 'Neon Pulse'],
            [
                'artist_name' => 'xrkr80hd',
                'genre' => 'Electronic',
                'description' => 'Sample seeded demo track.',
                'audio_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                'cover_image_url' => 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
                'external_url' => 'https://xrkr80hd.studio',
                'release_date' => now()->subDays(8),
                'is_featured' => true,
            ]
        );

        Project::query()->firstOrCreate(
            ['slug' => 'signal-landing'],
            [
                'title' => 'Signal Landing',
                'summary' => 'Landing page and brand system for an indie release campaign.',
                'body' => 'Built as a responsive web launch kit with media embeds and release links.',
                'project_url' => 'https://xrkr80hd.studio',
                'repo_url' => 'https://github.com/',
                'cover_image_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
                'is_featured' => true,
            ]
        );

        BlogPost::query()->firstOrCreate(
            ['slug' => 'welcome-to-the-suite'],
            [
                'title' => 'Welcome To The Suite',
                'excerpt' => 'A quick look at my process for music, media, and web projects.',
                'content' => 'This is the central command for my creative output. I publish songs, behind-the-scenes updates, and project breakdowns here.',
                'published_at' => now()->subDays(2),
                'is_published' => true,
            ]
        );

        MediaItem::query()->firstOrCreate(
            ['title' => 'Studio Session Clip'],
            [
                'type' => 'video',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
                'media_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'caption' => 'Quick clip from a production session.',
                'is_featured' => true,
            ]
        );

        Band::query()->firstOrCreate(
            ['slug' => 'signal-flame'],
            [
                'name' => 'Signal Flame',
                'era' => 'archive',
                'years_active' => '1999 - 2004',
                'genre' => 'Rock',
                'tagline' => 'Late-night rehearsals and loud conviction.',
                'summary' => 'Local rock band remembered for high-energy sets and a loyal hometown crowd.',
                'story' => 'Signal Flame formed from youth group jam nights and grew into a staple of regional all-ages shows. Their original songs carried personal stories and faith-forward lyrics.',
                'image_url' => 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
                'is_published' => true,
                'sort_order' => 1,
            ]
        );

        Band::query()->firstOrCreate(
            ['slug' => 'northline-echo'],
            [
                'name' => 'Northline Echo',
                'era' => 'archive',
                'years_active' => '2001 - 2008',
                'genre' => 'Alternative',
                'tagline' => 'Melodic grit with hometown roots.',
                'summary' => 'An alternative band known for introspective writing and memorable local club sets.',
                'story' => 'Northline Echo blended driving guitars with melodic hooks and built a dedicated following across church and venue circuits before closing their chapter.',
                'image_url' => 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
                'is_published' => true,
                'sort_order' => 2,
            ]
        );

        Band::query()->firstOrCreate(
            ['slug' => 'city-lights-broadcast'],
            [
                'name' => 'City Lights Broadcast',
                'era' => 'scene',
                'years_active' => '2018 - Present',
                'genre' => 'Indie Rock',
                'tagline' => 'Current scene. New songs. Full rooms.',
                'summary' => 'A modern local band carrying the scene with tight live shows and new releases.',
                'story' => 'City Lights Broadcast emerged from the DIY circuit and quickly became a consistent draw with energetic live performances and regular releases.',
                'image_url' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
                'is_published' => true,
                'sort_order' => 1,
            ]
        );

        PodcastEpisode::query()->firstOrCreate(
            ['slug' => 'episode-001-local-scene-stories'],
            [
                'title' => 'Episode 001: Local Scene Stories',
                'summary' => 'Kickoff episode for YourLocal Podcast covering local scene history and where it is heading.',
                'description' => 'Intro episode for YourLocal Podcast. We break down legacy bands, current bands, and what this platform is building toward.',
                'audio_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                'cover_image_url' => 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=80',
                'is_featured' => true,
                'is_published' => true,
                'published_at' => now()->subDay(),
            ]
        );
    }
}
