<?php

namespace App\Traits;

use App\Models\Prerequisite;

trait HasPrerequisites
{
    public function prerequisites()
    {
        return $this->morphMany(Prerequisite::class, 'entity');
    }
}
