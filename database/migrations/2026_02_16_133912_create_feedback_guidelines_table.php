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
        Schema::create('feedback_guidelines', function (Blueprint $table) {
            $table->id();

            $table->string('title');

            $table->text('content');
            // Texte complet de la guideline

            $table->enum('type', [
                'positive',
                'improvement',
                'warning',
                'general'
            ])->default('general');

            $table->enum('criterion_type', [
                'knowledge',
                'skill',
                'attitude',
                'transversal'
            ])->nullable();
            // Pour lier à un type pédagogique

            $table->unsignedInteger('version')->default(1);

            $table->foreignId('parent_feedback_guideline_id')
                ->nullable()
                ->constrained('feedback_guidelines')
                ->nullOnDelete();

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback_guidelines');
    }
};
