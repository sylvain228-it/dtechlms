<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    public function quize()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }
    public function answers()
    {
        return $this->hasMany(QuizAnswer::class);
    }
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    protected $fillable = [
        'quiz_id',
        'skill_id',

        // Contenu
        'question_text',
        'question_type',

        // Paramètres
        'points',
        'order',
        'is_mandatory',

        // Feedback
        'feedback_correct',
        'feedback_incorrect',
    ];
    protected $casts = [
        'points' => 'decimal:2',
        'is_mandatory' => 'boolean',
    ];
}
