<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Course;
use App\Models\EventCalendar;
use App\Models\TeacherStudent;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    use TeacherTrait;
    public function dashboard()
    {
        $teacher = $this->teacher();
        $courseIds = Course::where('teacher_id', $teacher->id)->pluck('id')->toArray();
        $activities =  Activity::with('parentCourse')->whereIn('parent_course_id', $courseIds)
            ->whereDate('start_at', '>=', now()->toDateString())
            ->orderBy('start_at', 'ASC');
        $totalCourses = $this->teacher()->courses->count();
        $totalUpComingActivities = $activities->count();
        $activities = $activities->take(9)->get();
        $studentsCount = TeacherStudent::where('teacher_id', $this->teacher()->id)->count();
        return Inertia::render('teachers/index', ['teacher', $this->teacher(), 'activities' => $activities, 'totalCourses' => $totalCourses, 'totalUpComingActivities' => $totalUpComingActivities, 'studentsCount' => $studentsCount]);
    }
}
