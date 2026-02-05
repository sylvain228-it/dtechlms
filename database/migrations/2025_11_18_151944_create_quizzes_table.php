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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('parent_course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            // Identification
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->text('quize_instructions')->nullable();

            // Paramètres pédagogiques
            $table->enum('quiz_type', ['diagnostic', 'formative', 'summative'])->default('formative');
            $table->integer('time_limit_minutes')->nullable();
            $table->integer('max_attempts')->default(1);
            // Comportement
            $table->boolean('shuffle_questions')->default(true);
            $table->boolean('shuffle_answers')->default(true);
            $table->boolean('show_results_immediately')->default(true);
            $table->boolean('show_correct_answers')->default(false);

            // Scoring
            $table->decimal('max_score', 5, 2)->nullable();
            $table->decimal('success_threshold', 5, 2)->nullable();

            // Publication
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();

            // Versioning
            $table->unsignedInteger('version')->default(1);

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
