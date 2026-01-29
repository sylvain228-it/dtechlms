<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'type',
        'title',
        'data',
        'notifiable_type',
        'notifiable_id',
        'is_read',
        'is_notified',
    ];

    public function notifiable()
    {
        return $this->morphTo();
    }
}
