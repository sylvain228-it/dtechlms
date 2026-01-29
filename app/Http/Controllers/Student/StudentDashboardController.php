<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\EventCalendar;
use App\Traits\StudentTrait;
use Illuminate\Http\Request;

class StudentDashboardController extends Controller
{
    use StudentTrait;
    public function dashboard()
    {
        $student = $this->student();
        $studentCoursesIds = $this->studentsCoursesIds();
        $activities = Activity::with('parentCourse')->whereIn('parent_course_id', $studentCoursesIds)
            ->whereDate('start_at', '>=', now()->toDateString())
            ->orderBy('start_at', 'ASC');
        $totalCourses = $this->student()->enrollments->count();
        $totalUpComingActivities = $activities->count();
        $activities = $activities->take(9)->get();
        return inertia('students/index', ['student' => $student, 'activities' => $activities, 'totalCourses' => $totalCourses, 'totalUpComingActivities' => $totalUpComingActivities]);
    }
}
