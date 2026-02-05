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
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('parent_course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();

            // Identification
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();




            // Sécurité / contrôle

            // Statut et versioning
            $table->enum('status', [
                'draft',
                'scheduled',
                'open',
                'closed',
                'corrected',
                'archived',
            ])->default('draft');


            $table->unsignedInteger('version')->default(1);
            $table->foreignId('parent_evaluation_id')
                ->nullable()
                ->constrained('evaluations')
                ->nullOnDelete();

            // Métadonnées
            $table->string('language', 10)->default('fr');
            $table->timestamp('published_at')->nullable();

            // Traçabilité
            $table->timestamps();
            $table->softDeletes();

            // Index
            $table->unique(['slug']);
            $table->index(['evaluation_type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
