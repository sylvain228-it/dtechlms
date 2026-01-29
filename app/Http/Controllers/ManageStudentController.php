<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentFormRequest;
use App\Jobs\UploadFileJob;
use App\Models\Institut;
use App\Models\Student;
use App\Models\User;
use App\Services\FileUploadService;
use App\Traits\AppUtilityTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ManageStudentController extends Controller
{
    use AppUtilityTrait;
    protected $institutId;
    protected $teacherId;
    public function __construct()
    {
        if (Auth::check() && Auth::user()->account_role == "teacher") {
            $this->institutId = User::findOrFail(Auth::id())->institut_id;
            $this->teacherId = Auth::id();
        } else if (Auth::guard('institut')) {
            $this->institutId = Auth::guard('institut')->id();
        } else {
            abort(403, "Interdit");
        }
    }
    public function redirectToDashboard()
    {
        if (Auth::guard('institut')) {
            return to_route('institut.dashboard');
        } else if (Auth::check() && Auth::user()->account_role == "teacher") {
            return to_route('teachers.dashboard');
        } else {
            abort(403, "Interdit");
        }
    }
    public function index()
    {
        $etudiants = Student::all();
        return inertia('gest-students/index', ['etudiants' => $etudiants]);
    }
    public function create()
    {
        return inertia('gest-students/form');
    }
    public function store(StudentFormRequest $request)
    {
        $etudiants = new Student();
        $data = $request->validated();
        $etudiants->institut_id = $this->institutId;
        $etudiants->fill($data);
        if ($request->user_id && User::find($request->user_id)) {
            $user = User::find($request->user_id);
            // update user role to teacher
            $user->account_role = 'student';
            $user->update();
        }
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
        return redirect()->route('geststudents.index')
            ->with('success', 'Etudiant ajouté avec succès');
        // try {

        // } catch (\Exception $e) {
        //     return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        // }
    }
    public function show($id)
    {
        $student = Student::with(['user'])->where('id', $id)->where('institut_id', $this->institutId)->firstOrFail();
        return inertia('gest-students/profile', ['student' => $student]);
    }
    public function edit($id)
    {
        $etudiant = Student::where('id', $id)->where('institut_id', $this->institutId)->firstOrFail();
        return inertia('gest-students/form', ['etudiant' => $etudiant]);
    }
    public function update(StudentFormRequest $request, $id)
    {
        $etudiants = Student::where('id', $id)->where('institut_id', $this->institutId)->firstOrFail();
        $data = $request->validated();
        $etudiants->fill($data);
        // dd($etudiants);
        $etudiants->update();
        if ($request->user_id && User::find($request->user_id)) {
            $user = User::find($request->user_id);
            // update user role to teacher
            $user->account_role = 'student';
            $user->update();
        }
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
        return redirect()->route('geststudents.index')
            ->with('success', 'Etudiant mise à jour avec succès');
        // try {

        // } catch (\Exception $e) {
        //     return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        // }
    }
    public function destroy($id, FileUploadService $uploader)
    {
        try {
            $etudiants = Student::where('id', $id)->where('institut_id', $this->institutId)->firstOrFail();
            if ($etudiants->profile_picture_public_id) {
                $uploader->delete($etudiants->profile_picture_public_id);
            }
            $etudiants->delete();
            return to_route('geststudents.index')->with('success', "Etudiant Supprimé avec succès");
        } catch (\Exception $e) {
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
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);
        try {
            $student = Student::where('id', $request->student_id)
                ->where('institut_id', $this->institutId)
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
