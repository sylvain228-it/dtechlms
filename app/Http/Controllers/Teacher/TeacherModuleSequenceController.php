<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\SequenceRequest;
use App\Jobs\UploadFileJob;
use App\Models\Course;
use App\Models\Module;
use App\Models\Sequence;
use App\Services\FileUploadService;
use App\Traits\AppUtilityTrait;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeacherModuleSequenceController extends Controller
{
    use TeacherTrait;
    use AppUtilityTrait;
    /**
     * Display a listing of the resource.
     */
    public function index($courseSlug, $moduleId)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->firstOrFail();
        $sequences = Sequence::with(['activities', 'module.course'])->where('module_id', $module->id)->get();
        return Inertia::render('teachers/courses/sequences/index', [
            'module' => $module,
            'sequences' => $sequences,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($courseSlug, $moduleId)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->firstOrFail();
        $lastSequence = Sequence::where('module_id', $module->id)->orderByDesc('order')->first();
        $newOrder = 1;
        if ($lastSequence) {
            $newOrder = $lastSequence->order + 1;
        }
        return Inertia::render('teachers/courses/sequences/form', [
            'module' => $module,
            'newOrder' => $newOrder,
            'c_modality' => $course->modality
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SequenceRequest $request, $courseSlug, $moduleId)
    {
        $institut = $this->teacher();
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $institut->id)->firstOrFail();
        $module = Module::where('id', $moduleId)->where('course_id', $course->id)->firstOrFail();
        $sequence = new Sequence();
        $data = $request->validated();
        $sequence->module_id = $module->id;
        $data = array_merge($data, [
            'syllabus' => $request->session()->get('text_syllabus'),
            'slug' => $this->uniqueSlug(Sequence::class, $request->title),
            'version' => 1,
            'course_id' => $module->course_id,

        ]);
        $sequence->fill($data);
        $sequence->save();
        $course->increment('nb_sequences');
        $request->session()->forget('text_syllabus');
        return redirect()->route('teachers.sequences.index', [$course->slug, $module->id])
            ->with('success', 'Séquence ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show($courseSlug, $moduleId, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $module = Module::where('id', $moduleId)->where('course_id', $course->id)->first();
        $sequence = Sequence::with(['module.course'])->where('id', $id)->where('module_id', $module->id)->first();
        return Inertia::render('teachers/courses/sequences/show', [
            'sequence' => $sequence,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($courseSlug, $moduleId, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $moduleId)->where('course_id', $course->id)->first();
        $sequence = Sequence::where('id', $id)->where('module_id', $module->id)->first();
        return Inertia::render('teachers/courses/sequences/form', [
            'course' => $course,
            'module' => $module,
            'sequence' => $sequence,
            'c_modality' => $course->modality
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SequenceRequest $request, $courseSlug, $moduleId, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $module = Module::where('id', $moduleId)->where('course_id', $course->id)->first();
        $sequence = Sequence::where('id', $id)->where('module_id', $module->id)->first();
        $data = $request->validated();
        $sequence->module_id = $module->id;
        $data = array_merge($data, [
            'syllabus' => $request->session()->get('text_edit_syllabus'),
            'slug' => $this->uniqueSlug(Sequence::class, $request->title, $sequence->id),
            'course_id' => $module->course_id,

        ]);
        $sequence->fill($data);
        $sequence->update();
        $request->session()->forget('text_edit_syllabus');
        return redirect()->route('teachers.sequences.index', [$course->slug, $module->id])
            ->with('success', 'Séquence modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FileUploadService $uploader, $courseSlug, $moduleId, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $module = Module::where('id', $moduleId)->where('course_id', $course->id)->first();
        $sequence = Sequence::where('id', $id)->where('module_id', $module->id)->first();
        $sequence->delete();
        return redirect()->route('teachers.sequences.index', [$course->slug, $module->id])->with('success', 'Séquence supprimé avec succès');
    }
}
