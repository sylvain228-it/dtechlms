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
        Schema::create('diplomas', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image_url')->nullable(); // logo ou icône du diplôme
            $table->string('image_url_public_id')->nullable(); //

            $table->decimal('min_score', 5, 2)->nullable(); // score global minimum
            $table->integer('validity_days')->nullable(); // durée de validité

            // Catégorie / type
            $table->enum('diploma_type', ['course_based', 'module_based', 'skill_based', 'external'])->default('skill_based');

            // Visibilité et publication
            $table->boolean('is_visible')->default(true);
            $table->timestamp('published_at')->nullable();

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
        Schema::dropIfExists('diplomas');
    }
};
