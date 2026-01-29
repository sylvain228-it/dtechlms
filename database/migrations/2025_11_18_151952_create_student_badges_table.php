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
        Schema::create('student_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->foreignId('badge_id')
                ->constrained('badges')
                ->cascadeOnDelete();

            $table->dateTime('awarded_at')->nullable();
            $table->boolean('is_visible')->default(true);

            // Traçabilité
            $table->timestamps();

            // Contraintes
            $table->unique(['student_id', 'badge_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_badges');
    }
};
