<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrUpdateLoactionRequest;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = Location::orderBy('created_at', 'desc')->get();
        return inertia('instituts/locations/index', [
            'locations' => $locations,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('instituts/locations/form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrUpdateLoactionRequest $request)
    {
        $data = $request->validated();
        Location::create($data);
        return redirect()->route('institut.locations.index')
            ->with('success', 'Emplacement créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $location = Location::findOrFail($id);
        return inertia('instituts/locations/show', [
            'location' => $location,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $location = Location::findOrFail($id);
        return inertia('instituts/locations/form', [
            'location' => $location,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreOrUpdateLoactionRequest $request, string $id)
    {
        $data = $request->validated();
        $location = Location::findOrFail($id);
        $location->update($data);
        return redirect()->route('institut.locations.index')
            ->with('success', 'Emplacement mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $location = Location::findOrFail($id);
        $location->delete();
        return redirect()->route('institut.locations.index')
            ->with('success', 'Emplacement supprimé avec succès.');
    }
}
