<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Skill extends Model
{
    use SoftDeletes;

    protected $fillable = [
        // Identification
        'code',
        'name',
        'description',

        // Structuration
        'sub_domaine_id',
        'domaine_id',
        'type',

        // Niveau et cadre
        'level_min',
        'level_max',
        'framework',

        // Gouvernance
        'is_active',
        'is_certifiable',

        // Versioning
        'version',
        'parent_id',

        // Métadonnées
        'language',
        'source',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_certifiable' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations utiles LMS
    |--------------------------------------------------------------------------
    */

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }
    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }
    public function modules()
    {
        return $this->belongsToMany(Module::class);
    }
    public function activities()
    {
        return $this->belongsToMany(Activity::class);
    }
    public function evaluationCriteria()
    {
        return $this->hasMany(EvaluationCriteria::class);
    }
    public function studentSkillResult()
    {
        return $this->hasMany(StudentSkillResult::class);
    }
    public function domaine()
    {
        return $this->belongsTo(Domaine::class, 'domaine_id');
    }
    public function subdomaine()
    {
        return $this->belongsTo(Domaine::class, 'sub_domaine_id');
    }
    public function quizzes()
    {
        return $this->morphMany(Quiz::class, 'quizzable');
    }
}
