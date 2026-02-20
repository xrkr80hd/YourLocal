<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('era', ['archive', 'scene'])->default('archive');
            $table->string('years_active', 60)->nullable();
            $table->string('genre', 80)->nullable();
            $table->string('tagline', 180)->nullable();
            $table->string('summary', 320);
            $table->longText('story')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['era', 'is_published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bands');
    }
};
