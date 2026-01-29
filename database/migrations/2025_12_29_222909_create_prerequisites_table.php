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
        Schema::create('prerequisites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prerequisite_group_id')
                ->constrained('prerequisite_groups')
                ->cascadeOnDelete();

            $table->enum('prerequisite_type', [
                'course',
                'module',
                'sequence',
                'activity',
                'skill',
                'experience',
                'submission',
                'custom'
            ]);

            $table->unsignedBigInteger('prerequisite_id')->nullable();

            $table->text('description')->nullable();

            $table->boolean('is_mandatory')->default(true);
            $table->unsignedSmallInteger('min_score')->nullable();
            $table->unsignedSmallInteger('min_attempts')->nullable();

            $table->timestamps();

            $table->index(['prerequisite_type', 'prerequisite_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prerequisites');
    }
};
