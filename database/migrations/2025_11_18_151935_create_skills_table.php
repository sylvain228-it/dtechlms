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
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            // Identification
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();

            // Structuration
            $table->foreignId('domaine_id')->nullable()->constrained('domaines')->nullOnDelete();       // ex: Développement web
            $table->foreignId('sub_domaine_id')->nullable()->constrained('domaines')->nullOnDelete();       // ex: Développement web
            $table->enum('type', [
                'technical',
                'methodological',
                'behavioral',
                'transversal'
            ])->default('technical');

            // Niveau et cadre
            $table->unsignedTinyInteger('level_min')->nullable(); // ex EQF
            $table->unsignedTinyInteger('level_max')->nullable();
            $table->string('framework')->nullable(); // EQF, RNCP, interne

            // // Approche pédagogique
            // $table->json('learning_outcomes')->nullable();
            // $table->json('indicators')->nullable();    // indicateurs observables
            // $table->json('contexts')->nullable();      // situations pro

            // Gouvernance
            $table->boolean('is_active')->default(true);
            $table->boolean('is_certifiable')->default(false);

            // Versioning
            $table->unsignedInteger('version')->default(1);
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('skills')
                ->nullOnDelete();

            // Métadonnées
            $table->string('language', 10)->default('fr');
            $table->string('source')->nullable(); // organisme, référentiel

            // Traçabilité
            $table->timestamps();
            $table->softDeletes();

            // Index
            $table->index(['domain', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
