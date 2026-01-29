<?php

namespace App\Http\Controllers\Institut;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Models\Domaine;
use App\Models\Course;
use App\Services\FileUploadService;
use App\Traits\AppUtilityTrait;
use App\Traits\InstitutTrait;
use App\Traits\UploadFileToCloudinaryTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InstitutCoursController extends Controller
{
    use AppUtilityTrait;
    use InstitutTrait;
    use UploadFileToCloudinaryTrait;
    /**
     * Display a listing of the resource.
     */


    public function index()
    {
        $courses = Course::with(['modules', 'sequences'])->where('institut_id', $this->getAuthInstitut()->id)->get();
        return inertia('instituts/courses/index', [
            'courses' => $courses,
        ]);
    }
    public function create()
    {
        $domaines = Domaine::all();
        return inertia('instituts/courses/form', [
            'domaines' => $domaines,
        ]);
    }

    public function coursesToSession(Request $request)
    {
        // save html content to session
        $key = $request->input('coursId') == 0 ? 'course_syllabus' : 'course_edit_syllabus';
        $request->session()->put($key, $request->input('syllabus'));
        return response()->json(['message' => 'Syllabus saved to session']);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseRequest $request, FileUploadService $uploader)
    {
        try {
            $request->merge([
                'syllabus' => $request->session()->get('course_syllabus'),
            ]);

            $course = new Course();

            if ($request->hasFile('cover')) {
                try {
                    $response = $uploader->upload($request->file('cover'), 'courses');
                    $course->cover_public_id = $response['public_id'];
                    $course->cover_url = $response['url'];
                } catch (\Exception $e) {
                }
            }

            $course->title = $request->title;
            $course->public_targ = $request->public_targ;
            $course->slug = $this->uniqueSlug(Course::class, $request->title);
            $course->institut_id = $this->getAuthInstitut()->id;
            $course->price = $request->price;
            $course->duration_days = $request->duration_days;
            $course->description = $request->description;
            $course->outcomes = $request->outcomes;
            $course->domaine_id = $request->domaine_id;
            $course->syllabus = $request->syllabus;
            $course->save();

            $request->session()->forget('course_syllabus');

            return to_route('institut.courses.index')->with('success', "Cours ajoué avec succès");
        } catch (Exception $e) {
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $course = Course::with(['modules', 'sequences', 'teachers', 'students'])
            ->where('slug', $slug)
            ->where('institut_id', $this->getAuthInstitut()->id)
            ->firstOrFail();
        // list of available partner teachers to associate
        $partnerTeachers = DB::table('teachers')->select('teachers.*')->where('teachers.institut_id', $this->getAuthInstitut()->id)->get();

        return inertia('instituts/courses/details', [
            'course' => $course,
            'partnerTeachers' => $partnerTeachers,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $slug)
    {
        $domaines = Domaine::all();
        $course = Course::where('slug', $slug)->where('institut_id', $this->getAuthInstitut()->id)->firstOrFail();
        return inertia('instituts/courses/form', [
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
            $course = Course::where('id', $id)->where('institut_id', $this->getAuthInstitut()->id)->firsOrFail();
            $Sessionkey = 'course_edit_syllabus';
            $request->merge([
                'syllabus' => $request->session()->get($Sessionkey),
            ]);

            if ($request->hasFile('cover')) {
                try {
                    if ($course->cover_public_id) {
                        $uploader->delete($course->cover_public_id);
                    }
                    $response = $uploader->upload($request->file('cover'), 'courses');

                    $course->cover_public_id = $response['public_id'];
                    $course->cover_url = $response['url'];
                } catch (\Exception $e) {
                    dd($e->getMessage());
                }
            }

            $course->title = $request->title;
            $course->public_targ = $request->public_targ;
            $course->slug = $this->uniqueSlug(Course::class, $request->title, $id);
            $course->institut_id = $this->getAuthInstitut()->id;
            $course->price = $request->price;
            $course->duration_days = $request->duration_days;
            $course->description = $request->description;
            $course->outcomes = $request->outcomes;
            $course->domaine_id = $request->domaine_id;
            $course->syllabus = $request->syllabus;
            $course->update();

            $request->session()->forget($Sessionkey);

            return to_route('institut.courses.index')->with('success', "Cours modifié avec succès");
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
            $course = Course::where('id', $id)->where('institut_id', $this->getAuthInstitut()->id)->firsOrFail();
            $uploader->delete($course->cover_public_id);
            $course->delete();
            return to_route('institut.courses.index')->with('success', "Cours Supprimé avec succès");
        } catch (Exception $e) {
            return redirect()->back()->with("error", "Erreur quelques choses s'est mal passés");
        }
    }

    // 


}
