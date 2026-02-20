<?php

namespace Tests\Feature;

use App\Models\Band;
use App\Models\BlogPost;
use App\Models\MediaItem;
use App\Models\PodcastEpisode;
use App\Models\Project;
use App\Models\SiteProfile;
use App\Models\Track;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class BackendEndpointAuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_endpoints_render_without_server_error(): void
    {
        $band = Band::query()->create([
            'name' => 'Signal Flame',
            'slug' => 'signal-flame',
            'era' => 'scene',
            'summary' => 'Band summary',
            'story' => 'Band story',
            'genre' => 'rock',
            'is_published' => true,
            'sort_order' => 1,
        ]);

        $post = BlogPost::query()->create([
            'title' => 'Launch Post',
            'slug' => 'launch-post',
            'excerpt' => 'Excerpt',
            'content' => 'Content body',
            'is_published' => true,
            'published_at' => now(),
        ]);

        Track::query()->create([
            'title' => 'Test Track',
            'artist_name' => 'Artist',
            'audio_url' => 'https://example.com/audio.mp3',
            'is_featured' => false,
        ]);

        Project::query()->create([
            'title' => 'Test Project',
            'slug' => 'test-project',
            'summary' => 'Summary',
            'body' => 'Body',
            'is_featured' => false,
        ]);

        MediaItem::query()->create([
            'type' => 'photo',
            'title' => 'Media',
            'media_url' => 'https://example.com/media.jpg',
        ]);

        PodcastEpisode::query()->create([
            'title' => 'Episode',
            'slug' => 'episode',
            'summary' => 'Summary',
            'description' => 'Description',
            'audio_url' => 'https://example.com/audio.mp3',
            'is_published' => true,
            'published_at' => now(),
        ]);

        SiteProfile::query()->create([
            'headline' => 'XRKR80HD',
            'short_bio' => 'Short bio',
            'full_bio' => 'Full bio',
            'email' => 'admin@example.com',
        ]);

        $this->get('/')->assertOk();
        $this->get('/contact')->assertOk();
        $this->get('/hub')->assertOk();
        $this->get('/music')->assertOk();
        $this->get('/projects')->assertOk();
        $this->get('/blog')->assertOk();
        $this->get('/blog/' . $post->slug)->assertOk();
        $this->get('/media')->assertOk();
        $this->get('/podcast')->assertOk();
        $this->get('/local-legends-archive')->assertOk();
        $this->get('/your-local-scene')->assertOk();
        $this->get('/bands/' . $band->slug)->assertOk();
    }

    public function test_admin_auth_flow_works(): void
    {
        $password = 'changeme123!';
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt($password),
        ]);

        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get('/admin/login')->assertOk();

        $this->post('/admin/login', [
            'email' => $user->email,
            'password' => $password,
        ])->assertRedirect('/admin/dashboard');

        $this->post('/admin/logout')->assertRedirect('/admin/login');
    }

    public function test_admin_band_crud_end_to_end_including_update_after_create(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get('/admin/bands')->assertOk();
        $this->get('/admin/bands/create')->assertOk();

        $createPayload = [
            'name' => 'Create Then Edit',
            'slug' => 'create-then-edit',
            'era' => 'scene',
            'years_active' => '2020 - Present',
            'genre' => 'other',
            'genre_other' => 'Post-Rock',
            'tagline' => 'Tagline',
            'summary' => 'Summary text for card',
            'story' => 'Story body',
            'image_url' => '/uploads/images/card.jpg',
            'banner_image_url' => '/uploads/images/banner.jpg',
            'band_photo_url' => '/uploads/images/photo.jpg',
            'is_solo_artist' => '1',
            'members_text' => "Jane Doe | Vocals | /uploads/images/jane.jpg\nJohn Roe | Drums | /uploads/images/john.jpg",
            'sort_order' => '7',
            'is_published' => '1',
        ];

        $this->post('/admin/bands', $createPayload)->assertRedirect('/admin/bands');

        $band = Band::query()->where('slug', 'create-then-edit')->firstOrFail();
        $this->assertSame('Post-Rock', $band->genre);
        $this->assertTrue($band->is_solo_artist);
        $this->assertCount(2, $band->members_json ?? []);

        $this->get('/admin/bands/' . $band->id . '/edit')->assertOk();

        $updatePayload = [
            'name' => 'Create Then Edit Updated',
            'slug' => 'create-then-edit',
            'era' => 'archive',
            'years_active' => '2019 - 2025',
            'genre' => 'rock',
            'genre_other' => '',
            'tagline' => 'Updated tagline',
            'summary' => 'Updated summary text for card',
            'story' => 'Updated story body',
            'image_url' => '/uploads/images/card-updated.jpg',
            'banner_image_url' => '/uploads/images/banner-updated.jpg',
            'band_photo_url' => '/uploads/images/photo-updated.jpg',
            'members_text' => "Jane Doe | Vocals | /uploads/images/jane.jpg",
            'sort_order' => '3',
        ];

        $this->put('/admin/bands/' . $band->id, $updatePayload)->assertRedirect('/admin/bands');

        $band->refresh();
        $this->assertSame('Create Then Edit Updated', $band->name);
        $this->assertSame('archive', $band->era);
        $this->assertSame('rock', $band->genre);
        $this->assertFalse($band->is_solo_artist);
        $this->assertFalse($band->is_published);
        $this->assertCount(1, $band->members_json ?? []);

        $this->delete('/admin/bands/' . $band->id)->assertRedirect('/admin/bands');
        $this->assertDatabaseMissing('bands', ['id' => $band->id]);
    }

    public function test_remaining_admin_endpoints_work_end_to_end(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get('/admin/dashboard')->assertOk();
        $this->get('/admin/bio')->assertOk();
        $this->put('/admin/bio', [
            'headline' => 'XRKR80HD',
            'short_bio' => 'Updated short bio',
            'full_bio' => 'Updated full bio',
            'avatar_url' => '/uploads/images/avatar.jpg',
            'location' => 'United States',
            'email' => 'admin@example.com',
            'instagram_url' => 'https://instagram.com/xrkr80hd',
            'youtube_url' => 'https://youtube.com/@xrkr80hd',
            'spotify_url' => 'https://open.spotify.com/artist/example',
            'soundcloud_url' => 'https://soundcloud.com/xrkr80hd',
        ])->assertRedirect('/admin/bio');

        $this->get('/admin/tracks')->assertOk();
        $this->get('/admin/tracks/create')->assertOk();
        $this->post('/admin/tracks', [
            'title' => 'Track',
            'artist_name' => 'Artist',
            'genre' => 'Electronic',
            'description' => 'Desc',
            'audio_url' => '/uploads/audio/track.mp3',
            'cover_image_url' => '/uploads/images/track.jpg',
            'external_url' => 'https://example.com/track',
            'release_date' => now()->toDateString(),
            'is_featured' => '1',
        ])->assertRedirect('/admin/tracks');
        $track = Track::query()->firstOrFail();
        $this->get('/admin/tracks/' . $track->id . '/edit')->assertOk();
        $this->put('/admin/tracks/' . $track->id, [
            'title' => 'Track Updated',
            'artist_name' => 'Artist',
            'genre' => 'Electronic',
            'description' => 'Desc updated',
            'audio_url' => '/uploads/audio/track-2.mp3',
            'cover_image_url' => '/uploads/images/track-2.jpg',
            'external_url' => 'https://example.com/track-2',
            'release_date' => now()->toDateString(),
        ])->assertRedirect('/admin/tracks');
        $this->delete('/admin/tracks/' . $track->id)->assertRedirect('/admin/tracks');

        $this->get('/admin/projects')->assertOk();
        $this->get('/admin/projects/create')->assertOk();
        $this->post('/admin/projects', [
            'title' => 'Project',
            'slug' => 'project',
            'summary' => 'Summary',
            'body' => 'Body',
            'cover_image_url' => '/uploads/images/project.jpg',
            'project_url' => 'https://example.com/project',
            'repo_url' => 'https://github.com/example/project',
            'is_featured' => '1',
        ])->assertRedirect('/admin/projects');
        $project = Project::query()->firstOrFail();
        $this->get('/admin/projects/' . $project->id . '/edit')->assertOk();
        $this->put('/admin/projects/' . $project->id, [
            'title' => 'Project Updated',
            'slug' => 'project',
            'summary' => 'Updated Summary',
            'body' => 'Updated body',
            'cover_image_url' => '/uploads/images/project-2.jpg',
            'project_url' => 'https://example.com/project-2',
            'repo_url' => 'https://github.com/example/project-2',
        ])->assertRedirect('/admin/projects');
        $this->delete('/admin/projects/' . $project->id)->assertRedirect('/admin/projects');

        $this->get('/admin/posts')->assertOk();
        $this->get('/admin/posts/create')->assertOk();
        $this->post('/admin/posts', [
            'title' => 'Post',
            'slug' => 'post',
            'excerpt' => 'Excerpt',
            'content' => 'Content',
            'cover_image_url' => '/uploads/images/post.jpg',
            'published_at' => now()->toDateTimeString(),
            'is_published' => '1',
        ])->assertRedirect('/admin/posts');
        $post = BlogPost::query()->firstOrFail();
        $this->get('/admin/posts/' . $post->id . '/edit')->assertOk();
        $this->put('/admin/posts/' . $post->id, [
            'title' => 'Post Updated',
            'slug' => 'post',
            'excerpt' => 'Updated Excerpt',
            'content' => 'Updated content',
            'cover_image_url' => '/uploads/images/post-2.jpg',
            'published_at' => now()->toDateTimeString(),
        ])->assertRedirect('/admin/posts');
        $this->delete('/admin/posts/' . $post->id)->assertRedirect('/admin/posts');

        $this->get('/admin/podcasts')->assertOk();
        $this->get('/admin/podcasts/create')->assertOk();
        $this->post('/admin/podcasts', [
            'title' => 'Episode',
            'slug' => 'episode-1',
            'summary' => 'Summary',
            'description' => 'Description',
            'audio_url' => '/uploads/audio/episode.mp3',
            'cover_image_url' => '/uploads/images/episode.jpg',
            'published_at' => now()->toDateTimeString(),
            'is_featured' => '1',
            'is_published' => '1',
        ])->assertRedirect('/admin/podcasts');
        $podcast = PodcastEpisode::query()->firstOrFail();
        $this->get('/admin/podcasts/' . $podcast->id . '/edit')->assertOk();
        $this->put('/admin/podcasts/' . $podcast->id, [
            'title' => 'Episode Updated',
            'slug' => 'episode-1',
            'summary' => 'Summary updated',
            'description' => 'Description updated',
            'audio_url' => '/uploads/audio/episode-2.mp3',
            'cover_image_url' => '/uploads/images/episode-2.jpg',
            'published_at' => now()->toDateTimeString(),
        ])->assertRedirect('/admin/podcasts');
        $this->delete('/admin/podcasts/' . $podcast->id)->assertRedirect('/admin/podcasts');

        $this->get('/admin/media')->assertOk();
        $this->get('/admin/media/create')->assertOk();
        $this->post('/admin/media', [
            'title' => 'Media',
            'type' => 'video',
            'thumbnail_url' => '/uploads/images/media-thumb.jpg',
            'media_url' => '/uploads/video/media.mp4',
            'caption' => 'Caption',
            'is_featured' => '1',
        ])->assertRedirect('/admin/media');
        $medium = MediaItem::query()->firstOrFail();
        $this->get('/admin/media/' . $medium->id . '/edit')->assertOk();
        $this->put('/admin/media/' . $medium->id, [
            'title' => 'Media Updated',
            'type' => 'photo',
            'thumbnail_url' => '/uploads/images/media-thumb-2.jpg',
            'media_url' => '/uploads/images/media.jpg',
            'caption' => 'Caption updated',
        ])->assertRedirect('/admin/media');
        $this->delete('/admin/media/' . $medium->id)->assertRedirect('/admin/media');

        $this->post('/admin/upload', [
            'kind' => 'image',
            'file' => UploadedFile::fake()->image('cover.jpg'),
        ])->assertOk()->assertJsonStructure(['url']);
    }
}
