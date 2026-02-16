<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliverableRequirement extends Model
{
    protected $fillable = [
        'activity_id',
        'order',
        'title',
        'file_type',
        'allowed_file_type',
        'max_size_mb',
    ];
    public function submissionUploads()
    {
        return $this->hasMany(SubmissionUpload::class);
    }
}
