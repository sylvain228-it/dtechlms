<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
        'user_id',
        'institut_id',

        // Informations personnelles
        'first_name',
        'last_name',
        'email',
        'bio',
        'birth_date',
        'gender',
        'phone_number',
        'whatsapp_number',

        // Localisation
        'country',
        'city',
        'address',

        // Infos académiques & pro
        'qualification',
        'diplom',
        'exp_year',
        'specialties',
        'subjects_taught',
        'teaching_level',
        'contract_type',
        'hire_date',
        'end_contract_date',
        'hourly_rate',
        'workload',
        'availability',

        // Compétences
        'skills',
        'languages',
        'certifications',

        // Évaluation
        'rating',
        'reviews_count',

        // Préférences d'enseignement
        'online_teaching',
        'classroom_preference',

        // Documents
        'cv_path',
        'cv_public_id',
        'portfolio_url',
        'documents',

        // Sécurité & admin
        'national_id',
        'passport_number',
        'emergency_contact_name',
        'emergency_contact_phone',
        'bank_name',
        'bank_number',
        'is_active',
        'is_verified',
        'is_changeable',

        // Données système
        'profile_picture_url',
        'profile_picture_public_id',
        'last_login_at',
        'status',

        // Audit
        'updated_by_history',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}
