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
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('parent_course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();

            $table->foreignId('quiz_id')
                ->nullable()
                ->constrained('quizzes')
                ->nullOnDelete();
            // Identification
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();

            // Typologie
            $table->enum('evaluation_type', [
                'formative',
                'summative',
                'certifying'
            ])->default('formative');

            // Organisation
            $table->decimal('weight', 5, 2)->nullable(); // contribution à la note finale
            $table->unsignedInteger('max_score')->nullable(); // score maximum
            $table->integer('duration_minutes')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->boolean('is_mandatory')->default(true);

            // Ressources et support
            $table->text('allowed_tools')->nullable(); // ex : calculatrice, IDE, plateforme
            $table->text('resources_summary')->nullable();

            // Feedback
            $table->boolean('provides_feedback')->default(true);
            $table->text('feedback_instructions')->nullable();

            // Évaluation avancée
            $table->boolean('is_group')->default(false);
            $table->unsignedInteger('max_group_size')->nullable();
            $table->boolean('allows_resubmission')->default(false);
            $table->unsignedInteger('max_attempts')->nullable();


            $table->enum('deliverable_type', ['file', 'link', 'github_repo_link', 'video', 'audio', 'text'])->nullable(); // fichier, lien, dépôt git
            $table->enum('note_unit', ['%', 'pt'])->nullable();

            // Fenêtre temporelle
            $table->dateTime('start_at')->nullable();
            $table->dateTime('end_at')->nullable();

            // OU durée contrôlée

            // Règles d'accès
            $table->boolean('is_synchronous')->default(false);
            $table->boolean('allow_late_submission')->default(false);
            $table->integer('late_penalty_percentage')->nullable();

            // Sécurité / contrôle
            $table->boolean('lock_after_end')->default(true);
            $table->boolean('shuffle_questions')->default(true);

            // Statut et versioning
            $table->enum('status', [
                'draft',
                'scheduled',
                'open',
                'closed',
                'corrected',
                'archived',
            ])->default('draft');


            $table->unsignedInteger('version')->default(1);
            $table->foreignId('parent_evaluation_id')
                ->nullable()
                ->constrained('evaluations')
                ->nullOnDelete();

            // Métadonnées
            $table->string('language', 10)->default('fr');
            $table->timestamp('published_at')->nullable();

            // Traçabilité
            $table->timestamps();
            $table->softDeletes();

            // Index
            $table->unique(['slug']);
            $table->index(['evaluation_type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
