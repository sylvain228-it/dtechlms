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
        Schema::create('student_activity_progres', function (Blueprint $table) {
            $table->id();
            // Relations
            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->foreignId('activity_id')
                ->constrained('activities')
                ->cascadeOnDelete();

            // Statut et progression
            $table->enum('status', ['not_started', 'in_progress', 'completed', 'skipped'])->default('not_started');
            $table->decimal('progress_percentage', 5, 2)->default(0.0);

            // Note / score partiel
            $table->decimal('score', 5, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->text('feedback_details')->nullable();

            // Dates
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            // Traçabilité
            $table->timestamps();

            // Contraintes
            $table->unique(['student_id', 'activity_id']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_activity_progres');
    }
};
