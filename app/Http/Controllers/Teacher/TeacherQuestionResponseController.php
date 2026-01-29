<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrUpdateQuizAnswerRequest;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;

class TeacherQuestionResponseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($quizSlug, $questId)
    {
        Quiz::where('slug', $quizSlug)->firstOrFail();
        $quizQuest = QuizQuestion::with('quize')->findOrFail($questId);
        $questAnswers = QuizAnswer::with(['question.quize'])->where('quiz_question_id', $quizQuest->id)->get();

        return inertia('teachers/quizzes/answers/index', ['quiz_quest_answers' => $questAnswers, 'question' => $quizQuest]);
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
    public function store(StoreOrUpdateQuizAnswerRequest $request, $quizId, $questId)
    {
        Quiz::findOrFail($quizId);
        $quest = QuizQuestion::findOrFail($questId);
        $data = $request->validated();
        $data['quiz_question_id'] = $quest->id;
        $quizeAnswers = new QuizAnswer();
        $quizeAnswers->fill($data);
        $quizeAnswers->save();
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
    public function update(StoreOrUpdateQuizAnswerRequest $request, $quizId, $questId, string $id)
    {
        Quiz::findOrFail($quizId);
        $quest = QuizQuestion::findOrFail($questId);
        $quizeAnswers = QuizAnswer::findOrFail($id);
        $data = $request->validated();
        $data['quiz_question_id'] = $quest->id;
        $quizeAnswers->fill($data);
        $quizeAnswers->update();
        return redirect()->back()
            ->with('success', 'Réponse modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($quizId, $questId, string $id)
    {
        Quiz::findOrFail($quizId);
        QuizQuestion::findOrFail($questId);
        $quizeAnswers = QuizAnswer::findOrFail($id);
        $quizeAnswers->delete();
        return redirect()->back()
            ->with('success', 'Réponse supprimé avec succès');
    }
}
