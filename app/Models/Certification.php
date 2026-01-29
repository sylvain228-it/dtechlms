<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    public function student()
    {
        return $this->belongsToMany(StudentCertification::class);
    }
}
