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
        Schema::create('learning_dependencies', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type');
            $table->unsignedInteger('entity_id');

            $table->string('depends_on_type'); // module, sequence, activity
            $table->unsignedBigInteger('depends_on_id');

            $table->enum('dependency_type', [
                'required',     // bloque (rare)
                'recommended',  // conseillé
                'suggested'     // purement pédagogique
            ])->default('recommended');

            $table->unsignedInteger('dependency_id');
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
        Schema::dropIfExists('learning_dependencies');
    }
};
