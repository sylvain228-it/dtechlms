<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    public function student()
    {
        return $this->belongsToMany(StudentBadge::class);
    }
}
