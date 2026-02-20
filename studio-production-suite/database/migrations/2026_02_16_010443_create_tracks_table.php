<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tracks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('artist_name')->default('xrkr80hd');
            $table->string('genre')->nullable();
            $table->text('description')->nullable();
            $table->string('audio_url');
            $table->string('cover_image_url')->nullable();
            $table->string('external_url')->nullable();
            $table->date('release_date')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracks');
    }
};
