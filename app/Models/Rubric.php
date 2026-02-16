<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rubric extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'version',
        'parent_rubric_id',
    ];
}
