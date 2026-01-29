<?php

use App\Models\QuizAttempt;

class QuizScoringService
{
    public function calculate(QuizAttempt $attempt): float
    {
        $score = $attempt->answers->sum('score');

        $attempt->update([
            'score' => $score,
            'is_passed' => $score >= $attempt->quiz->success_threshold
        ]);

        return $score;
    }
}
