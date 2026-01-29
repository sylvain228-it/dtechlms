<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Http\Requests\SequenceRequest;
use App\Jobs\UploadFileJob;
use App\Models\Course;
use App\Models\Module;
use App\Models\Sequence;
use App\Services\FileUploadService;
use App\Traits\InstitutTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InstitutModuleSequenceController extends Controller
{
    use InstitutTrait;
    /**
     * Display a listing of the resource.
     */
    public function index($courseSlug, $moduleId)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->firstOrFail();
        $sequences = Sequence::with(['module.course'])->where('module_id', $module->id)->get();
        return Inertia::render('instituts/courses/sequences/index', [
            'module' => $module,
            'sequences' => $sequences,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($courseSlug, $moduleId)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->firstOrFail();
        $lastSequence = Sequence::where('module_id', $module->id)->orderByDesc('order')->first();
        $newOrder = 1;
        if ($lastSequence) {
            $newOrder = $lastSequence->order + 1;
        }
        return Inertia::render('instituts/courses/sequences/form', [
            'module' => $module,
            'newOrder' => $newOrder,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SequenceRequest $request, $courseSlug, $moduleId)
    {
        $partner = $this->getAuthInstitut();
        $course = Course::where('slug', $courseSlug)->where('institut_id', $partner->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->firstOrFail();
        $sequence = new Sequence();
        $data = $request->validated();
        $path_dir = "sequences";
        switch ($data['sequence_type']) {
            case 'video':
                $path_dir = "$path_dir/videos";
                break;
            case 'audio':
                $path_dir = "$path_dir/audio";
                break;
            case 'document':
                $path_dir = "$path_dir/document";
                break;
            default:
                $path_dir = "sequences";
        }
        $sequence->module_id = $module->id;
        $sequence->fill($data);
        // dd($sequence);
        $sequence->save();
        if (!empty($data['tmp_path'])) {
            $tmp = $data['tmp_path'];
            // si le tmp_path est un chemin stocké via Storage::disk('local')
            $exists = Storage::disk('local')->exists($tmp) || file_exists($tmp);

            if ($exists) {
                UploadFileJob::dispatch(
                    Sequence::class,
                    $tmp,
                    $sequence->id,
                    $path_dir, // folder
                    'lesson_url', // url column
                    'lesson_public_id' // public id column
                );
            } else {
                Log::warning('UploadFileJob dispatch skipped: tmp file not found', ['tmp_path' => $tmp]);
            }
        }
        return redirect()->route('institut.courses.modules.sequences.index', [$course->slug, $module->id])
            ->with('success', 'Séquence ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show($courseSlug, $moduleId, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->first();
        $sequence = Sequence::with(['module.course'])->where('id', $id)->where('module_id', $module->id)->first();
        return Inertia::render('instituts/courses/sequences/show', [
            'sequence' => $sequence,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($courseSlug, $moduleId, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->first();
        $sequence = Sequence::where('id', $id)->where('module_id', $module->id)->first();
        return Inertia::render('instituts/courses/sequences/form', [
            'course' => $course,
            'module' => $module,
            'sequence' => $sequence
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SequenceRequest $request, $courseSlug, $moduleId, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->first();
        $sequence = Sequence::where('id', $id)->where('module_id', $module->id)->first();
        $data = $request->validated();
        $path_dir = "squences";
        switch ($data['sequence_type']) {
            case 'video':
                $path_dir = "$path_dir/videos";
                break;
            case 'audio':
                $path_dir = "$path_dir/audio";
                break;
            case 'document':
                $path_dir = "$path_dir/document";
                break;
            default:
                $path_dir = "squences";
        }
        $sequence->module_id = $module->id;
        $sequence->fill($data);
        // dd($sequence);
        $sequence->update();
        if (!empty($data['tmp_path'])) {
            $tmp = $data['tmp_path'];
            // si le tmp_path est un chemin stocké via Storage::disk('local')
            $exists = Storage::disk('local')->exists($tmp) || file_exists($tmp);

            if ($exists) {
                UploadFileJob::dispatch(
                    Sequence::class,
                    $tmp,
                    $sequence->id,
                    $path_dir, // folder
                    'sequence_url', // url column
                    'sequence_public_id' // public id column
                );
            } else {
                Log::warning('UploadFileJob dispatch skipped: tmp file not found', ['tmp_path' => $tmp]);
            }
        }
        return redirect()->route('institut.courses.modules.sequences.index', [$course->slug, $module->id])
            ->with('success', 'Lecture modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FileUploadService $uploader, $courseSlug, $moduleId, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->first();
        $sequence = Sequence::where('id', $id)->where('module_id', $module->id)->first();
        if ($sequence->lesson_public_id) {
            $uploader->delete($sequence->lesson_public_id);
        }
        $sequence->delete();
        return redirect()->route('institut.courses.modules.sequences.index', [$course->slug, $module->id])->with('success', 'Séquence supprimé avec succès');
    }
}
