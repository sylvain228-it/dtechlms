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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            // Relation séquence

            $table->foreignId('parent_course_id')->constrained('courses')->cascadeOnDelete();

            $table->enum('scope', ['course', 'module', 'sequence'])->default('sequence');
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->foreignId('module_id')->nullable()->constrained('modules')->nullOnDelete();
            $table->foreignId('sequence_id')->nullable()->constrained('sequences')->nullOnDelete();

            // Identification
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();

            // Typologie d’activité
            $table->enum('activity_type', [
                'lecture',
                'quiz',
                'exercise',
                'practical_work',
                'case_study',
                'project',
                'simulation',
                'challenge',
                'discussion',
                'assessment'
            ])->default('lecture');

            // Consignes pédagogiques
            $table->longText('instructions')->nullable();
            $table->json('steps')->nullable();              // étapes guidées
            $table->json('expected_outcomes')->nullable(); // résultats attendus

            // Organisation
            $table->unsignedInteger('order');
            $table->integer('estimated_minutes')->nullable();

            // Modalités
            $table->enum('modality', [
                'onsite',
                'online',
                'hybrid',
                'asynchronous'
            ])->default('hybrid');

            $table->boolean('is_individual')->default(true);
            $table->boolean('is_collaborative')->default(false);
            $table->unsignedInteger('max_group_size')->nullable();

            // Livrables
            $table->boolean('has_deliverable')->default(false);
            $table->enum('deliverable_type', ['file', 'link', 'github_repo_link', 'video', 'audio', 'text'])->nullable(); // fichier, lien, dépôt git
            $table->text('deliverable_requirements')->nullable();
            $table->timestamp('deliverable_deadline')->nullable();

            // Évaluation
            $table->boolean('is_evaluated')->default(false);
            $table->enum('evaluation_type', [
                'formative',
                'summative',
                'certifying'
            ])->nullable();

            $table->decimal('evaluation_weight', 5, 2)->nullable();
            $table->enum('note_unit', ['%', 'pt'])->nullable();

            $table->enum('evaluation_mode', [
                'single',
                'mixed',
            ])->default('single');

            // Pédagogie avancée
            $table->text('resources_summary')->nullable();

            // Feedback et accompagnement
            $table->boolean('requires_feedback')->default(false);
            $table->boolean('allows_resubmission')->default(false);
            $table->unsignedInteger('max_attempts')->default(1);

            $table->boolean('is_synchronous')->default(false);

            // Planification
            $table->dateTime('start_at')->nullable();
            $table->integer('duration_minutes')->nullable();

            // Visioconférence
            $table->string('conference_platform')->nullable(); // zoom, teams, meet
            $table->string('conference_url')->nullable();
            $table->string('conference_meeting_id')->nullable();
            $table->string('conference_passcode')->nullable();

            // Gestion présence
            $table->boolean('attendance_required')->default(false);

            // États
            $table->enum('status', [
                'draft',
                'scheduled',
                'live',
                'completed',
                'cancelled'
            ])->default('draft');

            $table->enum('activity_status', [
                'scheduled',
                'live',
                'completed',
                'cancelled'
            ])->default('scheduled');

            $table->boolean('is_mandatory')->default(true);
            $table->boolean('is_visible')->default(true);

            // Versioning pédagogique
            $table->unsignedInteger('version')->default(1);
            $table->foreignId('parent_activity_id')
                ->nullable()
                ->constrained('activities')
                ->nullOnDelete();

            // Métadonnées
            $table->string('language', 10)->default('fr');

            // Publication
            $table->timestamp('published_at')->nullable();

            // Traçabilité
            $table->timestamps();
            $table->softDeletes();

            // Contraintes & index
            $table->unique(['sequence_id', 'slug']);
            $table->index(['sequence_id', 'order']);
            $table->index(['sequence_id', 'status']);
            $table->index('activity_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
