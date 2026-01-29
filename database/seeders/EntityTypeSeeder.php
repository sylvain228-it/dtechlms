<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EntityTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $entityTypes = [
            'course',
            'module',
            'sequence',
            'activity',
            'skill',
        ];
        foreach ($entityTypes as $type) {
            DB::table('entity_types')->updateOrInsert(
                ['name' => ucfirst(str_replace('_', ' ', $type))]
            );
        }
    }
}
