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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title', 300);
            $table->string('short_title', 150)->nullable();
            $table->string('slug', 300)->unique();
            $table->text('description')->nullable();
            $table->text('syllabus')->nullable();

            $table->foreignId('domaine_id')->default(1)->constrained('domaines')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->foreignId('institut_id')->nullable()->constrained('instituts')->nullOnDelete();

            $table->enum('status', ['draft', 'review', 'published', 'archived'])->default('draft');

            $table->enum('course_type', [
                'professional',
                'university',
                'modular',
            ])->default('professional');
            $table->enum('modality', [
                'online',
                'onsite',
                'hybrid',
                'asynchronous'
            ])->default('hybrid');
            $table->enum('level', ['all_level', 'beginner', 'intermediate', 'advanced', 'expert'])->default('beginner');

            // Métadonnées pédagogiques
            $table->string('language', 10)->default('fr');
            $table->string('academic_year')->nullable();    // ex : 2025-2026

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            // Charge et organisation
            $table->integer('duration_minutes')->nullable();
            $table->integer('total_hours')->nullable();
            $table->integer('estimated_days')->nullable();
            $table->integer('estimated_weeks')->nullable();
            $table->integer('estimated_months')->nullable();

            // Modalités pédagogiques
            $table->boolean('is_modular')->default(true);
            $table->boolean('is_certifying')->default(false);
            $table->text('certification_details')->nullable();
            $table->boolean('is_competency_based')->default(true);

            // Versioning pédagogique
            $table->unsignedInteger('version')->default(1);
            $table->foreignId('parent_course_id')
                ->nullable()
                ->constrained('courses')
                ->nullOnDelete();

            $table->string('cover_url')->nullable();
            $table->string('cover_public_id')->nullable();

            // scolarité
            $table->decimal('price', 8, 2)->default(0.00);

            $table->boolean('is_free')->default(false);

            $table->integer('nb_modules')->default(0);
            $table->integer('nb_sequences')->default(0);
            $table->integer('nb_of_enrollments')->default(0);

            $table->date('published_at')->nullable();
            $table->date('updated_course_at')->nullable();
            $table->date('archived_at')->nullable();

            $table->text('keywords')->nullable();

            $table->index(['teacher_id', 'status']);
            $table->index('course_type');
            $table->boolean('is_pinned')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
