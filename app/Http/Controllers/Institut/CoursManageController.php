<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
use App\Traits\InstitutTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CoursManageController extends Controller
{
    use InstitutTrait;
    // 
    // 
    public function index()
    {
        $courses = Course::with(['teacher', 'modules.sequences'])->orderBy('created_at', 'desc')->get();
        return inertia('instituts/course/index', ['courses' => $courses]);
    }
    public function details($slug)
    {
        $course = Course::with(['teacher', 'modules.sequences.activities'])->where('slug', $slug)->firstOrFail();
        return inertia('instituts/course/details', ['course' => $course]);
    }
    public function content($slug)
    {
        $course = Course::with(['teacher', 'modules.sequences.activities'])->where('slug', $slug)->firstOrFail();
        return inertia('instituts/course/content', ['course' => $course]);
    }
    // student
    public function enrolled($courseId)
    {
        $course = Course::with(['students'])->where('slug', $courseId)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        $institutStudents = DB::table('students')->select('students.*')
            ->leftJoin('enrollments', function ($join) use ($course) {
                $join->on('students.id', '=', 'enrollments.student_id')
                    ->where('enrollments.course_id', '=', $course->id);
            })
            ->where('students.institut_id', $this->getAuthInstitut()->id)
            ->whereNull('enrollments.id')
            ->get();
        return inertia('instituts/courses/enrollment/index', [
            'course' => $course,
            'institutStudents' => $institutStudents,
        ]);
    }
    public function enrollment(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('institut_id', $this->getAuthInstitut()->id)
            ->firstOrFail();
        $institut = $this->getAuthInstitut();
        $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
        ]);

        $student = Student::where('id', $request->student_id)->where('institut_id', $institut->id)->first();
        if (!$student) {
            return redirect()->back()->with('error', 'Etudiant non trouvé pour ce partenaire');
        }

        // Attach teacher to course if not already attached
        $exists = Enrollment::where('course_id', $course->id)->where('student_id', $student->id)->exists();
        if (!$exists) {
            Enrollment::create([
                'course_id' => $course->id,
                'student_id' => $student->id,
                'enrolled_at' => $student->enrollment_date
            ]);
            return redirect()->back()->with('success', "Etudiant associé au cours avec succès");
        }

        return redirect()->back()->with('error', "Etudiant déjà associé au cours");
    }
    public function unlinkStudent(Request $request, $courseId)
    {
        $institut = $this->getAuthInstitut();
        $course = Course::where('id', $courseId)
            ->where('institut_id', $institut->id)
            ->firstOrFail();
        $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
        ]);

        $student = Student::where('id', $request->student_id)->where('institut_id', $institut->id)->first();
        if (!$student) {
            return redirect()->back()->with('error', 'Etudiant non trouvé pour ce partenaire');
        }

        $exist = Enrollment::where('course_id', $course->id)->where('student_id', $student->id)->first();
        if ($exist) {
            $exist->delete();
            return redirect()->back()->with('success', "Etudiant détaché au cours avec succès");
        }

        return redirect()->back()->with('error', "Erreur quelques choses s'est mal passés");
    }
}
