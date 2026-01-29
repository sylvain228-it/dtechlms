<?php

namespace App\Models;

use App\Traits\HasPrerequisites;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sequence extends Model
{
    use SoftDeletes, HasPrerequisites;
    protected $fillable = [
        'module_id',
        'parent_course_id',

        // Identification
        'title',
        'slug',
        'description',

        // Objectifs pédagogiques
        'syllabus',
        'learning_outcomes',

        // Typologie pédagogique
        'sequence_type',

        // Organisation temporelle
        'order',
        'estimated_hours',
        'estimated_days',
        'start_date',
        'end_date',

        // Modalités pédagogiques
        'modality',

        // Approche pédagogique
        'teaching_methods',
        'learning_activities_summary',

        // Liens pédagogiques
        'prerequisites',
        'dependencies',

        // Évaluation
        'has_assessment',
        'assessment_weight',

        // Visibilité & statut
        'status',
        'is_mandatory',
        'is_visible',
    ];
    public function resources()
    {
        return $this->morphMany(EntityResource::class, 'entitytable');
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function studentSequenceProgres()
    {
        return $this->hasMany(StudentSequenceProgres::class);
    }
    public function quizzes()
    {
        return $this->morphMany(Quiz::class, 'quizzable');
    }
    public function evaluations()
    {
        return $this->morphMany(Evaluation::class, 'evaluable');
    }
}
