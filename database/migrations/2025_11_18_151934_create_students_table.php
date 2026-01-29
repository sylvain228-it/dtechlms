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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            // Relations
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('institut_id')->nullable()->constrained('instituts')->nullOnDelete();
            // Informations personnelles
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['M', 'F', 'O'])->nullable();
            $table->string('phone_number')->nullable();
            $table->string('whatsapp_number')->nullable();

            $table->string('profile_picture_url')->nullable();
            $table->string('profile_picture_public_id')->nullable();

            // Localisation
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('current_level')->nullable();

            // Informations académiques
            $table->string('student_code')->unique()->nullable(); // Matricule étudiant

            // Système & activité
            $table->boolean('is_active')->default(true);
            $table->integer('credits')->default(0); // pour les systèmes "ECTS / points"

            // Famille / contacts d’urgence
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('guardian_email')->nullable();

            // Santé (optionnel)
            $table->string('medical_info')->nullable(); // ex : allergies (si nécessaire juridiquement)

            // Sécurité administrative
            $table->string('national_id')->nullable();
            $table->boolean('is_verified')->default(false);

            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
