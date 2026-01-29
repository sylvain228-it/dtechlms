<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Models\Course;
use App\Models\Domaine;
use App\Models\Module;
use App\Models\Sequence;
use App\Services\FileUploadService;
use App\Traits\AppUtilityTrait;
use App\Traits\TeacherTrait;
use App\Traits\UploadFileToCloudinaryTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherCoursController extends Controller
{
    use AppUtilityTrait;
    use TeacherTrait;
    use UploadFileToCloudinaryTrait;
    /**
     * Display a listing of the resource.
     */


    public function index()
    {
        $courses = Course::with(['modules', 'sequences'])->where('teacher_id', $this->teacher()->id)->get();
        return inertia('teachers/courses/index', [
            'courses' => $courses,
        ]);
    }
    public function create()
    {
        $domaines = Domaine::all();
        return inertia('teachers/courses/form', [
            'domaines' => $domaines,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseRequest $request, FileUploadService $uploader)
    {
        try {
            $request->merge([
                'syllabus' => $request->session()->get('text_syllabus'),
            ]);

            $course = new Course();

            // remplacer touts les champs nullables par des chaines vides
            // foreach ($request->all() as $key => $value) {
            //     if (is_null($value)) {
            //         $request->merge([$key => '']);
            //     }
            // }

            if ($request->hasFile('cover')) {
                $response = $uploader->upload($request->file('cover'), 'courses');
                $course->cover_public_id = $response['public_id'];
                $course->cover_url = $response['url'];
            }

            $course->title = $request->title;
            $course->slug = $this->uniqueSlug(Course::class, $request->title);
            $course->teacher_id = $this->teacher()->id;
            $course->price = $request->price;
            $course->level = $request->level;
            $course->language = $request->language;
            $course->academic_year = $request->academic_year;
            $course->course_type = $request->course_type;
            $course->total_hours = $request->total_hours;
            $course->estimated_days = $request->estimated_days;
            $course->estimated_weeks = $request->estimated_weeks;
            $course->description = $request->description;
            $course->modality = $request->modality;
            $course->start_date = $request->start_date;
            $course->is_free = $request->is_free;
            $course->domaine_id = $request->domaine_id ?? 1;
            $course->syllabus = $request->syllabus;
            $course->version = 1;
            $course->is_certifying = $request->is_certifying;
            $course->save();

            $request->session()->forget('text_syllabus');

            return to_route('teachers.courses.index')->with('success', "Cours ajoué avec succès");
        } catch (Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $course = Course::with(['modules', 'sequences', 'enrollments'])
            ->where('slug', $slug)
            ->where('teacher_id', $this->teacher()->id)
            ->firstOrFail();
        $modules = Module::where('course_id', $course->id)->get();
        $sequences = Sequence::whereIn('module_id', $modules->pluck('id'))->get();
        $enrollments = DB::table('enrollments')->whereIn('course_id', $course->pluck('id'))->count();
        return inertia('teachers/courses/details', [
            'course' => $course,
            'modules' => $modules,
            'sequences' => $sequences,
            'enrollments' => $enrollments,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $slug)
    {
        $domaines = Domaine::all();
        $course = Course::where('slug', $slug)->where('teacher_id', $this->teacher()->id)->firstOrFail();
        return inertia('teachers/courses/form', [
            'domaines' => $domaines,
            'course' => $course
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CourseRequest $request, string $id, FileUploadService $uploader)
    {
        try {
            $course = Course::where('id', $id)->where('teacher_id', $this->teacher()->id)->firstOrFail();
            $sessionkey = 'text_edit_syllabus';
            $request->merge([
                'syllabus' => $request->session()->get($sessionkey),
            ]);
            if ($request->hasFile('cover')) {
                if ($course->cover_public_id) {
                    $uploader->delete($course->cover_public_id);
                }
                $response = $uploader->upload($request->file('cover'), 'courses');

                $course->cover_public_id = $response['public_id'];
                $course->cover_url = $response['url'];
            }

            $course->title = $request->title;
            $course->slug = $this->uniqueSlug(Course::class, $request->title, $course->id);
            $course->teacher_id = $this->teacher()->id;
            $course->price = $request->price;
            $course->level = $request->level;
            $course->language = $request->language;
            $course->academic_year = $request->academic_year;
            $course->course_type = $request->course_type;
            $course->total_hours = $request->total_hours;
            $course->estimated_days = $request->estimated_days;
            $course->estimated_weeks = $request->estimated_weeks;
            $course->description = $request->description;
            $course->modality = $request->modality;
            $course->start_date = $request->start_date;
            $course->is_free = $request->is_free;
            $course->domaine_id = $request->domaine_id ?? 1;
            $course->syllabus = $request->syllabus;
            $course->is_certifying = $request->is_certifying;
            $course->update();

            $request->session()->forget($sessionkey);

            return to_route('teachers.courses.index')->with('success', "Cours modifié avec succès");
        } catch (Exception $e) {
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, FileUploadService $uploader)
    {
        try {
            $course = Course::where('id', $id)->where('teacher_id', $this->teacher()->id)->firstOrFail();
            $uploader->delete($course->cover_public_id);
            $course->soft;
            return to_route('teachers.courses.index')->with('success', "Cours Supprimé avec succès");
        } catch (Exception $e) {
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }

    // 


}
