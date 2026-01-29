<?php

namespace App\Models;

use App\Traits\HasPrerequisites;
use Dom\Entity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use SoftDeletes, HasPrerequisites;
    protected $fillable = [
        'title',
        'description',
        'domaine_id',
        'syllabus',
        'start_date',
        'end_date',
        'cover_url',
        'price',
        'institut_id',
        'teacher_id',
        'nb_of_enrollments',
        'nb_modules',
        'nb_sequences'

    ];

    // Define relationships and other model methods as needed
    public function institut()
    {
        return $this->belongsTo(Institut::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    // Other relationships like category, sessions, etc. can be defined here
    public function domaine()
    {
        return $this->belongsTo(Domaine::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }
    public function sequences()
    {
        return $this->hasManyThrough(Sequence::class, Module::class);
    }
    public function activities()
    {
        return $this->hasManyThrough(Activity::class, Sequence::class);
    }

    public function skills()
    {
        return $this->morphMany(EntitySkill::class, 'entityskilltable');
    }
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
    public function evaluations()
    {
        return $this->morphMany(Evaluation::class, 'evaluable');
    }
    public function quizzes()
    {
        return $this->morphMany(Quiz::class, 'quizzable');
    }
    public function resources()
    {
        return $this->morphMany(EntityResource::class, 'entitytable');
    }
    public function studentCourseProgres()
    {
        return $this->hasMany(StudentCourseProgres::class);
    }
}
