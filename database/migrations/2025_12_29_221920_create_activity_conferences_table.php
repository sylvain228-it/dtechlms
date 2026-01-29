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
        Schema::create('activity_conferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('conference_platform'); // e.g., Zoom, Teams, Google Meet
            $table->string('meeting_link');
            $table->dateTime('scheduled_at');
            $table->integer('duration_minutes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_conferences');
    }
};
