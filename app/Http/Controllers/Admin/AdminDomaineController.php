<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DomaineRequest;
use App\Models\Domaine;
use App\Traits\AppUtilityTrait;
use Illuminate\Http\Request;

class AdminDomaineController extends Controller
{
    use AppUtilityTrait;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $domaines = Domaine::all();
        return inertia('admin/domaines/index', [
            'domaines' => $domaines,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $domaines = Domaine::all();
        return inertia('admin/domaines/create', [
            'domaines' => $domaines,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DomaineRequest $request)
    {
        $slug = $this->uniqueSlug(Domaine::class, $request->name);
        $isActive = $request->has('is_active') ? 1 : 0;
        $request->merge(['is_active' => $isActive]);
        $request->merge(['slug' => $slug]);
        Domaine::create($request->only('name', 'description', 'slug', 'is_active', 'Domaine_id'));
        return redirect()->route('admin.domaines.index')->with('success', 'Domaine créée avec succès.');
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
        $domaine = Domaine::findOrFail($id);
        $domaines = Domaine::all();
        return inertia('admin/domaines/index', [
            'domaines' => $domaines,
            'domaine' => $domaine,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DomaineRequest $request, string $id)
    {
        $Domaine = Domaine::findOrFail($id);
        $slug = $this->uniqueSlug(Domaine::class, $request->name, $id);
        $isActive = $request->has('is_active') ? 1 : 0;
        $request->merge(['is_active' => $isActive]);
        $request->merge(['slug' => $slug]);
        $Domaine->update($request->only('name', 'description', 'slug', 'is_active', 'Domaine_id'));
        return redirect()->route('admin.domaines.index')->with('success', 'Domaine modifiée avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $domaine = Domaine::findOrFail($id);
        $domaine->delete();
        return redirect()->route('admin.domaines.index')->with('success', 'Domaine supprimée avec succès.');
    }
}
