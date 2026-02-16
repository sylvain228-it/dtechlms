<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'activity_id',
        'parent_course_id',
        'student_id',
        'title',
        'description',
        'nb_attempt',
        'submitted_at',
        'late_submission',
        'status'
    ];
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
    public function parentCourse()
    {
        return $this->belongsTo(Course::class, 'parent_course_id');
    }
    public function submissionUploads()
    {
        return $this->hasMany(SubmissionUpload::class);
    }
}
