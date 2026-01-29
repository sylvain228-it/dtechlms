<?php

namespace App\Http\Controllers\Global;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResourceRequest;
use App\Jobs\UploadFileJob;
use App\Models\EntityResource;
use App\Models\Resource;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\HttpCache\Store;

class ResourceController extends Controller
{
    use \App\Traits\AppUtilityTrait;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allMedias = Resource::all();
        return Inertia::render('medias/index', ['allMedias' => $allMedias]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('medias/upload');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResourceRequest $request)
    {
        $data = $request->validated();
        $resp = $this->uploadResource($data);
        if ($resp['success']) {
            return redirect()->route('medias.index')->with('success', 'Ressource ajouté avec succès');
        } else {
            return redirect()->route('medias.index')
                ->with('error', "Erreur lors de l'upload de la ressource");
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreResourceRequest $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function uploadResource($data, $media = null)
    {
        try {
            $resource = $media == null ? new Resource() : $media;
            $path_dir = "resources";
            switch ($data['resource_type']) {
                case 'video':
                    $path_dir = "$path_dir/videos";
                    break;
                case 'audio':
                    $path_dir = "$path_dir/audio";
                    break;
                case 'document':
                    $path_dir = "$path_dir/document";
                    break;
                case 'image':
                    $path_dir = "$path_dir/images";
                    break;
                default:
                    $path_dir = "resources";
            }
            $data = array_merge($data, [
                'slug' => $this->uniqueSlug(Resource::class, $data['title'], $media == null ? 0 : $media->id),
            ]);
            if ($media != null) {
                $data['url'] = $media->url;
                $data['url_public_id'] = $media->url_public_id;
            }
            $resource->fill($data);
            // dd($resource);
            $media == null ?  $resource->save() : $resource->update();
            if (!empty($data['tmp_path'])) {
                $tmp = $data['tmp_path'];
                // si le tmp_path est un chemin stocké via Storage::disk('local')
                $exists = Storage::disk('local')->exists($tmp) || file_exists($tmp);

                if ($exists) {
                    if ($media != null) {
                        if ($media->url_public_id) {
                            $uploader = new FileUploadService();
                            $uploader->delete($media->url_public_id);
                        }
                    }
                    UploadFileJob::dispatch(
                        Resource::class,
                        $tmp,
                        $resource->id,
                        $path_dir, // folder
                        'url', // url column
                        'url_public_id' // public id column
                    );
                } else {
                    Log::warning('UploadFileJob dispatch skipped: tmp file not found', ['tmp_path' => $tmp]);
                }
            }
            return ['resource_id' => $resource->id, 'success' => true];
        } catch (\Exception $e) {
            Log::error('Error uploading resource: ' . $e->getMessage());
            return ['success' => false];
        }
    }
    public function entityTypeId($entityType, $entityId)
    {
        if ($this->parseModel($entityType) === null) {
            return 0;
        }
        if (is_numeric($entityId) && intval($entityId) > 0) {
            $object = $this->parseModel($entityType)::find(intval($entityId));
            if ($object) {
                return $object->id;
            }
            return 0;
        }
        return 0;
    }

    public function entityResources($entityType, $entityId)
    {
        if ($this->parseModel($entityType) === null) {
            return abort(404, 'Donnée invalide');
        }
        $object = $this->parseModel($entityType)::find($entityId);
        if (!$object) {
            return redirect()->back()->with('error', "Entité non trouvée");
        }

        $entityResources = $object->resources()->with(['resource'])->orderByDesc('created_at')->get();
        // dd($entityResources);
        return Inertia::render('medias/index', ['entityResources' => $entityResources, 'entity_type' => $entityType, 'entity_id' => $entityId]);
    }
    public function createEntityResource($entityType, $entityId)
    {
        return Inertia::render('medias/upload', ['entity_type' => $entityType, 'entity_id' => $entityId]);
    }

    public function storeEntityResource(StoreResourceRequest $request, $entityType, $entityId)
    {
        $entityResource = new EntityResource();
        $data = $request->validated();
        $resp = $this->uploadResource($data);
        if (!$resp['success']) {
            return redirect()->route('medias.entityResources', [$entityType, $entityId])
                ->with('error', "Erreur lors de l'upload de la ressource");
        }
        $resource_id = $resp['resource_id'];
        if ($this->entityTypeId($entityType, $entityId) !== 0) {
            $entityId = $this->entityTypeId($entityType, $entityId);
            $entityResource->resource_id = $resource_id;
            $entityResource->entity_type = $entityType;
            $entityResource->entity_id = $entityId;
            $entityResource->entitytable_type = $this->entityModelPath($entityType);
            $entityResource->entitytable_id = $entityId;
            $entityResource->role = $data['pedagogical_role'];
            $entityResource->is_mandatory = $data['is_mandatory'] ?? false;
            $entityResource->is_visible = $data['is_visible'] ?? false;
            $entityResource->save();
        }
        return redirect()->route('medias.entityResources', [$entityType, $entityId])
            ->with('success', 'Ressource ajouté avec succès');
    }

    public function editEntityResource($slug, $entityType, $entityId)
    {
        EntityResource::where('entity_type', $entityType)->where('entity_id', $entityId)->firstOrFail();
        $media = Resource::where('slug', $slug)->firstOrFail();
        return Inertia::render('medias/upload', ['media' => $media, 'entity_type' => $entityType, 'entity_id' => $entityId]);
    }

    public function updateEntityResource(StoreResourceRequest $request, $mediaId, $entityType, $entityId)
    {
        $data = $request->validated();
        $media = Resource::findOrFail($mediaId);
        $entityResource = EntityResource::where('resource_id', $media->id)->where('entity_type', $entityType)->where('entity_id', $entityId)->firstOrFail();
        $resp = $this->uploadResource($data, $media);
        if (!$resp['success']) {
            return redirect()->route('medias.entityResources', [$entityType, $entityId])
                ->with('error', "Erreur lors de l'upload de la ressource");
        }
        $resource_id = $resp['resource_id'];
        if ($this->entityTypeId($entityType, $entityId) !== 0) {
            $entityId = $this->entityTypeId($entityType, $entityId);
            $entityResource->resource_id = $resource_id;
            $entityResource->entity_type = $entityType;
            $entityResource->entity_id = $entityId;
            $entityResource->entitytable_type = $this->entityModelPath($entityType);
            $entityResource->entitytable_id = $entityId;
            $entityResource->role = $data['pedagogical_role'];
            $entityResource->is_mandatory = $data['is_mandatory'] ?? false;
            $entityResource->is_visible = $data['is_visible'] ?? false;
            $entityResource->update();
        }
        return redirect()->route('medias.entityResources', [$entityType, $entityId])
            ->with('success', 'Ressource mise à jour avec succès');
    }
    public function deleteEntityResource($mediaId, $entityType, $entityId, FileUploadService $uploader)
    {
        $media = Resource::findOrFail($mediaId);
        $entityResource = EntityResource::where('resource_id', $media->id)->where('entity_type', $entityType)->where('entity_id', $entityId)->firstOrFail();
        $entityResource->delete();
        if ($media->url_public_id != null) {
            $uploader->delete($media->url_public_id);
        }
        $media->delete();
        return redirect()->route('medias.entityResources', [$entityType, $entityId])
            ->with('success', 'Ressource supprimé avec succès');
    }

    public function viewPdf($slug)
    {
        $media = Resource::where('slug', $slug)->firstOrFail();
        return inertia('medias/pdf-viewer', ['pdf_url' => $media->url]);
    }
}
