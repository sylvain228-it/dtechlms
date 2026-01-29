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
        Schema::create('student_sequence_progres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->foreignId('sequence_id')
                ->constrained('sequences')
                ->cascadeOnDelete();

            // Statut et progression
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->decimal('progress_percentage', 5, 2)->default(0.0);

            // Score et compétences
            $table->decimal('score', 5, 2)->nullable();
            $table->json('skills_results')->nullable();
            // ex : {"competence_id": "achieved_level"}

            // Traçabilité
            $table->timestamps();

            // Contraintes
            $table->unique(['student_id', 'sequence_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_sequence_progres');
    }
};
