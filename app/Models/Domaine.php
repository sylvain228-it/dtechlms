<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Domaine extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'slug', 'admin_id', 'domaine_id', 'is_active', 'cover_url', 'cover_id',];
    public function subdomaines()
    {
        return $this->hasMany(Domaine::class);
    }
    public function parentdomaines()
    {
        return $this->belongsTo(Domaine::class);
    }

    protected $casts = [
        'is_active' => 'boolean'
    ];
}
