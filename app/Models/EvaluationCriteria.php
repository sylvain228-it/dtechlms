<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationCriteria extends Model
{
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
