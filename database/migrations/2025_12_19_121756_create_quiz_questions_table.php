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
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')
                ->constrained('quizzes')
                ->cascadeOnDelete();

            // Contenu
            $table->text('question_text');
            $table->enum('question_type', [
                'single_choice',
                'multiple_choice',
                'true_false',
                'short_answer',
                'numeric',
                'ordering'
            ]);

            // Paramètres
            $table->decimal('points', 5, 2)->default(1);
            $table->integer('order')->default(0);
            $table->boolean('is_mandatory')->default(true);

            // Feedback
            $table->text('feedback_correct')->nullable();
            $table->text('feedback_incorrect')->nullable();

            // Lien compétence
            $table->foreignId('skill_id')
                ->nullable()
                ->constrained('skills')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
