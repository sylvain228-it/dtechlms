<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrUpdateQuizQuestion;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;

class TeacherQuizeQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($slug)
    {
        $quize = Quiz::where('slug', $slug)->firstOrFail();
        $quizQuests = QuizQuestion::with('quize')->where('quiz_id', $quize->id)->get();
        return inertia('teachers/quizzes/questions/index', ['quiz_quests' => $quizQuests]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrUpdateQuizQuestion $request, $quizId)
    {
        $quize = Quiz::findOrFail($quizId);
        $data = $request->validated();
        $data['quiz_id'] = $quize->id;
        $quizeQues = new QuizQuestion();
        $quizeQues->fill($data);
        $quizeQues->save();
        return redirect()->back()
            ->with('success', 'Question ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // 
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreOrUpdateQuizQuestion $request, $quizId, string $id)
    {
        $quize = Quiz::findOrFail($quizId);
        $data['quiz_id'] = $quize->id;
        $quizeQuest = QuizQuestion::findOrFail($id);
        $data = $request->validated();
        $quizeQuest->fill($data);
        $quizeQuest->update();
        return redirect()->back()
            ->with('success', 'Question modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($quizId, string $id)
    {
        $quize = Quiz::findOrFail($quizId);
        $quizeQuest = QuizQuestion::findOrFail($id);
        $quizeQuest->delete();
        return redirect()->back()
            ->with('success', 'Question supprimé avec succès');
    }
}
