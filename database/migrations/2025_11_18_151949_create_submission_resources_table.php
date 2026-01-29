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
        Schema::create('submission_resources', function (Blueprint $table) {
            $table->id();
            // Relations
            $table->foreignId('submission_id')
                ->constrained('submissions')
                ->cascadeOnDelete();

            $table->foreignId('resource_id')
                ->constrained('resources')
                ->cascadeOnDelete();

            // Rôle / utilisation
            $table->enum('role', ['support', 'main', 'reference'])->default('support');
            $table->boolean('is_mandatory')->default(false);
            $table->boolean('is_visible')->default(true);

            // Traçabilité
            $table->timestamps();

            // Contraintes
            $table->unique(['submission_id', 'resource_id']);
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_resources');
    }
};
