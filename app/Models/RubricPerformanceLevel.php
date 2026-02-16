<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RubricPerformanceLevel extends Model
{
    protected $fillable = [
        'rubric_criteria_id',
        'label',
        'description',
        'score_value',
        'min_score',
        'max_score',
        'is_passing',
        'position',
        'color',
    ];
}
