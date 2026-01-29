<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evaluation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        // Relations
        'activity_id',
        'quiz_id',
        'parent_course_id',

        // Identification
        'title',
        'slug',
        'description',

        // Typologie
        'evaluation_type',

        // Organisation
        'weight',
        'max_score',
        'duration_minutes',
        'scheduled_at',
        'is_mandatory',

        // Ressources
        'allowed_tools',
        'resources_summary',

        'deliverable_type',

        // Feedback
        'provides_feedback',
        'feedback_instructions',

        // Avancé
        'is_group',
        'max_group_size',
        'allows_resubmission',
        'max_attempts',

        // Fenêtre temporelle
        'start_at',
        'end_at',

        // Accès
        'is_synchronous',
        'allow_late_submission',
        'late_penalty_percentage',

        // Sécurité
        'lock_after_end',
        'shuffle_questions',
        'note_unit',
        // Statut & version
        'status',
        'version',
        'parent_evaluation_id',

        // Métadonnées
        'language',
        'published_at',
    ];
    protected $casts = [
        // Organisation
        'weight' => 'decimal:2',
        'max_score' => 'integer',
        'duration_minutes' => 'integer',
        'scheduled_at' => 'datetime',
        'is_mandatory' => 'boolean',

        // Feedback
        'provides_feedback' => 'boolean',

        // Avancé
        'is_group' => 'boolean',
        'max_group_size' => 'integer',
        'allows_resubmission' => 'boolean',
        'max_attempts' => 'integer',

        'deliverable_type',

        // Fenêtre temporelle
        'start_at' => 'datetime',
        'end_at' => 'datetime',

        // Visioconférence
        'conference_platform',
        'conference_url',
        'conference_meeting_id',
        'conference_passcode',

        // Accès
        'is_synchronous' => 'boolean',
        'allow_late_submission' => 'boolean',
        'late_penalty_percentage' => 'integer',

        // Sécurité
        'lock_after_end' => 'boolean',
        'shuffle_questions' => 'boolean',

        // Métadonnées
        'published_at' => 'datetime',

        // Versioning
        'version' => 'integer',
    ];

    public function evaluable()
    {
        return $this->morphTo();
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function evaluationCriterias()
    {
        return $this->hasMany(EvaluationCriteria::class);
    }
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
    public function quize()
    {
        return $this->hasOne(Evaluation::class);
    }
    public function calendarEvent()
    {
        return $this->morphOne(EventCalendar::class, 'eventable');
    }
    public function quizzes()
    {
        return $this->morphMany(Quiz::class, 'quizzable');
    }
}
