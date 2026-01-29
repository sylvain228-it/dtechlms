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
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            // Relation au cours
            $table->foreignId('course_id')
                ->constrained('courses')
                ->cascadeOnDelete();

            // Informations générales
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->text('syllabus')->nullable();

            // Organisation pédagogique
            $table->unsignedInteger('order');
            $table->integer('estimated_hours')->nullable();
            $table->integer('estimated_days')->nullable();

            // Typologie pédagogique
            $table->enum('module_type', [
                'core',        // cœur du parcours
                'elective',    // optionnel
                'remedial',    // mise à niveau
                'advanced',    // approfondissement
                'capstone'     // projet final
            ])->default('core');

            // Modalités
            $table->enum('modality', [
                'onsite',
                'online',
                'hybrid',
                'asynchronous'
            ])->default('hybrid');


            // Approche pédagogique
            $table->boolean('is_competency_based')->default(true);
            $table->boolean('is_certifying')->default(false);
            $table->boolean('is_mandatory')->default(true);

            // Évaluation globale du module
            $table->boolean('has_evaluation')->default(true);
            $table->decimal('evaluation_weight', 5, 2)->nullable();
            // % dans la note finale du cours

            // Statut de vie
            $table->enum('status', [
                'draft',
                'review',
                'published',
                'archived'
            ])->default('draft');

            // Versioning pédagogique
            $table->unsignedInteger('version')->default(1);
            $table->foreignId('parent_module_id')
                ->nullable()
                ->constrained('modules')
                ->nullOnDelete();

            // Métadonnées
            $table->string('language', 10)->default('fr');
            $table->boolean('is_visible')->default(true);

            // Publication
            $table->timestamp('published_at')->nullable();

            // Traçabilité
            $table->timestamps();
            $table->softDeletes();

            // Index
            $table->unique(['course_id', 'slug']);
            $table->index(['course_id', 'status']);
            $table->index('module_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
