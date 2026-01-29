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
        Schema::create('prerequisite_groups', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type'); // course, module, sequence, activity
            $table->unsignedBigInteger('entity_id');

            // Comment les groupes sont combinés entre eux
            $table->enum('group_logic', ['AND', 'OR'])->default('AND');

            $table->timestamps();

            $table->index(['entity_type', 'entity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prerequisite_groups');
    }
};
