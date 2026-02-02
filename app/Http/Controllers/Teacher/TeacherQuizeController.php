<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrUpdateQuizRequest;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Quiz;
use App\Traits\AppUtilityTrait;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherQuizeController extends Controller
{
    use AppUtilityTrait, TeacherTrait;
    public function allQuizzes()
    {
        $teacher = $this->teacher();
        $courseIds = Course::where('teacher_id', $teacher->id)->pluck('id')->toArray();
        $quizzes = Quiz::with(['parentCourse', 'activity'])->whereIn('parent_course_id', $courseIds)->get();
        return inertia('teachers/quizzes/index', [
            'quizzes' => $quizzes,
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
        return inertia('teachers/quizzes/form', ['activity' => $activity, 'c_modality' => $modality]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrUpdateQuizRequest $request, $activityId)
    {
        $activity = $this->checkActivity($activityId);
        $quiz = new Quiz();
        $data = $request->validated();
        $data = array_merge($data, [
            'slug' => $this->uniqueSlug(Quiz::class, $data['title']),
        ]);
        $data['allowed_tools'] = json_encode($data['allowed_tools']);
        $data['parent_course_id'] = $activity->id;
        $quiz->fill($data);
        $quiz->save();

        return redirect()->back()->with('success', 'Quiz ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show($activitySlug, $slug)
    {
        $activity = $this->checkActivity($activitySlug);
        $quiz = Quiz::with('activity')->where('slug', $slug)->where('activity_id', $activity->id)->firstOrFail();
        return inertia('teachers/quizzes/show', ['quiz' => $quiz]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($activitySlug, $slug)
    {
        $activity = $this->checkActivity($activitySlug);
        $quiz = Quiz::where('slug', $slug)->firstOrFail();
        $modality = $quiz->parentCourse->modality;
        return inertia('teachers/quizzes/form', ['quiz' => $quiz, 'activity' => $activity, 'c_modality' => $modality]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreOrUpdateQuizRequest $request, $activityId, $id)
    {
        $activity = $this->checkActivity($activityId);
        $quiz = Quiz::findOrFail($id);
        $data = $request->validated();
        $data = array_merge($data, [
            'slug' => $this->uniqueSlug(Quiz::class, $data['title'], $quiz->id),
        ]);
        $data['allowed_tools'] = json_encode($data['allowed_tools']);
        $data['parent_course_id'] = $activity->id;
        $quiz->fill($data);

        $quiz->update();

        return redirect()->back()->with('success', 'Quiz modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $activityId, $id)
    {
        $this->checkActivity($activityId);
        $quiz = Quiz::findOrFail($id);
        $quiz->delete();

        return redirect()->back()->with('success', 'Quiz suprimé avec succès');
    }
}
