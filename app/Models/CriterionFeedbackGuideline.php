<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CriterionFeedbackGuideline extends Model
{
    protected $fillable = [
        'evaluation_criteria_id',
        'feedback_guideline_id',
    ];
}
