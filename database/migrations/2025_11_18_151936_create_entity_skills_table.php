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
        Schema::create('entity_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skill_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id');
            $table->nullableMorphs('entityskilltable');
            $table->enum('target_level', [
                'initiation',
                'intermediate',
                'mastery',
                'expert'
            ])->nullable();
            $table->enum('role', [
                'introduced',     // découverte
                'practiced',      // entraînement
                'reinforced',     // consolidation
                'assessed'        // évaluée
            ])->nullable();

            // Contribution du module
            $table->decimal('contribution_weight', 5, 2)->nullable();
            // % de la compétence travaillé dans ce module

            // Critères & indicateurs
            $table->foreignId('criteria_id')->nullable()->constrained('evaluation_criterias')->nullOnDelete();
            // ex : respect des normes, autonomie, qualité technique

            $table->text('performance_indicators')->nullable();
            // indicateurs observables

            // Seuils de réussite
            $table->decimal('success_threshold', 5, 2)->nullable();
            // ex : 70 %
            // Évaluation
            $table->boolean('is_evaluated')->default(true);
            $table->boolean('is_primary')->default(false);

            // Feedback pédagogique
            $table->text('pedagogical_note')->nullable();
            $table->json('feedback_guidelines')->nullable();

            // Gouvernance
            $table->boolean('is_mandatory')->default(true);
            $table->timestamps();
            // Contraintes
            $table->unique(['skill_id', 'entity_type', 'entity_id'], 'entity_skill_unique');
            $table->index(['entity_type', 'entity_id'], 'entity_skill_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entity_skills');
    }
};
