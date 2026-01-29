<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrUpdateSkillRequest;
use App\Models\Domaine;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $skills = Skill::all();
        return Inertia::render('teachers/skills/index', ['skills' => $skills]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $domaines = Domaine::with('subdomaines')->where('domaine_id', null)->get();
        return Inertia::render('teachers/skills/form', ['domaines' => $domaines]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrUpdateSkillRequest $request)
    {
        $validated = $request->validated();
        $data = $validated;
        $data['code'] = strtolower($validated['code']);
        $data['version'] = $validated['version'] ?? 1;

        Skill::create($data);

        return redirect()->route('teachers.skills.index')
            ->with('success', 'Compétence créée avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code)
    {
        $skill = Skill::with(['domaine', 'subdomaine'])->where('code', $code)->firstOrFail();
        return Inertia::render('teachers/skills/show', ['skill' => $skill]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $code)
    {
        $domaines = Domaine::with('subdomaines')->where('domaine_id', null)->get();
        $skill = Skill::where('code', $code)->firstOrFail();
        return Inertia::render('teachers/skills/form', ['skill' => $skill, 'domaines' => $domaines]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreOrUpdateSkillRequest $request, string $id)
    {
        $validated = $request->validated();
        $skill = Skill::findOrFail($id);

        $data = $validated;
        $data['code'] = strtolower($validated['code']);
        $skill->update($data);
        return redirect()->route('teachers.skills.index')
            ->with('success', 'Compétence mise à jour.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $skill = Skill::where('id', $id)->orWhere('code', $id)->firstOrFail();
        $skill->delete();

        return redirect()->route('teachers.skills.index')->with('success', 'Compétence supprimée.');
    }
}
