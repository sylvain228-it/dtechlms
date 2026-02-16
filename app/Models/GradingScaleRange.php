<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradingScaleRange extends Model
{
    protected $fillable = [
        'grading_scale_id',
        'letter',
        'min_score',
        'max_score',
        'gpa_value',
        'mention',
        'color',
        'position',
    ];
}
