<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\TeacherStudent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherStudentController extends Controller
{
    public function index()
    {

        $courses = Course::where('teacher_id', Auth::id())->get();
        $teacher_students = TeacherStudent::with('student')->where('teacher_id', Auth::id())->orderByDesc('created_at')->get();
        return inertia('teachers/students/index', ['teacher_students' => $teacher_students, 'courses' => $courses]);
    }
}
