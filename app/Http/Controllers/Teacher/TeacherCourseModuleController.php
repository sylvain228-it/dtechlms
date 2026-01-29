<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModuleRequest;
use App\Models\Course;
use App\Models\Module;
use App\Traits\AppUtilityTrait;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherCourseModuleController extends Controller
{
    use TeacherTrait;
    use AppUtilityTrait;
    /**
     * Display a listing of the resource.
     */
    public function index($courseSlug)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $modules = Module::with(['course', 'sequences'])->where('course_id', $course->id)->get();
        return Inertia::render('teachers/courses/modules/index', [
            'modules' => $modules,
            'course' => $course,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($courseSlug)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $lastModule = Module::where('course_id', $course->id)->orderByDesc('order')->first();
        $newOrder = 1;
        if ($lastModule) {
            $newOrder = $lastModule->order + 1;
        }
        return Inertia::render('teachers/courses/modules/form', [
            'course' => $course,
            'newOrder' => $newOrder,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ModuleRequest $request, $courseSlug)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();

        $data = $request->validated();
        $data = array_merge($data, [
            'syllabus' => $request->session()->get('text_syllabus'),
            'slug' => $this->uniqueSlug(Module::class, $request->title),
            'course_id' => $course->id,
            'version' => 1,
        ]);

        $module = new Module();
        $module->fill($data);
        $module->save();
        $course->increment('nb_modules');
        $request->session()->forget('text_syllabus');
        return to_route('teachers.modules.index', $course->slug)->with('success', 'Module ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $courseSlug, string $id,)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $module = Module::with(['course', 'sequences'])->where('id', $id)->where('course_id', $course->id)->first();
        return Inertia::render('teachers/courses/modules/show', [
            'module' => $module
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $courseSlug, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $id)->where('course_id', $course->id)->first();
        return Inertia::render('teachers/courses/modules/form', [
            'course' => $course,
            'module' => $module
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ModuleRequest $request, string $courseSlug, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $data = $request->validated();
        $module = Module::where('id', $id)->where('course_id', $course->id)->first();
        $data = array_merge($data, [
            'syllabus' => $request->session()->get('text_edit_syllabus'),
            'slug' => $this->uniqueSlug(Module::class, $request->title, $module->id),
            'course_id' => $course->id,
        ]);
        $module->fill($data);
        $module->update();
        $request->session()->forget('text_edit_syllabus');
        return redirect()->route('teachers.modules.index', $course->slug)->with('success', 'Module mise à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $courseSlug, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        $module = Module::where('id', $id)->where('course_id', $course->id)->first();
        $module->delete();
        return redirect()->route('teachers.modules.index', $course->slug)->with('success', 'Module supprimé avec succès');
    }
}
