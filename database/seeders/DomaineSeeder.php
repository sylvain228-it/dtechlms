<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DomaineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $domaines = [
            'Secrétariat & Bureautique',
            'Comptabilité, Finance & Microfinance',
            'Informatique & Technologies',
            'Infographie & Multimédia',
            'Développement Web & Mobile',
            'Marketing, Communication & Vente',
            'Gestion de Projet',
            'Ressources Humaines & Organisation',
            'Transport, Logistique & Transit',
            'Gestion des Stocks & Approvisionnements',
            'Santé & Métiers Médicaux',
            'Langues & Communication Bilingue',
            'Administration & Collectivités Locales',
            'Entrepreneuriat & Gestion des Coopératives',
            'Accueil & Relations Clients',
            'Stages Pratiques & Professionnels',
            'Auto-école & Conduite'
        ];

        foreach ($domaines as $domaine) {
            DB::table('domaines')->insert([
                'name'       => $domaine,
                'slug'       => Str::slug($domaine),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
