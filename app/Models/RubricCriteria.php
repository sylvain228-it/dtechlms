<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RubricCriteria extends Model
{
    protected $fillable = [
        'rubric_id',
        'title',
        'description',
        'weight',
        'position',
    ];
}
