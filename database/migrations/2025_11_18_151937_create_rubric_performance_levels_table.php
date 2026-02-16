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
        Schema::create('rubric_performance_levels', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rubric_criteria_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('label');
            // Excellent, Bon, Moyen, Insuffisant

            $table->text('description')->nullable();
            // Description précise du niveau attendu

            $table->decimal('min_score', 5, 2)->nullable();
            $table->decimal('max_score', 5, 2)->nullable();
            // Optionnel si évaluation par plage

            $table->decimal('score_value', 5, 2)->nullable();
            // Si niveau = valeur fixe

            $table->boolean('is_passing')->default(true);

            $table->unsignedInteger('position')->default(0);

            $table->string('color')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rubric_performance_levels');
    }
};
