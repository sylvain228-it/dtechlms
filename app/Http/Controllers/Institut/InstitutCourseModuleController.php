<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModuleRequest;
use App\Models\Course;
use App\Models\Module;
use App\Traits\InstitutTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitutCourseModuleController extends Controller
{
    use InstitutTrait;
    /**
     * Display a listing of the resource.
     */
    public function index($courseSlug)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $modules = Module::with(['course', 'sequences'])->where('course_id', $course->id)->get();
        return Inertia::render('instituts/courses/modules/index', [
            'modules' => $modules,
            'course' => $course,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($courseSlug)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $lastModule = Module::where('course_id', $course->id)->orderByDesc('order')->first();
        $newOrder = 1;
        if ($lastModule) {
            $newOrder = $lastModule->order + 1;
        }
        return Inertia::render('instituts/courses/modules/form', [
            'course' => $course,
            'newOrder' => $newOrder,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ModuleRequest $request, $courseSlug)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $data = $request->validated();
        $module = new Module();
        $module->fill($data);
        $module->save();
        return redirect()->route('institut.courses.modules.index', $course->slug)->with('success', 'Module ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $courseSlug, string $id,)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $id)->where('course_id', $course->id)->first();
        return Inertia::render('instituts/courses/modules/show', [
            'module' => $module
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $courseSlug, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $module = Module::with(['course'])->where('id', $id)->where('course_id', $course->id)->first();
        return Inertia::render('instituts/courses/modules/form', [
            'course' => $course,
            'module' => $module
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ModuleRequest $request, string $courseSlug, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $data = $request->validated();
        $module = Module::where('id', $id)->where('course_id', $course->id)->first();
        $module->fill($data);
        $module->update();
        return redirect()->route('institut.courses.modules.index', $course->slug)->with('success', 'Module mise à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $courseSlug, string $id)
    {
        $course = Course::where('slug', $courseSlug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $module = Module::where('id', $id)->where('course_id', $course->id)->first();
        $module->delete();
        return redirect()->route('institut.courses.modules.index', $course->slug)->with('success', 'Module supprimé avec succès');
    }
}
