<?php

use App\Models\QuizAttempt;
use App\Models\QuizAttemptAnswer;

class QuizCorrectionService
{
    public function correct(QuizAttempt $attempt): void
    {
        foreach ($attempt->answers as $answer) {

            $question = $answer->question;

            $isCorrect = match ($question->question_type) {
                'single_choice', 'true_false' =>
                $answer->quiz_answer_id &&
                    $answer->quizAnswer->is_correct,

                'multiple_choice' =>
                $this->checkMultipleChoice($answer),

                'numeric' =>
                abs($answer->numeric_answer - $answer->quizAnswer->numeric_value)
                    <= $answer->quizAnswer->tolerance,

                default => false
            };

            $answer->update([
                'is_correct' => $isCorrect,
                'score' => $isCorrect ? $question->points : 0
            ]);
        }
    }

    private function checkMultipleChoice(QuizAttemptAnswer $answer): bool
    {
        $question = $answer->question;

        // IDs des bonnes réponses
        $correctAnswerIds = $question->answers()
            ->where('is_correct', true)
            ->pluck('id')
            ->sort()
            ->values();

        // IDs des réponses données par l’apprenant
        $givenAnswerIds = QuizAttemptAnswer::where('quiz_attempt_id', $answer->quiz_attempt_id)
            ->where('quiz_question_id', $question->id)
            ->pluck('quiz_answer_id')
            ->sort()
            ->values();

        // Réussite uniquement si correspondance exacte
        return $correctAnswerIds->toArray() === $givenAnswerIds->toArray();
    }

    private function checkMultipleChoiceWithPartialScore(
        QuizAttemptAnswer $answer,
        float $questionPoints
    ): float {
        $question = $answer->question;

        $correct = $question->answers()->where('is_correct', true)->pluck('id');
        $given = QuizAttemptAnswer::where('quiz_attempt_id', $answer->quiz_attempt_id)
            ->where('quiz_question_id', $question->id)
            ->pluck('quiz_answer_id');

        $good = $given->intersect($correct)->count();
        $bad = $given->diff($correct)->count();

        $score = max(0, ($good - $bad) / $correct->count());

        return round($score * $questionPoints, 2);
    }
}
