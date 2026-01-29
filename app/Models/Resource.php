<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        // Identification
        'title',
        'slug',
        'description',

        // Typologie de ressource
        'resource_type',

        // Support technique
        'storage_type',
        'file_path',
        'url',
        'url_public_id',
        'mime_type',
        'file_size',
        'file_ext',
        'duration_seconds',

        // Accessibilité pédagogique
        'language',
        'has_subtitles',
        'has_transcript',
        'accessibility_level',

        // Usage pédagogique
        'pedagogical_role',
        'is_mandatory',
        'is_downloadable',

        // Métadonnées pédagogiques
        'learning_objectives',
        'keywords',
        'tags',

        // Droits & licences
        'author',
        'source',
        'license',
        'notes',
        'access_instructions',
        'attribution',

        // Statut & gouvernance
        'status',
        'is_visible',

        // Versioning
        'version',
        'parent_id',
    ];
    protected $casts = [
        'learning_objectives' => 'array',
        'keywords' => 'array',
        'tags' => 'array',
        'has_subtitles' => 'boolean',
        'has_transcript' => 'boolean',
        'is_mandatory' => 'boolean',
        'is_downloadable' => 'boolean',
        'is_visible' => 'boolean',
        'file_size' => 'integer',
        'duration_seconds' => 'integer',
        'version' => 'integer',
    ];
    public function parent()
    {
        return $this->belongsTo(Resource::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Resource::class, 'parent_id');
    }

    public function activities()
    {
        return $this->belongsToMany(Activity::class);
    }
    public function sequences()
    {
        return $this->belongsToMany(Sequence::class);
    }
    public function modules()
    {
        return $this->belongsToMany(Module::class);
    }
    public function submiddions()
    {
        return $this->belongsToMany(Submission::class);
    }
    public function resource()
    {
        return $this->belongsToMany(Resource::class);
    }
    public function resources()
    {
        return $this->hasMany(Resource::class);
    }
}
