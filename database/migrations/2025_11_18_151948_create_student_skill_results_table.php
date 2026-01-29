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
        Schema::create('student_skill_results', function (Blueprint $table) {
            $table->id();
            // Relations
            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->foreignId('skill_id')
                ->constrained('skills')
                ->cascadeOnDelete();

            $table->foreignId('course_id')
                ->nullable()
                ->constrained('courses')
                ->nullOnDelete();

            // Résultat
            $table->enum('achieved_level', ['initiation', 'intermediate', 'mastery', 'expert'])->nullable();
            $table->decimal('progress_percentage', 5, 2)->default(0.0);
            $table->text('evidence')->nullable(); // submissions, badges, portfolio

            // Traçabilité
            $table->timestamps();

            // Index
            $table->unique(['student_id', 'skill_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_skill_results');
    }
};
