<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventCalendar extends Model
{
    public function eventable()
    {
        return $this->morphTo();
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function creator()
    {
        return $this->belongsTo(Teacher::class, 'created_by');
    }

    protected $fillable = [
        'title',
        'description',

        'event_type',

        // Polymorphique
        'eventable_id',
        'eventable_type',

        // Dates
        'start_at',
        'end_at',
        'duration_minutes',

        // Mode
        'is_synchronous',

        // Lieu / plateforme
        'modality',
        'location',
        'conference_platform',
        'conference_url',
        'conference_meeting_id',
        'conference_passcode',

        // Visibilité
        'visibility',

        // Contexte pédagogique
        'course_id',

        // Créateur
        'teacher_id',

        // Statut
        'status',

        // UI
        'color',

        // Métadonnées
        'metadata',
    ];

    protected $casts = [
        'start_at'        => 'datetime',
        'end_at'          => 'datetime',
        'is_synchronous'  => 'boolean',
        'metadata'        => 'array',
    ];
}
