<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubmissionUpload extends Model
{

    protected $fillable = [
        'title',
        'activity_id',
        'submission_id',
        'requirement_id',
        'mime_type',
        'file_size',
        'file_ext',
        'url',
        'url_public_id'
    ];
    public function delivRequirement()
    {
        return $this->belongsTo(DeliverableRequirement::class, 'requirement_id');
    }
}
