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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            // Relations
            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->foreignId('course_id')
                ->constrained('courses')
                ->cascadeOnDelete();

            $table->foreignId('activity_id')
                ->constrained('activities')
                ->cascadeOnDelete();

            $table->foreignId('evaluation_id')
                ->nullable()
                ->constrained('evaluations')
                ->nullOnDelete();

            // Contenu
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->json('submitted_files')->nullable(); // JSON contenant chemins / URLs
            $table->timestamp('submitted_at')->nullable();

            // Statut
            $table->enum('status', ['draft', 'submitted', 'graded', 'resubmitted'])->default('draft');
            $table->boolean('late_submission')->default(false);

            // Note et feedback
            $table->decimal('score', 5, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->json('feedback_details')->nullable();

            // Traçabilité
            $table->timestamps();
            $table->softDeletes();

            // Index
            $table->unique(['student_id', 'activity_id', 'evaluation_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
