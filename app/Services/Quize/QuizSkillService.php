<?php

use App\Models\QuizAttempt;
use App\Models\StudentSkillResult;

class QuizSkillService
{
    public function updateSkills(QuizAttempt $attempt): void
    {
        foreach ($attempt->quiz->skills as $competence) {

            $questions = $attempt->quiz->questions
                ->where('competence_id', $competence->id);

            if ($questions->isEmpty()) continue;

            $score = $attempt->answers
                ->whereIn('quiz_question_id', $questions->pluck('id'))
                ->sum('score');

            $max = $questions->sum('points');
            $percentage = ($score / $max) * 100;

            StudentSkillResult::updateOrCreate(
                [
                    'learner_id' => $attempt->learner_id,
                    'competence_id' => $competence->id
                ],
                [
                    'progress_percentage' => $percentage,
                    'achieved_level' => $this->levelFromPercentage($percentage)
                ]
            );
        }
    }

    private function levelFromPercentage(float $p): string
    {
        return match (true) {
            $p >= 85 => 'expert',
            $p >= 70 => 'mastery',
            $p >= 50 => 'intermediate',
            default => 'initiation'
        };
    }
}
