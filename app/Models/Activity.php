<?php

namespace App\Models;

use App\Traits\HasPrerequisites;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasPrerequisites;
    public function module()
    {
        return $this->hasOneThrough(Module::class, Course::class,);
    }
    public function sequence()
    {
        return $this->belongsTo(Sequence::class);
    }
    public function parentCourse()
    {
        return $this->belongsTo(Course::class, 'parent_course_id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function submission()
    {
        return $this->hasMany(Submission::class);
    }
    public function resources()
    {
        return $this->morphMany(EntityResource::class, 'entitytable');
    }
    public function quizzes()
    {
        return $this->morphMany(Quiz::class, 'quizzable');
    }
    public function studentActivityProgres()
    {
        return $this->hasMany(StudentActivityProgres::class);
    }
    public function activityAttendances()
    {
        return $this->hasMany(ActivityAttendance::class);
    }
    public function events()
    {
        return $this->morphMany(EventCalendar::class, 'eventable');
    }
    public function evaluations()
    {
        return $this->morphMany(Evaluation::class, 'evaluable');
    }



    protected $fillable = [
        'parent_course_id',
        'sequence_id',
        'course_id',
        'module_id',
        'scope',

        // Identification
        'title',
        'slug',
        'description',

        // Typologie d’activité
        'activity_type',

        // Consignes pédagogiques
        'instructions',
        'steps',
        'expected_outcomes',

        // Organisation
        'order',
        'estimated_minutes',

        // Modalités
        'modality',
        'is_individual',
        'is_collaborative',
        'max_group_size',

        // Livrables
        'has_deliverable',
        'deliverable_type',
        'deliverable_requirements',
        'deliverable_deadline',

        // Évaluation
        'is_evaluated',
        'evaluation_type',
        'evaluation_weight',
        'note_unit',

        // Prérequis et dépendances
        'prerequisites',
        'dependencies',

        // Pédagogie avancée
        'teaching_methods',
        'tools',
        'resources_summary',

        // Feedback et accompagnement
        'requires_feedback',
        'allows_resubmission',
        'max_attempts',
        'is_synchronous',

        // Planification
        'start_at',
        'duration_minutes',

        // Visioconférence
        'conference_platform',
        'conference_url',
        'conference_meeting_id',
        'conference_passcode',

        // Présence
        'attendance_required',

        // États
        'status',
        'is_mandatory',
        'is_visible',
    ];

    protected $casts = [
        // JSON
        'steps' => 'array',
        'expected_outcomes' => 'array',
        'deliverable_requirements' => 'array',
        'prerequisites' => 'array',
        'dependencies' => 'array',
        'teaching_methods' => 'array',
        'tools' => 'array',
        'resources_summary' => 'array',

        // Booléens
        'is_individual' => 'boolean',
        'is_collaborative' => 'boolean',
        'has_deliverable' => 'boolean',
        'is_evaluated' => 'boolean',
        'requires_feedback' => 'boolean',
        'allows_resubmission' => 'boolean',
        'is_synchronous' => 'boolean',
        'attendance_required' => 'boolean',
        'is_mandatory' => 'boolean',
        'is_visible' => 'boolean',

        // Dates
        'start_at' => 'datetime',
        'deliverable_deadline' => 'datetime',
    ];
}
