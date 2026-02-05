<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Module;
use App\Models\Sequence;
use App\Traits\StudentTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentActivityController extends Controller
{
    use StudentTrait;
    public function index()
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $activities = Activity::whereIn('parent_course_id', $studentCoursesIds)->whereNot('start_at', null)
            ->orderBy('start_at', 'DESC')
            ->get();
        $student = $this->student();
        return inertia('students/calendars/index', ['student' => $student, 'activities' => $activities]);
    }
    public function details($slug)
    {
        $courseIds = $this->studentsCoursesIds();
        $activity = Activity::whereIn('parent_course_id', $courseIds)->where('slug', $slug)->firstOrFail();
        $related = ['resources.resource'];

        if ($activity->activity_type == 'quiz') {
            $related[] = 'quiz';
        }
        if ($activity->module_id !== null && $activity->scope === 'module') {
            $related[] = 'module';
        } elseif ($activity->sequence_id !== null && $activity->scope === 'sequence') {
            $related[] = 'sequence.module';
        } else {
            $related[] = 'course';
        }

        $related = array_values(array_unique($related));
        $activity = Activity::with($related)->whereIn('parent_course_id', $courseIds)->where('slug', $slug)->firstOrFail();
        // dd($activity);
        return Inertia::render('students/activities/details', [
            'activity' => $activity,
            'current_course' => $activity->parentCourse
        ]);

        return inertia('students/activities/details', ['activity' => $activity]);
    }

    public function moduleDetails($coursSlug, $moduleSlug)
    {
        $courseIds = $this->studentsCoursesIds();
        $course = Course::whereIn('id', $courseIds)->where('slug', $coursSlug)->firstOrFail();
        $module = Module::where('slug', $moduleSlug)->where('course_id', $course->id)->firstOrFail();
        return Inertia::render('students/courses/details-module', ['course' => $course, 'module' => $module]);
    }
    public function sequenceDetails($coursSlug, $sequenceSlug)
    {
        $courseIds = $this->studentsCoursesIds();
        $course = Course::whereIn('id', $courseIds)->where('slug', $coursSlug)->firstOrFail();
        $sequence = Sequence::with('module')->where('slug', $sequenceSlug)->where('parent_course_id', $course->id)->firstOrFail();
        return Inertia::render('students/courses/details-sequence', ['course' => $course, 'sequence' => $sequence]);
    }
}
