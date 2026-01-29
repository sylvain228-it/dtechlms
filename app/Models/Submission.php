<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }
    public function resources()
    {
        return $this->belongsToMany(SubmissionResource::class);
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
