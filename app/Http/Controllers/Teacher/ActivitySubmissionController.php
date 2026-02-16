<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Submission;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;

class ActivitySubmissionController extends Controller
{
    use TeacherTrait;
    protected  $courseIds;
    /**
     * Display a listing of submissions for the authenticated student.
     */
    public function __construct()
    {
        $this->courseIds = $this->teacherCourseIds();
    }
    public function index()
    {
        // Récupérer toutes les soumissions de l'étudiant avec relations
        $submissions = Submission::whereIn('parent_course_id', $this->courseIds)->with(['activity', 'student', 'parentCourse'])
            ->orderBy('created_at', 'desc')
            ->get();
        return inertia('teachers/submissions/index', [
            'submissions' => $submissions,
        ]);
    }
    public function show($activitySlug)
    {
        $activity = Activity::with('delivRequirements')->whereIn('parent_course_id', $this->courseIds)->where('slug', $activitySlug)->firstOrFail();
        $submission = Submission::where('activity_id', $activity->id)->with(['activity', 'student', 'parentCourse'])->firstOrFail();
        // Charger les relations

        return inertia('teachers/submissions/show', [
            'submission' => $submission,
            'submissionUploads' => $submission->submissionUploads,
            'activity' => $activity,
            'parentCourse' => $activity->parentCourse,
            'student' => $submission->student,
            'delivRequirements' => $activity->delivRequirements,
        ]);
    }
}
