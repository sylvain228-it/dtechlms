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
        $evaluations = Evaluation::with(['parentCourse', 'activity'])->whereIn('parent_course_id', $courseIds)->get();
        return inertia('teachers/evaluations/index', [
            'evaluations' => $evaluations,
        ]);
    }

    public function checkActivity($activity): Activity
    {
        if (is_numeric($activity)) {
            return Activity::findOrFail($activity);
        } else {
            return Activity::where('slug', $activity)->firstOrFail();
        }
    }

    public function create($activitySlug)
    {
        $activity = $this->checkActivity($activitySlug);
        $modality = $activity->parentCourse->modality;
        return inertia('teachers/evaluations/form', ['activity' => $activity, 'c_modality' => $modality]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrUpdateEvaluationRequest $request, $activityId)
    {
        $activity = $this->checkActivity($activityId);
        $evaluation = new Evaluation();
        $data = $request->validated();
        $data = array_merge($data, [
            'slug' => $this->uniqueSlug(Evaluation::class, $data['title']),
        ]);
        $data['allowed_tools'] = json_encode($data['allowed_tools']);
        $data['parent_course_id'] = $activity->id;
        $evaluation->fill($data);
        $evaluation->save();

        return redirect()->back()->with('success', 'Evaluation ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show($activitySlug, $slug)
    {
        $activity = $this->checkActivity($activitySlug);
        $evaluation = Evaluation::where('slug', $slug)->firstOrFail();
        return inertia('teachers/evaluations/show', ['evaluation' => $evaluation, 'activity' => $activity]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($activitySlug, $slug)
    {
        $activity = $this->checkActivity($activitySlug);
        $evaluation = Evaluation::where('slug', $slug)->firstOrFail();
        $modality = $evaluation->parentCourse->modality;
        return inertia('teachers/evaluations/form', ['evaluation' => $evaluation, 'activity' => $activity, 'c_modality' => $modality]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreOrUpdateEvaluationRequest $request, $activityId, $id)
    {
        $activity = $this->checkActivity($activityId);
        $evaluation = Evaluation::findOrFail($id);
        $data = $request->validated();
        $data = array_merge($data, [
            'slug' => $this->uniqueSlug(Evaluation::class, $data['title'], $evaluation->id),
        ]);
        $data['allowed_tools'] = json_encode($data['allowed_tools']);
        $data['parent_course_id'] = $activity->id;
        $evaluation->fill($data);

        $evaluation->update();

        return redirect()->back()->with('success', 'Evaluation modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $activityId, $id)
    {
        $this->checkActivity($activityId);
        $evaluation = Evaluation::findOrFail($id);
        $evaluation->delete();

        return redirect()->back()->with('success', 'Evaluation suprimé avec succès');
    }
}
