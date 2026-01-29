<?php

namespace App\Models;

use App\Traits\HasPrerequisites;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Module extends Model
{
    use SoftDeletes, HasPrerequisites;
    protected $fillable = [
        'course_id',
        'title',
        'slug',
        'description',
        'order',
        'syllabus',
        'duration',
        'is_mandatory',
        'module_type',
        'modality',
        'prerequisites',
        'is_competency_based',
        'has_evaluation',
        'version',
        'evaluation_weight',
        'estimated_hours',
        'estimated_days',
        'learning_outcomes',
        'assessment_strategy',
        'teaching_methods',
        'is_visible',
        'language',
    ];
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function sequences()
    {
        return $this->hasMany(Sequence::class);
    }
    public function activities()
    {
        return $this->hasManyThrough(Activity::class, Sequence::class);
    }
    public function quizzes()
    {
        return $this->morphMany(Quiz::class, 'quizzable');
    }
    public function studentModuleProgres()
    {
        return $this->hasMany(StudentModuleProgres::class);
    }
    public function resources()
    {
        return $this->morphMany(EntityResource::class, 'entitytable');
    }

    public function evaluations()
    {
        return $this->morphMany(Evaluation::class, 'evaluable');
    }
}
