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
        Schema::create('entity_teaching_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teaching_method_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('entity_type');
            $table->unsignedInteger('entity_id');
            $table->timestamps();
            $table->nullableMorphs('entitytable');
            $table->index(['entity_type', 'entity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entity_teaching_methods');
    }
};
