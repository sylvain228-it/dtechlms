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
        Schema::create('event_calendars', function (Blueprint $table) {
            $table->id();

            // Titre & description
            $table->string('title');
            $table->text('description')->nullable();

            // Type d'événement
            $table->enum('event_type', [
                'general',
                'course',
                'module',
                'sequence',
                'activity',
                'evaluation',
                'quiz',
                'conference',
                'meeting',
                'exam',
                'custom'
            ]);

            // Liaison polymorphique (activité, évaluation, quiz…)
            $table->nullableMorphs('eventable');
            // eventable_type, eventable_id

            // Dates
            $table->dateTime('start_at');
            $table->dateTime('end_at')->nullable();
            $table->integer('duration_minutes')->nullable();

            // Mode
            $table->enum('modality', [
                'onsite',
                'online',
                'hybrid',
            ])->default('hybrid');

            $table->string('location')->nullable(); // Salle, Campus, URL
            $table->string('conference_platform')->nullable(); // zoom, teams…
            $table->string('conference_url')->nullable();
            $table->string('conference_meeting_id')->nullable();
            $table->string('conference_passcode')->nullable();

            // Visibilité
            $table->enum('visibility', [
                'public',
                'course',
                'module',
                'private'
            ])->default('course');

            // Contexte pédagogique
            $table->foreignId('course_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('module_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Créateur
            $table->foreignId('teacher_id')
                ->constrained('teachers')
                ->cascadeOnDelete();

            // Statut
            $table->enum('status', [
                'scheduled',
                'live',
                'completed',
                'cancelled'
            ])->default('scheduled');

            // Couleur calendrier (UI)
            $table->string('color')->nullable();

            // Métadonnées (timezone, règles, etc.)
            $table->text('metadata')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_calendars');
    }
};
