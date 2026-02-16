<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Activity\EvaluationCriteriaRequest;
use App\Models\Activity;
use App\Models\EvaluationCriteria;
use App\Models\Skill;
use App\Traits\AppUtilityTrait;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EvaluationCriteriaController extends Controller
{
    use TeacherTrait, AppUtilityTrait;
    protected $coursesIds;
    public function __construct()
    {
        $this->coursesIds = $this->teacherCourseIds();
    }

    // public function all()
    // {
    //     $activities = Activity::whereIn('parent_course_id', $this->coursesIds)->get();
    //     return inertia('teachers/criterias/index', [
    //     ]);
    // }
    /**
     * Display a listing of the resource.
     */
    public function index($activitySlug)
    {
        $activity = Activity::where('slug', $activitySlug)
            ->whereIn('parent_course_id', $this->coursesIds)
            ->firstOrFail();

        $criterias = EvaluationCriteria::where('activity_id', $activity->id)
            ->with('skill')
            ->orderBy('position')
            ->get();

        return inertia('teachers/criterias/index', [
            'activity' => $activity,
            'criterias' => $criterias,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($activitySlug)
    {
        $activity = Activity::where('slug', $activitySlug)
            ->whereIn('parent_course_id', $this->coursesIds)
            ->firstOrFail();

        // $skills = Skill::active()->get();

        return inertia('teachers/criterias/form', [
            'activity' => $activity,
            // 'skills' => $skills,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EvaluationCriteriaRequest $request, $activityId)
    {
        $activity = Activity::whereIn('parent_course_id', $this->coursesIds)->findOrFail($activityId);

        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['title']);
        $validated['activity_id'] = $activity->id;
        $validated['position'] = EvaluationCriteria::where('activity_id', $activity->id)->max('position') + 1;

        EvaluationCriteria::create($validated);

        return redirect()->route('teachers.criterias.index', $activity->slug)
            ->with('success', 'Critère d\'évaluation créé avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $activitySlug, string $id)
    {
        $activity = Activity::where('slug', $activitySlug)
            ->whereIn('parent_course_id', $this->coursesIds)
            ->firstOrFail();

        $criteria = EvaluationCriteria::where('activity_id', $activity->id)->findOrFail($id);

        return inertia('teachers/criterias/show', [
            'activity' => $activity,
            'criteria' => $criteria,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $activitySlug, string $id)
    {
        $activity = Activity::where('slug', $activitySlug)
            ->whereIn('parent_course_id', $this->coursesIds)
            ->firstOrFail();

        $criteria = EvaluationCriteria::where('activity_id', $activity->id)->findOrFail($id);

        // $skills = Skill::active()->get();

        return inertia('teachers/criterias/form', [
            'activity' => $activity,
            'criteria' => $criteria,
            // 'skills' => $skills,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EvaluationCriteriaRequest $request, $activitySlug, string $id)
    {
        $activity = Activity::where('slug', $activitySlug)
            ->whereIn('parent_course_id', $this->coursesIds)
            ->firstOrFail();

        $criteria = EvaluationCriteria::where('activity_id', $activity->id)->findOrFail($id);

        $validated = $request->validated();
        if ($validated['title'] !== $criteria->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $criteria->update($validated);

        return redirect()->route('teachers.criterias.index', $activity->slug)
            ->with('success', 'Critère d\'évaluation mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($activitySlug, string $id)
    {
        $activity = Activity::where('slug', $activitySlug)
            ->whereIn('parent_course_id', $this->coursesIds)
            ->firstOrFail();

        $criteria = EvaluationCriteria::where('activity_id', $activity->id)->findOrFail($id);

        $criteria->delete();

        return redirect()->route('teachers.criterias.index', $activity->slug)
            ->with('success', 'Critère d\'évaluation supprimé avec succès');
    }
}
