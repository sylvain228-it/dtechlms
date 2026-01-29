<?php

namespace App\Jobs;

use App\Services\FileUploadService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UploadFileJob implements ShouldQueue
{
    use Queueable;
    public $model;
    public $tmp_path;
    public $object_id;
    public $folder;
    public $url_col;
    public $public_id_col;

    /**
     * Create a new job instance.
     */
    public function __construct($model, $tmp_path, $object_id, $folder = "upload", $url_col, $public_id_col)
    {
        $this->model = $model;
        $this->tmp_path = $tmp_path;
        $this->object_id = $object_id;
        $this->url_col = $url_col;
        $this->public_id_col = $public_id_col;
        $this->folder = $folder;
    }

    /**
     * Execute the job.
     */
    public function handle(FileUploadService $uploader): void
    {
        // Guard clauses — s'assurer que les paramètres sont présents
        if (empty($this->tmp_path) || empty($this->object_id) || empty($this->model)) {
            Log::warning('UploadFileJob aborted: missing parameters', [
                'tmp_path' => $this->tmp_path,
                'object_id' => $this->object_id,
                'model' => $this->model,
            ]);
            $this->removeFromTmp();
            return;
        }

        try {
            Log::info('UploadFileJob starting upload', ['tmp_path' => $this->tmp_path, 'model' => $this->model, 'object_id' => $this->object_id]);
            $model = $this->model;
            $object = $model::find($this->object_id);
            // save upload_status to server session 
            $cacheKey = "upload_status";

            if (!$object) {
                Log::warning('UploadFileJob: target object not found', ['model' => $this->model, 'id' => $this->object_id]);
                Cache::put($cacheKey, 'failed', now()->addMinutes(5));
                $this->removeFromTmp();
                return;
            }
            $columnId = $this->public_id_col;
            $columnUrl = $this->url_col;
            Cache::put($cacheKey, 'in_progress', now()->addMinutes(10));
            // récupérer l'ancien public id en sécurité
            $oldPublicId = data_get($object, $columnId);

            if (!empty($oldPublicId)) {
                try {
                    $uploader->delete($oldPublicId);
                    Log::info('UploadFileJob: old public id deleted', ['public_id' => $oldPublicId]);
                } catch (\Exception $e) {
                    Log::error('UploadFileJob: error deleting old public id', ['public_id' => $oldPublicId, 'error' => $e->getMessage()]);
                    // on continue quand même
                }
            }

            // effectuer l'upload depuis le tmp
            $response = $uploader->uploadFromTmp($this->tmp_path, $this->folder);

            if (!is_array($response) || !isset($response['url'], $response['public_id'])) {
                Log::error('UploadFileJob: uploadFromTmp returned invalid response', ['response' => $response]);
                Cache::put($cacheKey, 'failed', now()->addMinutes(5));
                $this->removeFromTmp();
                return;
            }

            // Mise à jour atomique du modèle
            $object->update([
                $columnUrl => $response['url'],
                $columnId  => $response['public_id'],
                'upload_status' => 'completed',
            ]);

            Log::info('UploadFileJob: model updated', ['model' => $this->model, 'id' => $this->object_id, 'url' => $response['url']]);

            // Supprimer le fichier temporaire : essayer Storage puis file_exists
            $this->removeFromTmp();
            Cache::put($cacheKey, 'completed', now()->addMinutes(5));
        } catch (\Exception $e) {
            $this->removeFromTmp();
            Log::error('UploadFileJob upload error : ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            Cache::put($cacheKey, 'failed', now()->addMinutes(5));
        }
    }
    public function removeFromTmp()
    {
        try {
            if (Storage::disk('local')->exists($this->tmp_path)) {
                Storage::disk('local')->delete($this->tmp_path);
                Log::info('UploadFileJob: tmp file deleted from local disk', ['tmp_path' => $this->tmp_path]);
            } elseif (file_exists($this->tmp_path)) {
                @unlink($this->tmp_path);
                Log::info('UploadFileJob: tmp file deleted with unlink', ['tmp_path' => $this->tmp_path]);
            } else {
                Log::debug('UploadFileJob: tmp file not found for deletion', ['tmp_path' => $this->tmp_path]);
            }
        } catch (\Exception $e) {
            Log::warning('UploadFileJob: could not delete tmp file', ['tmp_path' => $this->tmp_path, 'error' => $e->getMessage()]);
        }
    }
}
