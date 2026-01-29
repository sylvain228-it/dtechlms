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
        Schema::create('entity_assessment_stgs', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type');
            $table->unsignedInteger('entity_id');
            $table->foreignId('assessment_strategy_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->nullableMorphs('entitytable');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entity_assessment_stgs');
    }
};
