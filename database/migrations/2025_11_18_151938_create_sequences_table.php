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
        Schema::create('sequences', function (Blueprint $table) {
            $table->id();
            // Relation module
            $table->foreignId('module_id')
                ->constrained('modules')
                ->cascadeOnDelete();
            $table->foreignId('parent_course_id')
                ->constrained('courses')
                ->cascadeOnDelete();

            // Identification
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();

            // Objectifs pédagogiques
            $table->text('syllabus')->nullable();

            // Typologie pédagogique
            $table->enum('sequence_type', [
                'discovery',      // découverte
                'practice',       // application
                'integration',    // intégration
                'assessment',     // évaluation
                'remediation',    // remédiation
                'project'
            ])->default('discovery');

            // Organisation temporelle
            $table->unsignedInteger('order');
            $table->integer('estimated_hours')->nullable();
            $table->integer('estimated_days')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            // Modalités pédagogiques
            $table->enum('modality', [
                'onsite',
                'online',
                'hybrid',
                'asynchronous'
            ])->default('hybrid');

            // Approche pédagogique
            $table->text('learning_activities_summary')->nullable();

            // Évaluation
            $table->boolean('has_assessment')->default(false);
            $table->decimal('assessment_weight', 5, 2)->nullable();
            // poids dans le module

            // Visibilité & statut
            $table->enum('status', [
                'draft',
                'published',
                'archived'
            ])->default('draft');

            $table->boolean('is_mandatory')->default(true);
            $table->boolean('is_visible')->default(true);

            // Versioning pédagogique
            $table->unsignedInteger('version')->default(1);
            $table->foreignId('parent_sequence_id')
                ->nullable()
                ->constrained('sequences')
                ->nullOnDelete();

            // Métadonnées
            $table->string('language', 10)->default('fr');

            // Publication
            $table->timestamp('published_at')->nullable();

            // Traçabilité
            $table->timestamps();
            $table->softDeletes();

            // Contraintes & index
            $table->unique(['module_id', 'slug']);
            $table->index(['module_id', 'order']);
            $table->index(['module_id', 'status']);
            $table->index('sequence_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sequences');
    }
};
