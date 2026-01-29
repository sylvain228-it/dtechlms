<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    //
    // protected fillable
    protected $fillable = [
        'user_id',
        'institut_id',
        'first_name',
        'last_name',
        'email',
        'birth_date',
        'gender',
        'phone_number',
        'whatsapp_number',
        'country',
        'city',
        'address',
        'postal_code',
        'current_level',
        'student_code',
        'is_active',
        'is_verified',
        'credits',
        'medical_info',
        'national_id',
        'guardian_name',
        'guardian_phone',
        'guardian_email',
        'profile_picture_public_id',
        'profile_picture_url',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'enrollments');
    }
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
    public function studentActivityProgres()
    {
        return $this->hasMany(StudentActivityProgres::class);
    }
    public function studentModuleProgres()
    {
        return $this->hasMany(StudentModuleProgres::class);
    }
    public function studentSequenceProgres()
    {
        return $this->hasMany(StudentSequenceProgres::class);
    }
    public function studentCourseProgres()
    {
        return $this->hasMany(StudentCourseProgres::class);
    }
    public function studentSkillResult()
    {
        return $this->hasMany(StudentSkillResult::class);
    }
    public function badges()
    {
        return $this->belongsToMany(StudentBadge::class);
    }
    public function certifications()
    {
        return $this->belongsToMany(StudentCertification::class);
    }
    public function activityAttendances()
    {
        return $this->hasMany(ActivityAttendance::class);
    }
    public function diplomas()
    {
        return $this->belongsToMany(StudentDiploma::class);
    }
}
