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
        Schema::create('submission_uploads', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->foreignId('requirement_id')->constrained('deliverable_requirements')->cascadeOnDelete();
            $table->foreignId('submission_id')->constrained('submissions')->cascadeOnDelete();
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size');
            $table->string('file_ext');
            $table->string('url')->nullable();       // lien externe
            $table->string('url_public_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_uploads');
    }
};
