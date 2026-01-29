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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('institut_id')->nullable()->constrained('instituts')->nullOnDelete();

            // Informations personnelles
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->text('bio')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['M', 'F', 'O'])->nullable();
            $table->string('phone_number')->nullable();
            $table->string('whatsapp_number', 50)->nullable();

            // Localisation
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('address')->nullable();

            // Informations académiques & pro
            $table->string('qualification')->nullable();
            $table->string('diplom')->nullable();
            $table->string('exp_year')->nullable(); // années d'expérience
            $table->json('specialties')->nullable(); // ex: ["Comptabilité", "Science", "IA"]
            $table->json('subjects_taught')->nullable();
            $table->enum('teaching_level', ['primary', 'middle', 'high', 'university', 'professional'])->nullable();
            $table->enum('contract_type', ['CDI', 'CDD', 'vacataire', 'freelance'])->nullable();
            $table->date('hire_date')->nullable();
            $table->date('end_contract_date')->nullable();
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->integer('workload')->nullable(); // heures/semaine
            $table->json('availability')->nullable(); // L-V 9h-18h

            // Compétences
            $table->json('skills')->nullable();
            $table->json('languages')->nullable();
            $table->json('certifications')->nullable();

            // Évaluation
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('reviews_count')->default(0);

            // Préférences d'enseignement
            $table->boolean('online_teaching')->default(false);
            $table->enum('classroom_preference', ['online', 'onsite', 'hybrid'])->default('onsite');

            // Documents
            $table->string('cv_path')->nullable();
            $table->string('cv_public_id')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->json('documents')->nullable(); // fichiers divers

            // Sécurité & admin
            $table->string('national_id')->nullable();
            $table->string('passport_number')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_number')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_changeable')->default(false);

            // Données système
            $table->string('profile_picture_url')->nullable();
            $table->string('profile_picture_public_id')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->enum('status', ['active', 'inactive', 'banned'])->default('inactive');
            $table->enum('type', ['internal', 'external'])->default('external');

            // Audit
            $table->json('updated_by_history')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
