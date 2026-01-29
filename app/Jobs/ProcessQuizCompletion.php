<?php

namespace App\Jobs;

use App\Models\QuizAttempt;
use BadgeAwardService;
use CertificationAwardService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use QuizCorrectionService;
use QuizScoringService;
use QuizSkillService;

class ProcessQuizCompletion implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(
        QuizAttempt $attempt,
        QuizCorrectionService $corrector,
        QuizScoringService $scorer,
        QuizSkillService $competences,
        BadgeAwardService $badges,
        CertificationAwardService $certifications
    ) {
        $corrector->correct($attempt);
        $scorer->calculate($attempt);
        $competences->updateSkills($attempt);

        $badges->check($attempt->learner);
        $certifications->check($attempt->learner);
    }
}
