<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quiz extends Model
{
    use SoftDeletes;
    public function quizzable()
    {
        return $this->morphTo();
    }
    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }
    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }
    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }
    public function calendarEvent()
    {
        return $this->morphOne(EventCalendar::class, 'eventable');
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function parentCourse()
    {
        return $this->belongsTo(Course::class, 'parent_course_id');
    }
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    protected $fillable = [
        'activity_id',
        'title',
        'slug',
        'description',
        'quize_instructions',
        'parent_course_id',

        // Paramètres pédagogiques
        'quiz_type',
        'time_limit_minutes',
        'max_attempts',
        'is_mandatory',

        // Comportement
        'shuffle_questions',
        'shuffle_answers',
        'show_results_immediately',
        'show_correct_answers',

        // Scoring
        'max_score',
        'success_threshold',

        'quizzable_type',
        'quizzable_id',
        'note_unit',
        // Publication
        'status',
        'published_at',

        // Versioning
        'version',
    ];
    protected $casts = [
        'is_mandatory' => 'boolean',
        'shuffle_questions' => 'boolean',
        'shuffle_answers' => 'boolean',
        'show_results_immediately' => 'boolean',
        'show_correct_answers' => 'boolean',
        'published_at' => 'datetime',
        'max_score' => 'decimal:2',
        'success_threshold' => 'decimal:2',
    ];
}
