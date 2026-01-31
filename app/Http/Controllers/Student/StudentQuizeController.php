<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Traits\StudentTrait;
use Illuminate\Http\Request;

class StudentQuizeController extends Controller
{
    use StudentTrait;
    public function index()
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $quizzes = Quiz::with(['activity', 'questions'])->whereIn('parent_course_id', $studentCoursesIds)
            ->orderBy('created_at', 'DESC')
            ->get();
        $student = $this->student();
        return inertia('students/quizzes/index', ['student' => $student, 'quizzes' => $quizzes]);
    }
    public function details($slug)
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $quiz = Quiz::with(['activity', 'questions'])->whereIn('parent_course_id', $studentCoursesIds)->where('slug', $slug)->firstOrFail();
        $student = $this->student();
        return inertia('students/quizzes/details', ['student' => $student, 'quiz' => $quiz]);
    }
    public function start($slug)
    {
        $studentCoursesIds = $this->studentsCoursesIds();
        $quiz = Quiz::with('activity')->whereIn('parent_course_id', $studentCoursesIds)->where('slug', $slug)->firstOrFail();
        $student = $this->student();
        $questions = QuizQuestion::with(['answers' => function ($query) {
            $query->inRandomOrder();
        }])->where('quiz_id', $quiz->id)->inRandomOrder()->get();
        return inertia('students/quizzes/start', ['student' => $student, 'quiz' => $quiz, 'questions' => $questions]);
    }
}
