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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nom du groupe
            $table->text('description')->nullable();

            $table->foreignId('course_id')->nullable()->constrained('courses')->cascadeOnDelete(); // Groupe rattaché au cours
            $table->foreignId('activity_id')->nullable()->constrained('activities')->cascadeOnDelete(); // ou à une activité spécifique
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete(); // ou à une activité spécifique

            $table->unsignedInteger('max_members')->nullable(); // Taille maximale
            $table->boolean('is_active')->default(true);
            $table->timestamp('join_deadline')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
