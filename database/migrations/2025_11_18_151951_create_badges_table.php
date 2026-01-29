<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image_url')->nullable(); // logo ou icône du badge
            $table->string('image_url_public_id')->nullable();

            // Critères d’obtention
            $table->text('criteria')->nullable();
            // ex : {"competence_ids": [1,2], "min_score": 80}

            // Catégorie / type
            $table->enum('badge_type', ['micro', 'macro', 'achievement', 'participation'])->default('achievement');

            // Visibilité
            $table->boolean('is_visible')->default(true);

            // Versioning et traçabilité
            $table->unsignedInteger('version')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};
