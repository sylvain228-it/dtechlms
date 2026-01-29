<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentModuleProgres extends Model
{
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
