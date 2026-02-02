<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityRequest;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Module;
use App\Models\Sequence;
use App\Traits\AppUtilityTrait;
use App\Traits\TeacherTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TeacherCourseActivity extends Controller
{
    use TeacherTrait;
    use AppUtilityTrait;
    /**
     * Display a listing of the resource.
     */
    public function index($courseSlug)
    {
        $course = Course::where('slug', $courseSlug)->firstOrFail();
        $activities = Activity::with('parentCourse')->where('parent_course_id', $course->id)->orderByDesc('created_at')->get();
        return Inertia::render('teachers/courses/activities/index', [
            'course' => $course,
            'activities' => $activities,
        ]);
    }
    public function allActivities()
    {
        $teacher = $this->teacher();
        $courseIds = Course::where('teacher_id', $teacher->id)->pluck('id')->toArray();
        $activities = Activity::with('parentCourse')->whereIn('parent_course_id', $courseIds)->whereNot('start_at', null)->get();
        return Inertia::render('teachers/calendars/index', [
            'activities' => $activities,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($courseSlug)
    {
        $course = Course::where('slug', $courseSlug)->firstOrFail();
        return Inertia::render('teachers/courses/activities/form', [
            'course' => $course,
            'c_modality' => $course->modality
        ]);
    }

    // api
    public function getEntityData(Request $request, $courseSlug)
    {
        try {
            $course = Course::where('slug', $courseSlug)->first();
            if (!$course) {
                return response()->json(['message' => "Le cours est introuvable", 'status' => 400], 400);
            }
            if (!isset($_GET['scope']) || empty($_GET['scope'])) {
                return response()->json(['message' => "Veillez sélectionner la portée", 'status' => 422], 422);
            }
            $scope = $request->scope;

            // Si téléphone (local ou international)
            if ($scope == 'module') {
                $modules = Module::orderBy('title', 'DESC')->where('course_id', $course->id)->get();
                return response()->json(['data' => $modules, 'status' => 200], 200);
            } elseif ($scope == 'sequence') {
                $sequences = Sequence::orderBy('title', 'DESC')->where('parent_course_id', $course->id)->get();
                return response()->json(['data' => $sequences, 'status' => 200], 200);
            }
            return response()->json(['message' => "Aucune donnée trouvée", 'status' => 404], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => "Erreur quelques choses s'est mal passés : " . $e->getMessage(), 'status' => 500], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ActivityRequest $request, $courseSlug)
    {
        $course = Course::where('slug', $courseSlug)->firstOrFail();
        $activity = new Activity();
        $data = $request->validated();
        try {
            $data = array_merge($data, [
                'resources_summary' => $request->session()->get('text_syllabus'),
                'slug' => $this->uniqueSlug(Activity::class, $request->title),
                'activity_id' => $activity->id,
                'version' => 1,
                'parent_course_id' => $course->id,
            ]);
            $activity->fill($data);
            $activity->save();
            $request->session()->forget('text_syllabus');


            return redirect()->route('teachers.activities.index', $course->slug)
                ->with('success', 'Activité ajouté avec succès');
        } catch (Exception $e) {
            Log::warning("Erreur d'enregistrement  activité " . $e->getMessage());
            return redirect()->back()
                ->with('error', "Erreur d'enregistrement  activité");
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($courseSlug, string $slug)
    {
        $course = Course::where('slug', $courseSlug)->firstOrFail();
        $activity = Activity::where('slug', $slug)->first();
        $related = ['resources.resource'];
        if (in_array($activity->activity_type, ['quiz', 'assessment'], true)) {
            $related[] = 'quiz';
            $related[] = 'evaluation';
        } elseif ($activity->module_id !== null && $activity->scope === 'module') {
            $related[] = 'module';
        } elseif ($activity->sequence_id !== null && $activity->scope === 'sequence') {
            $related[] = 'sequence.module';
        } else {
            $related[] = 'course';
        }

        $related = array_values(array_unique($related));
        $activity = Activity::with($related)->where('slug', $slug)->firstOrFail();
        return Inertia::render('teachers/courses/activities/show', [
            'activity' => $activity,
            'current_course' => $course
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($courseSlug, string $slug)
    {
        $course = Course::where('slug', $courseSlug)->firstOrFail();
        $activity = Activity::with(['course'])->where('slug', $slug)->first();
        return Inertia::render('teachers/courses/activities/form', [
            'course' => $course,
            'activity' => $activity,
            'c_modality' => $course->modality
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ActivityRequest $request, $courseSlug, string $id)
    {
        $course = Course::where('slug', $courseSlug)->firstOrFail();
        $activity = Activity::findOrFail($id);
        $data = $request->validated();
        try {
            $data = array_merge($data, [
                'resources_summary' => $request->session()->get('text_edit_syllabus'),
                'slug' => $this->uniqueSlug(Activity::class, $request->title, $activity->id),
                'activity_id' => $activity->id,
                'parent_course_id' => $course->id,
            ]);
            $activity->fill($data);
            $activity->update();
            $request->session()->forget('text_edit_syllabus');

            return redirect()->route('teachers.activities.index', $course->slug)
                ->with('success', 'Activité modifié avec succès');
        } catch (Exception $e) {
            Log::warning("Erreur de modification  activité " . $e->getMessage());
            return redirect()->back()
                ->with('error', "Erreur de modification  activité");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($courseSlug, string $id)
    {
        Course::where('slug', $courseSlug)->firstOrFail();
        $activity = Activity::where('id', $id)->first();
        $activity->delete();
        return redirect()->route('teachers.activities.index', $courseSlug->slug)->with('success', 'Activité supprimé avec succès');
    }
}
