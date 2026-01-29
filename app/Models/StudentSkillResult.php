<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentSkillResult extends Model
{
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
