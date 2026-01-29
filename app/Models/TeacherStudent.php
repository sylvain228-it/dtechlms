<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherStudent extends Model
{
    protected $fillable = ['student_id', 'teacher_id', 'course_id'];
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
