<?php

use App\Models\Certification;
use App\Models\Student;

class CertificationAwardService
{
    public function check(Student $learner): void
    {
        Certification::all()->each(function ($cert) use ($learner) {

            if ($learner->certifications->contains($cert)) return;

            if ($this->criteriaMet($cert, $learner)) {
                $learner->certifications()->attach($cert->id, [
                    'awarded_at' => now(),
                    'expires_at' => $cert->validity_days
                        ? now()->addDays($cert->validity_days)
                        : null
                ]);
            }
        });
    }

    private function criteriaMet(Certification $cert, Student $learner): bool
    {
        return
            $this->checkCompetences($cert, $learner)
            && $this->checkBadges($cert, $learner)
            && $this->checkScore($cert, $learner);
    }

    private function checkCompetences(Certification $cert, Student $learner): bool
    {
        if (!$cert->required_competences) {
            return true;
        }

        foreach ($cert->required_competences as $competenceId => $requiredLevel) {

            $result = $learner->competenceResults
                ->where('competence_id', $competenceId)
                ->first();

            if (!$result || !$this->levelEnough($result->achieved_level, $requiredLevel)) {
                return false;
            }
        }

        return true;
    }

    private function levelEnough(string $current, string $required): bool
    {
        $levels = ['initiation', 'intermediate', 'mastery', 'expert'];

        return array_search($current, $levels) >= array_search($required, $levels);
    }

    private function checkBadges(Certification $cert, Student $learner): bool
    {
        if (!$cert->required_badges) {
            return true;
        }

        return collect($cert->required_badges)
            ->every(
                fn($badgeId) =>
                $learner->badges->contains('id', $badgeId)
            );
    }

    private function checkScore(Certification $cert, Student $learner): bool
    {
        if (!$cert->min_score) {
            return true;
        }

        $courseProgress = $learner->courseProgress
            ->where('course_id', $cert->course_id ?? null)
            ->first();

        return $courseProgress && $courseProgress->score >= $cert->min_score;
    }
}
