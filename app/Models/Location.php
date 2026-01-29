<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'name',
        'address',
        'address_line',
        'city',
        'cover_url',
        'cover_public_id',
        'state',
        'country',
        'maps_url',
        'latitude',
        'longitude',
    ];
}
