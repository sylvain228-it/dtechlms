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
            // Activité évaluée
            $table->foreignId('activity_id')
                ->constrained()
                ->cascadeOnDelete();

            // Lien vers compétence pédagogique
            $table->foreignId('skill_id')
                ->nullable()
                ->constrained('skills')
                ->nullOnDelete();


            /*
    |--------------------------------------------------------------------------
    | Identification
    |--------------------------------------------------------------------------
    */

            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();

            $table->unsignedInteger('position')->default(0);
            // Ordre d'affichage dans l'activité


            /*
    |--------------------------------------------------------------------------
    | Logique de notation
    |--------------------------------------------------------------------------
    */

            $table->decimal('weight', 6, 3)->default(1);
            // Importance relative dans le calcul global

            $table->decimal('max_score', 6, 2)->nullable();
            // Si évaluation par points directs

            $table->decimal('success_threshold', 6, 2)->nullable();
            // Score minimal pour valider ce critère

            $table->boolean('is_mandatory')->default(false);
            // Si true → échec de l'activité si non validé


            /*
    |--------------------------------------------------------------------------
    | Type pédagogique
    |--------------------------------------------------------------------------
    */

            $table->enum('criterion_type', [
                'knowledge',
                'skill',
                'attitude',
                'transversal'
            ])->default('skill');


            /*
    |--------------------------------------------------------------------------
    | Méthode d’évaluation
    |--------------------------------------------------------------------------
    */

            $table->enum('evaluation_method', [
                'points',      // notation directe (score numérique)
                'rubric',      // via rubric_performance_levels
                'pass_fail'    // validation simple
            ])->default('points');


            /*
    |--------------------------------------------------------------------------
    | Versioning & cycle de vie
    |--------------------------------------------------------------------------
    */

            $table->enum('status', [
                'draft',
                'published',
                'archived'
            ])->default('draft');

            $table->unsignedInteger('version')->default(1);

            $table->foreignId('parent_criteria_id')
                ->nullable()
                ->constrained('evaluation_criterias')
                ->nullOnDelete();


            /*
    |--------------------------------------------------------------------------
    | Traçabilité
    |--------------------------------------------------------------------------
    */

            $table->timestamps();
            $table->softDeletes();


            /*
    |--------------------------------------------------------------------------
    | Index & contraintes
    |--------------------------------------------------------------------------
    */

            $table->unique(['activity_id', 'slug']);
            $table->index(['activity_id', 'skill_id']);
            $table->index('criterion_type');
            $table->index('status');
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
