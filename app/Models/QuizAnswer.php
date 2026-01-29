<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuizAnswer extends Model
{
    use SoftDeletes;
    public function question()
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }


    protected $fillable = [
        'quiz_question_id',

        // Contenu
        'answer_text',
        'is_correct',
        'order',

        // Numérique
        'numeric_value',
        'tolerance',
    ];
    protected $casts = [
        'is_correct' => 'boolean',
        'numeric_value' => 'decimal:2',
        'tolerance' => 'decimal:2',
    ];
}
