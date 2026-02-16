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
        Schema::create('grading_scale_ranges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grading_scale_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('letter', 2);
            // A, B+, C, etc.

            $table->decimal('min_score', 5, 2);
            $table->decimal('max_score', 5, 2);

            $table->decimal('gpa_value', 3, 2)->nullable();

            $table->string('mention')->nullable();
            // Ex: Excellent, Bien, Passable

            $table->string('color')->nullable();

            $table->unsignedInteger('position')->default(0);
            // Ordre d'affichage

            $table->timestamps();

            $table->unique(['grading_scale_id', 'letter']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grading_scale_ranges');
    }
};
