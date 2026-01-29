<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Http\Requests\Institut\InstitutProfileRequest;
use App\Models\Institut;
use App\Services\FileUploadService;
use App\Traits\AppUtilityTrait;
use App\Traits\InstitutTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProfileInstitutController extends Controller
{
    use AppUtilityTrait;
    use InstitutTrait;
    public function profile()
    {
        return Inertia::render('instituts/profile/index');
    }
    public function editProfile()
    {
        return Inertia::render('instituts/profile/edit');
    }
    public function update(InstitutProfileRequest $request)
    {
        try {
            $institut = $this->getAuthInstitut();
            $slug = $this->uniqueSlug(Institut::class, $request->name, $institut->id);
            $request->merge(['slug' => $slug]);
            $data = $request->validated();

            foreach (['website_url', 'email', 'contact_email', 'tel', 'phone_number', 'address', 's_address', 'country', 'city', 'born_date'] as $field) {
                if (array_key_exists($field, $data) && $data[$field] === '') {
                    $data[$field] = null;
                }
            }

            try {
                DB::transaction(function () use ($institut, $data) {
                    $institut->fill($data);
                    $institut->save();
                });

                return redirect()->route('institut.profile.index')->with('success', 'Profil mis à jour avec succès.');
            } catch (\Throwable $e) {
                return redirect()->back()->withErrors(['update' => 'Une erreur est survenue lors de la mise à jour.'])->withInput();
            }
        } catch (Exception $e) {
        }
    }
    public function updateLogo(Request $request, FileUploadService $uploader)
    {
        $request->validate([
            ['cover' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2000']],
            ['logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2000']]
        ]);
        $institut = $this->getAuthInstitut();
        if ($request->hasFile('cover')) {
            try {
                if ($institut->cover_public_id) {
                    $uploader->delete($institut->cover_public_id);
                }
                $response = $uploader->upload($request->file('cover'), 'institut');
                $institut->cover_public_id = $response['public_id'];
                $institut->cover_url = $response['url'];
                $institut->update();
                return redirect()->route('institut.profile.index')->with('success', 'Photo profile mis à jour avec succès.');
            } catch (\Exception $e) {
                dd($e->getMessage());
            }
        } else if ($request->hasFile('logo')) {
            try {
                if ($institut->logo_public_id) {
                    $uploader->delete($institut->logo_public_id);
                }
                $response = $uploader->upload($request->file('logo'), 'institut');
                $institut->logo_public_id = $response['public_id'];
                $institut->logo_url = $response['url'];
                $institut->update();
                return redirect()->route('institut.profile.index')->with('success', 'Photo profile mis à jour avec succès.');
            } catch (\Exception $e) {
                dd($e->getMessage());
            }
        }
        return redirect()->route('institut.profile.index');
    }
}
