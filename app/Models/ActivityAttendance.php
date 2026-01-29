<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityAttendance extends Model
{
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
