<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Student;
use App\Models\Teacher;
use App\Traits\InstitutTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitutDashboardController extends Controller
{
    use InstitutTrait;
    public function index()
    {
        $institut = $this->getAuthInstitut();
        $courses_count = Course::where('institut_id', $institut->id)->count();
        $students_count = Student::where('institut_id', $institut->id)->count();
        $teachers_count = Teacher::where('institut_id', $institut->id)->count();

        return Inertia::render('instituts/dashboard', compact('teachers_count', 'courses_count', 'students_count'));
    }
    public function docs()
    {
        return inertia('instituts/docs/index');
    }
}
