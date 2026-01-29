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
        Schema::create('resources', function (Blueprint $table) {
            $table->id();

            // Identification
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();

            // Typologie de ressource
            $table->enum('resource_type', [
                'video',
                'document',
                'link',
                'tool',
                'dataset',
                'audio',
                'image',
                'slide',
                'external_activity',
                'other'
            ])->default('document');

            // Support technique
            $table->enum('storage_type', [
                'local',
                's3',
                'cloudinary',
                'external'
            ])->default('local');

            $table->string('file_path')->nullable(); // local / s3
            $table->string('url')->nullable();       // lien externe
            $table->string('url_public_id')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('file_ext')->nullable();
            $table->unsignedBigInteger('file_size')->nullable(); // en octets
            $table->integer('duration_seconds')->nullable();    // vidéos / audio

            // Accessibilité pédagogique
            $table->string('language', 10)->default('fr');
            $table->boolean('has_subtitles')->default(false);
            $table->boolean('has_transcript')->default(false);
            $table->string('accessibility_level')->nullable(); // WCAG, etc.

            // Usage pédagogique
            $table->enum('pedagogical_role', [
                'core',
                'support',
                'extension',
                'reference'
            ])->default('support');

            $table->boolean('is_mandatory')->default(false);
            $table->boolean('is_downloadable')->default(true);

            // Métadonnées pédagogiques
            $table->text('learning_objectives')->nullable();
            $table->text('keywords')->nullable();
            $table->text('tags')->nullable();

            // Droits & licences
            $table->string('author')->nullable();
            $table->string('source')->nullable();
            $table->string('license')->nullable(); // CC, propriétaire, etc.
            $table->string('notes')->nullable();
            $table->text('access_instructions')->nullable();
            $table->string('attribution')->nullable();

            // Statut & gouvernance
            $table->enum('status', [
                'draft',
                'published',
                'archived'
            ])->default('draft');

            $table->boolean('is_visible')->default(true);

            // Versioning
            $table->unsignedInteger('version')->default(1);
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('resources')
                ->nullOnDelete();

            // Publication
            $table->timestamp('published_at')->nullable();

            // Traçabilité
            $table->timestamps();
            $table->softDeletes();

            // Index & contraintes
            $table->unique('slug');
            $table->index('resource_type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
