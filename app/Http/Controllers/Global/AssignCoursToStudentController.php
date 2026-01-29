<?php

namespace App\Http\Controllers\Global;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\TeacherStudent;
use App\Traits\AppUtilityTrait;
use Illuminate\Http\Request;

class AssignCoursToStudentController extends Controller
{
    use AppUtilityTrait;
    public function searchStudent(Request $request, $courseSlug)
    {
        try {
            $cours = Course::where('slug', $courseSlug)->first();
            if (!$cours) {
                return response()->json(['message' => "Le cours est introuvable"], 400);
            }
            if (!isset($_GET['search_key']) || empty($_GET['search_key'])) {
                return response()->json(['message' => "Veillez entrer email, numéro ou numéro whatsapp"], 400);
            }
            $searchKey = $request->search_key;

            // Si téléphone (local ou international)
            if (filter_var($searchKey, FILTER_VALIDATE_EMAIL)) {
                $field = "email";
            } elseif ($normalizedPhone = $this->normalizePhoneNumber($searchKey)) {
                $field = "phone_number";
                $searchKey = $normalizedPhone;
            } else {
                $field = "whatsapp_number";
            }
            $student = Student::where($field, $searchKey)->first();
            if (!$student) {
                return response()->json(['message' => "Aucun étudiant trouvé avec ce critère"], 404);
            }
            $enrolled = Enrollment::where('course_id', $cours->id)->where('student_id', $student->id)->first();
            if ($enrolled) {
                return response()->json(['message' => "Cet étudiant à été déjà associé à ce cours"], 404);
            }
            return response()->json(['student' => $student], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => "Erreur quelques choses s'est mal passés : " . $e->getMessage()], 500);
        }
    }
    public function assignToStudent(Request $request, $courseSlug)
    {
        $data =  json_decode($request->getContent(), true);
        $request->merge($data);
        $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
        ]);
        try {
            $course = Course::where('slug', $courseSlug)->first();
            if (!$course) {
                return response()->json(['message' => "Le cours est introuvable"], 400);
            }
            $student = Student::find($request->student_id);
            if (!$student) {
                return response()->json(['message' => "Aucun étudiant trouvé avec ce critère"], 404);
            }
            $enrolled = Enrollment::where('course_id', $course->id)->where('student_id', $student->id)->first();
            if ($enrolled) {
                return response()->json(['message' => "Cet étudiant à été déjà associé à ce cours"], 404);
            }
            if (!$student) {
                return response()->json(['message' => "Etudiant non trouvé"], 404);
            }

            // assign student to cours
            Enrollment::create([
                'course_id' => $course->id,
                'student_id' => $student->id
            ]);
            TeacherStudent::create([
                'course_id' => $course->id,
                'student_id' => $student->id,
                'teacher_id' => $course->teacher_id
            ]);
            $course->increment('nb_of_enrollments');
            return response()->json(['message' => "L'étudiant à été associé à ce cours avec succès"], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => "Erreur quelques choses s'est mal passés : " . $e->getMessage()], 500);
        }
    }
}
