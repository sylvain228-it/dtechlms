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
        Schema::create('assessment_strategies', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['quiz', 'project', 'exam']); // quiz, project, exam
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('grading_method', ['auto', 'manual', 'peer'])->nullable();
            $table->boolean('is_certifying')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_strategies');
    }
};
