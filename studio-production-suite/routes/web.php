<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminBandController;
use App\Http\Controllers\Admin\AdminBioController;
use App\Http\Controllers\Admin\AdminBlogPostController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminMediaController;
use App\Http\Controllers\Admin\AdminPodcastEpisodeController;
use App\Http\Controllers\Admin\AdminProjectController;
use App\Http\Controllers\Admin\AdminSupabaseSessionController;
use App\Http\Controllers\Admin\AdminTrackController;
use App\Http\Controllers\Admin\AdminUploadController;
use App\Http\Controllers\Bands\BandShowController;
use App\Http\Controllers\Bands\LocalLegendsArchiveController;
use App\Http\Controllers\Bands\YourLocalSceneController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\HubController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\MusicController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\ProjectsController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/contact', ContactController::class)->name('contact.index');
Route::get('/hub', HubController::class)->name('hub.index');
Route::get('/music', [MusicController::class, 'index'])->name('music.index');
Route::get('/projects', [ProjectsController::class, 'index'])->name('projects.index');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{post:slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/media', [MediaController::class, 'index'])->name('media.index');
Route::get('/podcast', [PodcastController::class, 'index'])->name('podcast.index');
Route::get('/local-legends-archive', LocalLegendsArchiveController::class)->name('bands.archive');
Route::get('/your-local-scene', YourLocalSceneController::class)->name('bands.scene');
Route::get('/bands/{band:slug}', BandShowController::class)->name('bands.show');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return auth()->check()
            ? redirect()->route('admin.dashboard')
            : redirect()->route('admin.login');
    });

    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'login'])->name('login.attempt');
        Route::post('/supabase/session', [AdminSupabaseSessionController::class, 'store'])->name('supabase.session.store');
    });

    Route::middleware('admin.access')->group(function () {
        Route::post('/logout', [AdminSupabaseSessionController::class, 'destroy'])->name('logout');
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

        Route::get('/bio', [AdminBioController::class, 'edit'])->name('bio.edit');
        Route::put('/bio', [AdminBioController::class, 'update'])->name('bio.update');

        Route::resource('tracks', AdminTrackController::class)->except(['show']);
        Route::resource('podcasts', AdminPodcastEpisodeController::class)->except(['show'])->parameters(['podcasts' => 'podcast']);
        Route::resource('bands', AdminBandController::class)->except(['show']);
        Route::resource('projects', AdminProjectController::class)->except(['show']);
        Route::resource('posts', AdminBlogPostController::class)->except(['show']);
        Route::post('/upload', AdminUploadController::class)->name('upload');
        Route::resource('media', AdminMediaController::class)
            ->except(['show'])
            ->parameters(['media' => 'medium']);
    });
});
