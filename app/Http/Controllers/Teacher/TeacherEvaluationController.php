<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrUpdateEvaluationRequest;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Evaluation;
use App\Traits\AppUtilityTrait;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherEvaluationController extends Controller
{
    use AppUtilityTrait, TeacherTrait;
    public function allEvaluations()
    {
        $teacher = $this->teacher();
        $courseIds = Course::where('teacher_id', $teacher->id)->pluck('id')->toArray();
        $evaluations = Activity::with('parentCourse')->whereIn('parent_course_id', $courseIds)->where('activity_type', 'assessment')->get();
        return inertia('teachers/evaluations/index', [
            'evaluations' => $evaluations,
        ]);
    }
}
