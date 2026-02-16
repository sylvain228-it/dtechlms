<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityRequest;
use App\Models\Activity;
use App\Models\Course;
use App\Models\DeliverableRequirement;
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
        return Inertia::render('teachers/activities/index', [
            'course' => $course,
            'activities' => $activities,
        ]);
    }
    public function allActivities()
    {
        $courseIds = $this->teacherCourseIds();
        $activities = Activity::with('parentCourse')->whereIn('parent_course_id', $courseIds)->orderByDesc('start_at', null)->get();
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
        $lastCoursActivity = Activity::where('parent_course_id', $course->id)->where('scope', 'course')->orderBy('order', 'DESC')->first();
        $nextOrder = 1;
        if ($lastCoursActivity) {
            $nextOrder = $lastCoursActivity->order + 1;
        }
        return Inertia::render('teachers/activities/form', [
            'course' => $course,
            'c_modality' => $course->modality,
            'nextOrder' => $nextOrder,
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

            $lastActivity = Activity::where('parent_course_id', $course->id)->where('scope', $scope)->orderBy('order', 'DESC')->first();
            $nextOrder = 1;
            if ($lastActivity) {
                $nextOrder = $lastActivity->order + 1;
            }

            // Si téléphone (local ou international)
            if ($scope == 'module') {
                $modules = Module::orderBy('title', 'DESC')->where('course_id', $course->id)->get();
                return response()->json(['data' => $modules, 'nextOrder' => $nextOrder, 'status' => 200], 200);
            } elseif ($scope == 'sequence') {
                $sequences = Sequence::orderBy('title', 'DESC')->where('parent_course_id', $course->id)->get();
                return response()->json(['data' => $sequences, 'nextOrder' => $nextOrder, 'status' => 200], 200);
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
                'version' => 1,
                'parent_course_id' => $course->id,
            ]);
            $activity->fill($data);
            $activity->save();
            $request->session()->forget('text_syllabus');
            $deliverable_requirements = json_decode($data['deliverable_requirements'], true);
            foreach ($deliverable_requirements as $item) {
                $item = array_merge($item, ['activity_id' => $activity->id]);
                DeliverableRequirement::create($item);
            }


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
        $related = ['resources.resource', 'delivRequirements'];
        if ($activity->activity_type == 'quiz') {
            $related[] = 'quiz';
        }
        if ($activity->module_id !== null && $activity->scope === 'module') {
            $related[] = 'module';
        } elseif ($activity->sequence_id !== null && $activity->scope === 'sequence') {
            $related[] = 'sequence.module';
        } else if ($activity->scope === 'course' && $activity->course_id !== null) {
            $related[] = 'course';
        }

        $related = array_values(array_unique($related));
        $activity = Activity::with($related)->where('slug', $slug)->firstOrFail();
        return Inertia::render('teachers/activities/show', [
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
        $activity = Activity::with(['course', 'delivRequirements'])->where('slug', $slug)->first();
        return Inertia::render('teachers/activities/form', [
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
                'parent_course_id' => $course->id,
            ]);
            $activity->fill($data);
            $activity->update();
            $request->session()->forget('text_edit_syllabus');
            $deliverable_requirements = json_decode($data['deliverable_requirements'], true);
            foreach ($deliverable_requirements as $item) {
                $item = array_merge($item, ['activity_id' => $activity->id]);
                $deliv = DeliverableRequirement::where('activity_id', $activity->id)->where('order', $item['order'])->first();
                if ($deliv) {
                    $deliv->update($item);
                } else {
                    DeliverableRequirement::create($item);
                }
            }
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
