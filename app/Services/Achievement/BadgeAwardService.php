<?php

use App\Models\Badge;
use App\Models\Certification;
use App\Models\Student;

class BadgeAwardService
{
    public function check(Student $learner): void
    {
        Badge::all()->each(function ($badge) use ($learner) {

            if ($learner->badges->contains($badge)) return;

            if ($this->criteriaMet($badge, $learner)) {
                $learner->badges()->attach($badge->id, [
                    'awarded_at' => now()
                ]);
            }
        });
    }
    private function criteriaMet(Badge $badge, Student $learner): bool
    {
        return
            $this->checkCompetences($badge, $learner)
            && $this->checkBadges($badge, $learner)
            && $this->checkScore($badge, $learner);
    }

    private function checkCompetences(Badge $badge, Student $learner): bool
    {
        if (!$badge->required_competences) {
            return true;
        }

        foreach ($badge->required_competences as $competenceId => $requiredLevel) {

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
    private function checkBadges(Badge $badge, Student $learner): bool
    {
        if (!$badge->required_badges) {
            return true;
        }

        return collect($badge->required_badges)
            ->every(
                fn($badgeId) =>
                $learner->badges->contains('id', $badgeId)
            );
    }
    private function checkScore(Badge $badge, Student $learner): bool
    {
        if (!$badge->min_score) {
            return true;
        }

        $courseProgress = $learner->courseProgress
            ->where('course_id', $badge->course_id ?? null)
            ->first();

        return $courseProgress && $courseProgress->score >= $badge->min_score;
    }
}
