<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentFormRequest;
use App\Jobs\UploadFileJob;
use App\Models\Student;
use App\Models\User;
use App\Services\FileUploadService;
use App\Traits\TeacherTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TeacherEtudiantsController extends Controller
{
    use TeacherTrait;
    public function index()
    {
        $teacher = Auth::user();
        $etudiants = Student::where('institut_id', $teacher->id)->get();
        return inertia('teachers/etudiants/index', ['etudiants' => $etudiants]);
    }
    public function form()
    {
        return inertia('teachers/etudiants/form');
    }
    public function store(StudentFormRequest $request)
    {
        $teacher = Auth::user();
        $etudiants = new Student();
        $data = $request->validated();
        $etudiants->institut_id = $teacher->id;
        $etudiants->fill($data);
        // dd($etudiants);
        $etudiants->save();
        if (!empty($data['tmp_path'])) {
            $tmp = $data['tmp_path'];
            // si le tmp_path est un chemin stocké via Storage::disk('local')
            $exists = Storage::disk('local')->exists($tmp) || file_exists($tmp);

            if ($exists) {
                UploadFileJob::dispatch(
                    Student::class,
                    $tmp,
                    $etudiants->id,
                    'etudiants', // folder
                    'profile_picture_url', // url column
                    'profile_picture_public_id' // public id column
                );
            } else {
                Log::warning('UploadFileJob dispatch skipped: tmp file not found', ['tmp_path' => $tmp]);
            }
        }
        return redirect()->route('teachers.etudiants.index')
            ->with('success', 'Etudiant ajouté avec succès');
        // try {

        // } catch (\Exception $e) {
        //     return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        // }
    }
    public function show($id)
    {
        $teacher = Auth::user();
        $student = Student::with(['user'])->where('id', $id)->where('institut_id', $teacher->id)->firstOrFail();
        return inertia('teachers/etudiants/profile', ['student' => $student]);
    }
    public function edit($id)
    {
        $teacher = Auth::user();
        $etudiant = Student::where('id', $id)->where('institut_id', $teacher->id)->firstOrFail();
        return inertia('teachers/etudiants/form', ['etudiant' => $etudiant]);
    }
    public function update(StudentFormRequest $request, $id)
    {
        $teacher = Auth::user();
        $etudiants = Student::where('id', $id)->where('institut_id', $teacher->id)->firstOrFail();
        $data = $request->validated();
        $etudiants->institut_id = $teacher->id;
        $etudiants->fill($data);
        // dd($etudiants);
        $etudiants->update();
        // upload
        if (!empty($data['tmp_path'])) {
            $tmp = $data['tmp_path'];
            // si le tmp_path est un chemin stocké via Storage::disk('local')
            $exists = Storage::disk('local')->exists($tmp) || file_exists($tmp);

            if ($exists) {
                UploadFileJob::dispatch(
                    Student::class,
                    $tmp,
                    $etudiants->id,
                    'etudiants', // folder
                    'profile_picture_url', // url column
                    'profile_picture_public_id' // public id column
                );
            } else {
                Log::warning('UploadFileJob dispatch skipped: tmp file not found', ['tmp_path' => $tmp]);
            }
        }
        return redirect()->route('teachers.etudiants.index')
            ->with('success', 'Etudiant mise à jour avec succès');
        // try {

        // } catch (\Exception $e) {
        //     return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        // }
    }
    public function destroy($id, FileUploadService $uploader)
    {
        try {
            $teacher = Auth::user();
            $etudiants = Student::where('id', $id)->where('institut_id', $teacher->id)->firstOrFail();
            if ($etudiants->profile_picture_public_id) {
                $uploader->delete($etudiants->profile_picture_public_id);
            }
            $etudiants->delete();
            return to_route('teachers.etudiants.index')->with('success', "Etudiant Supprimé avec succès");
        } catch (\Exception $e) {
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }

    public function searchUser(Request $request)
    {
        try {
            // decode and validate request
            $data =  json_decode($request->getContent(), true);
            $request->merge($data);
            $request->validate([
                'search_key' => ['required', 'string', 'max:255'],
            ]);
            $searchKey = $request->input('search_key');
            $user = User::where('email', $searchKey)
                ->orWhere('phone_number', $searchKey)
                ->first();
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
            $teacher = Auth::user();
            $student = Student::where('id', $request->student_id)
                ->where('institut_id', $teacher->id)
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
