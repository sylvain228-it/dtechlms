<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackGuideline extends Model
{
    protected $fillable = [
        'title',
        'content',
        'type',
        'criterion_type',
        'is_active',
    ];
}
