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
        Schema::create('criterion_feedback_guidelines', function (Blueprint $table) {
            $table->id();

            $table->foreignId('evaluation_criteria_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('feedback_guideline_id')
                ->constrained()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criterion_feedback_guidelines');
    }
};
