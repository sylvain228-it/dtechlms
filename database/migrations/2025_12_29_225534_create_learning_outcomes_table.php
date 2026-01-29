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
        Schema::create('learning_outcomes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable();
            // ex : LO-C1, LO-M2, LO-S3 (utile pour référentiels)

            $table->text('description');
            // "À l'issue de…, l'apprenant sera capable de…"

            $table->enum('level', [
                'course',
                'module',
                'sequence',
                'activity'
            ]);

            $table->string('taxonomy')->nullable();
            // Bloom : remember, apply, analyze, create…

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_outcomes');
    }
};
