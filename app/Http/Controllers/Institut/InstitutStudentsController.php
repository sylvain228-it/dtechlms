<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentFormRequest;
use App\Jobs\UploadFileJob;
use App\Models\Student;
use App\Models\User;
use App\Services\FileUploadService;
use App\Traits\AppUtilityTrait;
use App\Traits\InstitutTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class InstitutStudentsController extends Controller
{
    use InstitutTrait, AppUtilityTrait;
    public function index()
    {
        $institut = $this->getAuthInstitut();
        $students = Student::where('institut_id', $institut->id)->get();
        return inertia('instituts/students/index', ['students' => $students]);
    }
    public function create()
    {
        return inertia('instituts/students/form');
    }
    public function store(StudentFormRequest $request)
    {
        $institut = $this->getAuthInstitut();
        $student = new Student();
        $data = $request->validated();
        $phone = $this->normalizePhoneNumber(ltrim($request->phone_number));
        if ($phone != null && Student::where('phone_number', $phone)->first()) {
            throw ValidationException::withMessages([
                'phone_number' => ['Le numéro de téléphone existe déjà.'],
            ]);
        }
        $whatsapp = $this->normalizePhoneNumber(ltrim($request->whatsapp_number));
        if ($whatsapp != null && Student::where('whatsapp_number', $whatsapp)->first()) {
            throw ValidationException::withMessages([
                'whatsapp_number' => ['Le numéro de téléphone whatsapp existe déjà.'],
            ]);
        }

        $student->institut_id = $institut->id;
        $data['phone_number'] = $phone;
        $data['whatsapp_number'] = $whatsapp;
        if (!empty($data['user_id'])) {
            $user = User::where('id', $request->user_id)->first();
            $user->account_role = 'student';
            $user->update();
        } else if ($data['create_new_user'] == 1 || $data['create_new_user'] === true) {
            $username = substr(strtolower(explode('@', $data['email'])[0]), 0, 13);
            $user = User::create([
                'username' => $username,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'account_role' => 'student',
                'password' => Hash::make($data['phone_number']),
            ]);
            $data['user_id'] = $user->id;
        }
        $student->fill($data);
        $student->save();
        if (!empty($data['tmp_path'])) {
            $tmp = $data['tmp_path'];
            // si le tmp_path est un chemin stocké via Storage::disk('local')
            $exists = Storage::disk('local')->exists($tmp) || file_exists($tmp);

            if ($exists) {
                UploadFileJob::dispatch(
                    Student::class,
                    $tmp,
                    $student->id,
                    'etudiants', // folder
                    'profile_picture_url', // url column
                    'profile_picture_public_id' // public id column
                );
            } else {
                Log::warning('UploadFileJob dispatch skipped: tmp file not found', ['tmp_path' => $tmp]);
            }
        }
        return redirect()->route('institut.students.index')
            ->with('success', 'Etudiant ajouté avec succès');
        // try {

        // } catch (\Exception $e) {
        //     return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        // }
    }
    public function show($id)
    {
        $institut = $this->getAuthInstitut();
        $student = Student::with(['user'])->where('id', $id)->where('institut_id', $institut->id)->firstOrFail();
        return inertia('instituts/students/profile', ['student' => $student]);
    }
    public function edit($id)
    {
        $institut = $this->getAuthInstitut();
        $student = Student::where('id', $id)->where('institut_id', $institut->id)->firstOrFail();
        return inertia('instituts/students/form', ['student' => $student]);
    }
    public function update(StudentFormRequest $request, $id)
    {
        $institut = $this->getAuthInstitut();
        $student = Student::where('id', $id)->where('institut_id', $institut->id)->firstOrFail();
        $data = $request->validated();
        $phone = $this->normalizePhoneNumber(ltrim($request->phone_number));
        if ($phone != null && Student::where('phone_number', $phone)->whereNot('id', $student->id)->first()) {
            throw ValidationException::withMessages([
                'phone_number' => ['Le numéro de téléphone existe déjà.'],
            ]);
        }
        $whatsapp = $this->normalizePhoneNumber(ltrim($request->whatsapp_number));
        if ($whatsapp != null && Student::where('whatsapp_number', $whatsapp)->whereNot('id', $student->id)->first()) {
            throw ValidationException::withMessages([
                'whatsapp_number' => ['Le numéro de téléphone whatsapp existe déjà.'],
            ]);
        }

        $student->institut_id = $institut->id;
        $data['phone_number'] = $phone;
        $data['whatsapp_number'] = $whatsapp;
        if (!empty($data['user_id'])) {
            $user = User::where('id', $request->user_id)->first();
            $user->account_role = 'student';
            $user->update();
        } else if ($data['create_new_user'] == 1 || $data['create_new_user'] === true) {
            $username = substr(strtolower(explode('@', $data['email'])[0]), 0, 13);
            $user = User::create([
                'username' => $username,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'account_role' => 'student',
                'password' => Hash::make($data['phone_number']),
            ]);
            $data['user_id'] = $user->id;
        }
        $student->fill($data);
        // dd($student);
        $student->update();
        // upload
        if (!empty($data['tmp_path'])) {
            $tmp = $data['tmp_path'];
            // si le tmp_path est un chemin stocké via Storage::disk('local')
            $exists = Storage::disk('local')->exists($tmp) || file_exists($tmp);

            if ($exists) {
                UploadFileJob::dispatch(
                    Student::class,
                    $tmp,
                    $student->id,
                    'etudiants', // folder
                    'profile_picture_url', // url column
                    'profile_picture_public_id' // public id column
                );
            } else {
                Log::warning('UploadFileJob dispatch skipped: tmp file not found', ['tmp_path' => $tmp]);
            }
        }
        return redirect()->route('institut.students.index')
            ->with('success', 'Etudiant mise à jour avec succès');
        // try {

        // } catch (\Exception $e) {
        //     return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        // }
    }
    public function destroy($id, FileUploadService $uploader)
    {
        try {
            $institut = $this->getAuthInstitut();
            $student = Student::where('id', $id)->where('institut_id', $institut->id)->firstOrFail();
            if ($student->profile_picture_public_id) {
                $uploader->delete($student->profile_picture_public_id);
            }
            $student->delete();
            return to_route('institut.students.index')->with('success', "Etudiant Supprimé avec succès");
        } catch (\Exception $e) {
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }

    public function searchUser(Request $request)
    {
        try {
            // decode and validate request
            if (!isset($_GET['search_key']) || empty($_GET['search_key'])) {
                return response()->json(['message' => "Veillez entrer email, numéro ou numéro whatsapp"], 422);
            }
            $searchKey = $request->search_key;
            if ($normalizedPhone = $this->normalizePhoneNumber($searchKey)) {
                $field = "phone_number";
                $searchKey = $normalizedPhone;
            } else if (filter_var($searchKey, FILTER_VALIDATE_EMAIL)) {
                $field = "email";
            } else {
                $field = 'username';
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
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);
        try {
            $institut = $this->getAuthInstitut();
            $student = Student::where('id', $request->student_id)
                ->where('institut_id', $institut->id)
                ->first();
            if (!$student) {
                return response()->json(['message' => "Etudiant non trouvé"], 404);
            }
            $user = User::where('id', $request->user_id)->first();
            if (!$user) {
                return response()->json(['message' => "Utilisateur non trouvé"], 404);
            }
            if ($user->account_role !== 'guest') {
                return response()->json(['message' => "L'utilisateur n'est pas un utilisateur simple"], 400);
            }
            // update user role to teacher
            $user->account_role = 'student';
            $user->update();
            // assign student to user
            $student->user_id = $user->id;
            $student->update();
            return response()->json(['message' => "Le profile de l'étudiant a été assigné à l'utilisateur avec succès"], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => "Erreur quelques choses s'est mal passés : " . $e->getMessage()], 500);
        }
    }
}
