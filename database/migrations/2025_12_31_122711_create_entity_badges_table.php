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
        Schema::create('entity_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('badge_id')
                ->constrained('badges')
                ->cascadeOnDelete();
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id');
            $table->nullableMorphs('entitytable');
            $table->enum('role', ['award', 'requirement'])->default('award');
            $table->boolean('is_mandatory')->default(false);
            $table->timestamps();
            $table->unique(['badge_id', 'entity_type', 'entity_id']);
            $table->index(['entity_type', 'entity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entity_badges');
    }
};
