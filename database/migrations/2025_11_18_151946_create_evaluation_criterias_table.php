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
        Schema::create('evaluation_criterias', function (Blueprint $table) {
            $table->id();
            // Relation à l’évaluation
            $table->foreignId('evaluation_id')
                ->constrained('evaluations')
                ->cascadeOnDelete();

            // Identification
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();

            // Lien facultatif avec compétence
            $table->foreignId('skill_id')
                ->nullable()
                ->constrained('skills')
                ->nullOnDelete();

            // Pondération et seuils
            $table->decimal('weight', 5, 2)->default(1); // proportion dans l’évaluation
            $table->decimal('max_score', 5, 2)->nullable();
            $table->decimal('success_threshold', 5, 2)->nullable(); // ex : 70%

            // Type de critère
            $table->enum('criterion_type', [
                'knowledge',
                'skill',
                'attitude',
                'transversal'
            ])->default('skill');

            // Rubrique d’évaluation avancée
            $table->text('performance_levels')->nullable();
            // ex : { "excellent":90, "good":75, "needs_improvement":50 }

            // Feedback
            $table->text('feedback_guidelines')->nullable();

            // Statut et versioning
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->unsignedInteger('version')->default(1);
            $table->foreignId('parent_criteria_id')
                ->nullable()
                ->constrained('evaluation_criterias')
                ->nullOnDelete();

            // Traçabilité
            $table->timestamps();
            $table->softDeletes();

            // Index et contraintes
            $table->unique(['evaluation_id', 'slug']);
            $table->index(['evaluation_id', 'skill_id']);
            $table->index('criterion_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_criterias');
    }
};
