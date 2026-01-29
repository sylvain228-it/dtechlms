<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\EventCalendar;
use App\Models\Sequence;
use App\Traits\StudentTrait;
use Illuminate\Http\Request;

class StudentActivityCalendarController extends Controller
{
    use StudentTrait;
    public function index()
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $activities = Activity::whereIn('parent_course_id', $studentCoursesIds)->whereNot('start_at', null)
            ->orderBy('start_at', 'ASC')
            ->get();
        $student = $this->student();
        return inertia('students/calendars/index', ['student' => $student, 'activities' => $activities]);
    }
    public function show($id)
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $event = EventCalendar::whereIn('course_id', $studentCoursesIds)
            ->where('id', $id)
            ->firstOrFail();
        $student = $this->student();
        return inertia('students/events/details', ['student' => $student, 'event' => $event]);
    }
    public function redirectFromEventToEventableDetails($id)
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $event = EventCalendar::whereIn('course_id', $studentCoursesIds)
            ->where('id', $id)
            ->firstOrFail();
        if ($event->event_type == 'activity') {
            $activity = Activity::with(['resources.resource'])->find($event->eventable_id);
            $sequence = Sequence::with('resources.resource')->find($activity->sequence_id);
            return inertia('students/activities/details', ['activity' => $activity, 'sequence' => $sequence]);
        }
        return response('error');
    }
}
