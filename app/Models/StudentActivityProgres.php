<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentActivityProgres extends Model
{
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}
