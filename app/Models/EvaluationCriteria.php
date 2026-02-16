<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationCriteria extends Model
{
    protected $fillable = [
        'activity_id',
        'skill_id',
        'title',
        'slug',
        'description',
        'position',
        'weight',
        'max_score',
        'success_threshold',
        'is_mandatory',
        'criterion_type',
        'evaluation_method',
        'status',
        'version',
        'parent_criteria_id',
    ];

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
    public function evaluationCriteria()
    {
        return $this->belongsTo(EvaluationCriteria::class);
    }
    public function evaluationCriterias()
    {
        return $this->hasMany(EvaluationCriteria::class);
    }
}
