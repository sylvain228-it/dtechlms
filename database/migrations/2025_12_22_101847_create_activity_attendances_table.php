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
        Schema::create('activity_attendances', function (Blueprint $table) {
            $table->id();
            // Relations
            $table->foreignId('activity_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('course_id')
                ->constrained('courses')
                ->cascadeOnDelete();

            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            // Statut de présence
            $table->enum('status', [
                'present',
                'absent',
                'late',
                'excused'
            ])->default('absent');

            // Horodatage réel
            $table->dateTime('joined_at')->nullable();
            $table->dateTime('left_at')->nullable();

            // Temps réel de présence (calculé ou stocké)
            $table->integer('attendance_duration_minutes')->nullable();

            // Mode de pointage
            $table->enum('attendance_mode', [
                'automatic',   // via API Zoom / Teams
                'manual',      // émargement enseignant
                'self_checkin' // émargement apprenant
            ])->default('manual');

            // Validation
            $table->boolean('validated')->default(false);
            $table->foreignId('validated_by')
                ->nullable()
                ->constrained('teachers')
                ->nullOnDelete();

            // Justification absence
            $table->text('justification')->nullable();
            $table->string('justification_document')->nullable();

            // Métadonnées
            $table->text('metadata')->nullable();

            $table->timestamps();

            // Un apprenant = une ligne par activité
            $table->unique(['activity_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_attendances');
    }
};
