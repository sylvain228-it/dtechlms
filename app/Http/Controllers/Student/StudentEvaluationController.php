<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Evaluation;
use App\Traits\StudentTrait;
use Illuminate\Http\Request;

class StudentEvaluationController extends Controller
{
    use StudentTrait;
    public function index()
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $evaluations = Activity::with('parentCourse')->where('activity_type', 'assessment')->whereIn('parent_course_id', $studentCoursesIds)
            ->orderBy('created_at', 'DESC')
            ->get();
        $student = $this->student();
        return inertia('students/evaluations/index', ['student' => $student, 'evaluations' => $evaluations]);
    }
}
