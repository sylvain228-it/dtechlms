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
        Schema::create('entity_learn_outs', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type');
            $table->unsignedInteger('entity_id');
            $table->foreignId('learning_outcome_id')
                ->constrained()
                ->cascadeOnDelete();

            // Importance relative
            $table->boolean('is_primary')->default(false);
            $table->nullableMorphs('entitytable');

            $table->timestamps();

            $table->index(['entity_type', 'entity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entity_learn_outs');
    }
};
