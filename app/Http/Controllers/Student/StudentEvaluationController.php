<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Traits\StudentTrait;
use Illuminate\Http\Request;

class StudentEvaluationController extends Controller
{
    use StudentTrait;
    public function index()
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $evaluations = Evaluation::with(['activity'])->whereIn('parent_course_id', $studentCoursesIds)
            ->orderBy('created_at', 'DESC')
            ->get();
        $student = $this->student();
        return inertia('students/evaluations/index', ['student' => $student, 'evaluations' => $evaluations]);
    }
    public function details($slug)
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $evaluation = Evaluation::with(['activity'])->whereIn('parent_course_id', $studentCoursesIds)->where('slug', $slug)->firstOrFail();
        $student = $this->student();
        return inertia('students/evaluations/details', ['student' => $student, 'evaluation' => $evaluation]);
    }
}
