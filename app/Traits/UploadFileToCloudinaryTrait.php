<?php

namespace App\Traits;

use Cloudinary\Api\Upload\UploadApi as UploadUploadApi;
use Cloudinary\Configuration\Configuration;
use Illuminate\Support\Facades\Log;

trait UploadFileToCloudinaryTrait
{
    protected function initCloudinary()
    {
        // Configuration::instance([
        //     'cloud' => [
        //         'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        //         'api_key'    => env('CLOUDINARY_API_KEY'),
        //         'api_secret' => env('CLOUDINARY_API_SECRET'),
        //     ],
        //     'url' => [
        //         'secure' => true
        //     ]
        // ]);
        Configuration::instance([
            'cloud' => [
                'cloud_name' => 'dw7w4n0ga',
                'api_key'    => '336168958161874',
                'api_secret' => 'VuMDsb-_1VAwLOsV5Iu8odcEGFA',
            ],
            'url' => [
                'secure' => true
            ]
        ]);
        // dd(Configuration::instance());
    }

    public function uploadToCloudinary($file, string $folder = 'uploads')
    {
        if (!$file) {
            throw new \Exception("No file provided for upload.");
        }

        $this->initCloudinary();

        $upload = (new UploadUploadApi())->upload(
            $file->getRealPath(),
            ['folder' => $folder]
        );

        return [
            'public_id' => $upload['public_id'] ?? null,
            'url'       => $upload['secure_url'] ?? null,
            'format'    => $upload['format'] ?? null,
        ];
    }


    public function uploadFromTmpToCloudinary($tmp_path, string $folder = 'uploads'): array
    {
        if (!$tmp_path) {
            throw new \Exception("No file provided for upload.");
        }

        $fullPath = storage_path('app/private/' . $tmp_path);
        if (!file_exists($fullPath)) {
            throw new \Exception("File not found: {$fullPath}");
        }

        try {
            $this->initCloudinary();

            // Detect mime type and choose resource type
            $finfoMime = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $fullPath);
            $type = explode('/', $finfoMime)[0] ?? 'application';

            // Default to auto, but prefer explicit for videos/raw
            $resourceType = match ($type) {
                'image' => 'image',
                'video' => 'video',
                'application' => 'raw',
                default => 'raw',
            };

            // For large video files you may want uploadLarge / chunked upload
            $options = [
                'folder' => $folder,
                'resource_type' => $resourceType,
                'use_filename' => true,
                'unique_filename' => true,
            ];

            $upload = (new UploadUploadApi())->upload($fullPath, $options);

            return [
                'public_id' => $upload['public_id'] ?? null,
                'url'       => $upload['secure_url'] ?? $upload['url'] ?? null,
                'format'    => $upload['format'] ?? null,
                'resource_type' => $resourceType,
            ];
        } catch (\Exception $e) {
            Log::error("Cloudinary upload error: " . $e->getMessage());
            throw $e; // ou return [] selon ton style
        }
    }

    public function deleteFromCloudinary($publicId)
    {
        $this->initCloudinary();
        try {
            $response = (new UploadUploadApi())->destroy($publicId);

            return $response;
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
