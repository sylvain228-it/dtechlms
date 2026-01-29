<?php

namespace App\Traits;

use App\Models\Teacher;
use Illuminate\Support\Facades\Auth;

trait TeacherTrait
{
    public function __construct()
    {
        if (!Auth::check() || Auth::user()->account_role != "teacher") {
            return redirect('/');
        }
    }
    public function teacher()
    {
        $teacher = Teacher::with(['courses'])->where('user_id', Auth::user()->id)->firstOrFail();
        return $teacher;
    }
}
