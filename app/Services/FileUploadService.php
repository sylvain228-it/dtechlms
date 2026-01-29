<?php

namespace App\Services;

use App\Traits\UploadFileToCloudinaryTrait;

class FileUploadService
{
    use UploadFileToCloudinaryTrait;

    public function upload($file, string $folder = "uploads")
    {
        return $this->uploadToCloudinary($file, $folder);
    }
    public function uploadFromTmp($file, string $folder = "uploads")
    {
        return $this->uploadFromTmpToCloudinary($file, $folder);
    }

    public function delete(string $publicId)
    {
        return $this->deleteFromCloudinary($publicId);
    }
}
