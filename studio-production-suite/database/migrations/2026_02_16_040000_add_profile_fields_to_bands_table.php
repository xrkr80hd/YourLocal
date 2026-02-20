<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bands', function (Blueprint $table) {
            $table->string('banner_image_url')->nullable()->after('image_url');
            $table->string('band_photo_url')->nullable()->after('banner_image_url');
            $table->boolean('is_solo_artist')->default(false)->after('band_photo_url');
            $table->json('members_json')->nullable()->after('is_solo_artist');
        });
    }

    public function down(): void
    {
        Schema::table('bands', function (Blueprint $table) {
            $table->dropColumn(['banner_image_url', 'band_photo_url', 'is_solo_artist', 'members_json']);
        });
    }
};
