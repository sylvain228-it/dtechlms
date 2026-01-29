<?php

namespace App\Traits;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

trait StudentTrait
{

    public function __construct()
    {
        if (!Auth::check() || Auth::user()->account_role != "student") {
            return redirect('/');
        }
    }
    public function student()
    {
        $student = Student::with(['courses'])->where('user_id', Auth::user()->id)->firstOrFail();
        return $student;
    }
    public function studentsCoursesIds()
    {
        $student = $this->student();
        $studentCoursesIds = $student->enrollments->pluck('course_id')->toArray();
        return $studentCoursesIds;
    }
}
