<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\EventCalendar;
use App\Models\Module;
use App\Models\Sequence;
use App\Models\Student;
use App\Traits\StudentTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentCoursController extends Controller
{
    use StudentTrait;
    public function courses()
    {
        $student = $this->student();
        $enrollments = Enrollment::with(['course.modules.sequences', 'course.teacher'])->where('student_id', $student->id)->get();
        return Inertia::render('students/courses/index', ['enrollments' => $enrollments]);
    }
    public function details($coursSlug)
    {
        $student = $this->student();
        $courseIds = $this->studentsCoursesIds();
        $course = Course::with(['teacher'])->whereIn('id', $courseIds)->where('slug', $coursSlug)->firstOrFail();
        $activities = Activity::with('parentCourse')->where('parent_course_id', $course->id)
            ->whereDate('start_at', '>=', now()->toDateString())
            ->orderBy('start_at', 'ASC')->get();
        $modules = Module::with(['sequences.activities'])->where('course_id', $course->id)->orderBy('order', 'ASC')->get();
        return Inertia::render('students/courses/details', ['student' => $student, 'course' => $course, 'modules' => $modules, 'activities' => $activities]);
    }

    public function content($coursSlug)
    {
        $student = $this->student();
        $courseIds = $this->studentsCoursesIds();
        $course = Course::whereIn('id', $courseIds)->where('slug', $coursSlug)->firstOrFail();
        $modules = Module::with(['sequences.activities'])->where('course_id', $course->id)->orderBy('order', 'ASC')->get();
        $activities = Activity::with('parentCourse')->where('parent_course_id', $course->id)
            ->whereDate('start_at', '>=', now()->toDateString())
            ->orderBy('start_at', 'ASC')->get();
        return Inertia::render('students/courses/content', ['student' => $student, 'course' => $course, 'modules' => $modules, 'activities' => $activities]);
    }
    public function reading($coursSlug, $sequSlug)
    {
        $student = $this->student();
        $courseIds = $this->studentsCoursesIds();
        $course = Course::whereIn('id', $courseIds)->where('slug', $coursSlug)->firstOrFail();
        if (!Enrollment::where('course_id', $course->id)->where('student_id', $student->id)->exists()) {
            return abort(404, 'Cours non trouvé');
        }
        $modules = Module::with(['sequences'])->where('course_id', $course->id)->orderBy('order', 'ASC')->get();
        $sequence = Sequence::with('resources.resource')->where('slug', $sequSlug)->firstOrFail();
        $activities = Activity::with('resources.resource')->where('sequence_id', $sequence->id)->get();
        return Inertia::render('students/courses/lecture', ['student' => $student, 'course' => $course, 'modules' => $modules, 'sequence' => $sequence, 'activities' => $activities]);
    }
}
