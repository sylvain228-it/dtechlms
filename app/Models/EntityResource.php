<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntityResource extends Model
{
    public function entitytable()
    {
        return $this->morphTo();
    }
    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }
}
