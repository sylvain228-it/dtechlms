<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Http\Requests\TeacherFormRequest;
use App\Models\Institut;
use App\Models\Teacher;
use App\Models\User;
use App\Services\FileUploadService;
use App\Traits\AppUtilityTrait;
use App\Traits\InstitutTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class InstitutTeachersController extends Controller
{
    use InstitutTrait;
    use AppUtilityTrait;
    public function index()
    {
        $institut = $this->getAuthInstitut();
        $teachers = Teacher::where('institut_id', $institut->id)->get();
        return inertia('instituts/teachers/index', ['teachers' => $teachers]);
    }
    public function form()
    {
        return inertia('instituts/teachers/form');
    }
    public function store(TeacherFormRequest $request, FileUploadService $uploader)
    {

        $institut = $this->getAuthInstitut();
        $data = $request->validated();
        $teacher = new Teacher();
        $phone = $this->normalizePhoneNumber(ltrim($request->phone_number));
        if ($phone != null && Teacher::where('phone_number', $phone)->first()) {
            throw ValidationException::withMessages([
                'phone_number' => ['Le numéro de téléphone existe déjà.'],
            ]);
        }
        $whatsapp = $this->normalizePhoneNumber(ltrim($request->whatsapp_number));
        if ($whatsapp != null && Teacher::where('whatsapp_number', $whatsapp)->first()) {
            throw ValidationException::withMessages([
                'whatsapp_number' => ['Le numéro de téléphone whatsapp existe déjà.'],
            ]);
        }
        try {
            $teacher->institut_id = $institut->id;
            $data['specialties'] = json_encode($data['specialties']);
            $data['phone_number'] = $phone;
            $data['whatsapp_number'] = $whatsapp;
            if (!empty($data['user_id'])) {
                $user = User::where('id', $request->user_id)->first();
                $user->account_role = 'teacher';
                $user->update();
            } else if ($data['create_new_user'] == 1 || $data['create_new_user'] === true) {
                $username = substr(strtolower(explode('@', $data['email'])[0]), 0, 13);
                $user = User::create([
                    'username' => $username,
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'email' => $data['email'],
                    'account_role' => 'teacher',
                    'password' => Hash::make($data['phone_number']),
                ]);
                $data['user_id'] = $user->id;
            }
            $teacher->fill($data);
            $teacher->save();
            return redirect()->route('institut.teachers.index')
                ->with('success', 'Enseignant ajouté avec succès');
        } catch (\Exception $e) {
            Log::error("Erreur d'enregistrement enseignant :: " . $e->getMessage());
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }
    public function show($id)
    {
        $institut = $this->getAuthInstitut();
        $teacher = Teacher::with(['user'])->where('id', $id)->where('institut_id', $institut->id)->firstOrFail();
        return inertia('instituts/teachers/profile', ['teacher' => $teacher]);
    }
    public function edit($id)
    {
        $institut = $this->getAuthInstitut();
        $teacher = Teacher::where('id', $id)->where('institut_id', $institut->id)->firstOrFail();
        return inertia('instituts/teachers/form', ['teacher' => $teacher]);
    }
    public function update(TeacherFormRequest $request, $id, FileUploadService $uploader)
    {

        $institut = $this->getAuthInstitut();
        $teacher = Teacher::where('id', $id)->where('institut_id', $institut->id)->firstOrFail();
        $data = $request->validated();
        $phone = $this->normalizePhoneNumber(ltrim($request->phone_number));
        if ($phone != null && Teacher::where('phone_number', $phone)->where('id', '!=', $teacher->id)->first()) {
            throw ValidationException::withMessages([
                'phone_number' => ['Le numéro de téléphone existe déjà.'],
            ]);
        }
        $whatsapp = $this->normalizePhoneNumber(ltrim($request->whatsapp_number));
        if ($whatsapp != null && Teacher::where('whatsapp_number', $whatsapp)->where('id', '!=', $teacher->id)->first()) {
            throw ValidationException::withMessages([
                'whatsapp_number' => ['Le numéro de téléphone whatsapp existe déjà.'],
            ]);
        }
        try {
            $data['phone_number'] = $phone;
            $data['whatsapp_number'] = $whatsapp;
            $data['specialties'] = json_encode($data['specialties']);
            if ($teacher->user_id == null || $teacher->user_id == '') {
                if (!empty($data['user_id'])) {
                    $user = User::where('id', $request->user_id)->first();
                    $user->account_role = 'teacher';
                    $user->update();
                } else if ($data['create_new_user'] == 1 || $data['create_new_user'] === true) {
                    $username = substr(strtolower(explode('@', $data['email'])[0]), 0, 13);
                    $user = User::create([
                        'username' => $username,
                        'first_name' => $data['first_name'],
                        'last_name' => $data['last_name'],
                        'email' => $data['email'],
                        'account_role' => 'teacher',
                        'password' => Hash::make($data['phone_number']),
                    ]);
                    $data['user_id'] = $user->id;
                }
            }
            $teacher->fill($data);
            // dd($teacher);
            $teacher->update();
            return redirect()->route('institut.teachers.index')
                ->with('success', 'Enseignant mise à jour avec succès');
        } catch (\Exception $e) {
            Log::error("Erreur de mise à jour enseignant :: " . $e->getMessage());
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }
    public function destroy($id, FileUploadService $uploader)
    {
        try {
            $institut = $this->getAuthInstitut();
            $teacher = Teacher::where('id', $id)->where('institut_id', $institut->id)->firstOrFail();
            if ($teacher->profile_picture_public_id) {
                $uploader->delete($teacher->profile_picture_public_id);
            }
            if ($teacher->user_id) {
                $user = User::find($teacher->user_id);
                $user->account_role = 'guest';
                $user->update();
            }
            $teacher->delete();
            return to_route('institut.teachers.index')->with('success', "Enseignant Supprimé avec succès");
        } catch (\Exception $e) {
            Log::error("Erreur de suppression d'enseignant :: " . $e->getMessage());
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }
    public function searchUser(Request $request)
    {
        try {
            if (!isset($_GET['search_key']) || empty($_GET['search_key'])) {
                return response()->json(['message' => "Veillez entrer email, numéro ou nom d'utilisateur"], 400);
            }
            $searchKey = $request->search_key;

            // Si téléphone (local ou international)
            if (filter_var($searchKey, FILTER_VALIDATE_EMAIL)) {
                $field = "email";
            } elseif ($normalizedPhone = $this->normalizePhoneNumber($searchKey)) {
                $field = "phone_number";
                $searchKey = $normalizedPhone;
            } else {
                $field = "username";
            }
            $user = User::where($field, $searchKey)->first();
            if (!$user) {
                return response()->json(['message' => "Aucun utilisateur trouvé avec ce critère"], 404);
            } else if ($user->account_role !== 'guest') {
                return response()->json(['message' => "L'utilisateur trouvé n'est pas un utilisateur simple"], 400);
            }
            return response()->json(['user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => "Erreur quelques choses s'est mal passés : " . $e->getMessage()], 500);
        }
    }
    public function assignToUser(Request $request)
    {
        $data =  json_decode($request->getContent(), true);
        $request->merge($data);
        $request->validate([
            'teacher_id' => ['required', 'integer', 'exists:teachers,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);
        try {
            $institut = $this->getAuthInstitut();
            $teacher = Teacher::where('id', $request->teacher_id)
                ->where('institut_id', $institut->id)
                ->first();
            if (!$teacher) {
                return response()->json(['message' => "Enseignant non trouvé"], 404);
            }
            $user = User::where('id', $request->user_id)->first();
            if (!$user) {
                return response()->json(['message' => "Utilisateur non trouvé"], 404);
            }
            if ($user->account_role !== 'guest') {
                return response()->json(['message' => "L'utilisateur n'est pas un utilisateur simple"], 400);
            }
            // update user role to teacher
            $user->account_role = 'teacher';
            $user->update();
            // assign teacher to user
            $teacher->user_id = $user->id;
            $teacher->update();
            return response()->json(['message' => "Le profile de l'enseignant a été assigné à l'utilisateur avec succès"], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => "Erreur quelques choses s'est mal passés : " . $e->getMessage()], 500);
        }
    }
}
