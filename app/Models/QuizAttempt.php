<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    public function quize()
    {
        return $this->belongsTo(Quiz::class);
    }
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function attempts()
    {
        return $this->hasMany(QuizAttemptAnswer::class);
    }
}
