<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherCoursManageController extends Controller
{
    use TeacherTrait;
    public function courses()
    {
        return Inertia::render('teachers/courses');
    }
}
