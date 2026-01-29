<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntitySkill extends Model
{
    public function skill()
    {
        return $this->morphTo();
    }
}
