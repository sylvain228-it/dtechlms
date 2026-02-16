<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmissionRequest;
use App\Jobs\UploadFileJob;
use App\Models\Submission;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Student;
use App\Models\SubmissionUpload;
use App\Services\FileUploadService;
use App\Traits\StudentTrait;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentSubmissionController extends Controller
{
    use AuthorizesRequests, StudentTrait;
    protected  $studentCoursesIds;
    /**
     * Display a listing of submissions for the authenticated student.
     */
    public function __construct()
    {
        $this->studentCoursesIds = $this->studentsCoursesIds();
    }
    public function index()
    {
        $studentId = Student::where('user_id', Auth::id())->value('id');
        // Récupérer toutes les soumissions de l'étudiant avec relations
        $submissions = Submission::where('student_id', $studentId)->with(['activity'])
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('students/submissions/index', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Show the form for creating a new submission.
     */
    public function create($slug)
    {

        $activity = Activity::with('delivRequirements')->whereIn('parent_course_id', $this->studentCoursesIds)->where('slug', $slug)->firstOrFail();

        // Vérifier que l'étudiant est inscrit au cours
        $studentId = Student::where('user_id', Auth::id())->value('id');

        // Vérifier si une soumission existe déjà
        $existingSubmission = Submission::where('student_id', $studentId)
            ->where('activity_id', $activity->id)
            ->first();

        // Si une soumission existe et n'est pas 'graded' ou resubmission non autorisée
        if (
            $existingSubmission
            && $existingSubmission->status === 'graded'
            && !$activity->allows_resubmission
        ) {
            return redirect()->route('students.activities.submissions.show', $existingSubmission->id)
                ->with('error', 'Cette activité a déjà été évaluée et ne peut pas être re-soumise.');
        }
        $data = [
            'activity' => $activity,
            'isResubmission' => !!$existingSubmission,
        ];
        if ($existingSubmission) {
            $data['submission'] = $existingSubmission;
            $data['submissionUploads'] = $existingSubmission->submissionUploads;
            $data['activity'] = $activity;
        }

        return Inertia::render('students/submissions/form', $data);
    }

    /**
     * Store a newly created submission in storage.
     */
    public function store(SubmissionRequest $request, $activityId, FileUploadService $uploader)
    {
        $validated = $request->validated();
        $studentId = Student::where('user_id', Auth::id())->value('id');
        try {
            $activityId = $validated['activity_id'];

            $activity = Activity::with('delivRequirements')->whereIn('parent_course_id', $this->studentCoursesIds)->findOrFail($activityId);


            // Vérifier si une soumission antérieure existe
            $existingSubmission = Submission::where('student_id', $studentId)
                ->where('activity_id', $activityId)
                ->first();

            // Si soumission antérieure avec statut 'graded' et pas de resubmission autorisée
            if (
                $existingSubmission
                && $existingSubmission->status === 'graded'
                && !$activity->allows_resubmission || ($activity->allows_resubmission && $existingSubmission->nb_attempt >= $activity->max_attempts)
            ) {
                return back()->with('message', 'Cette activité a déjà été évaluée et ne peut pas être re-soumise.');
            }

            // Vérifier si la date limite est dépassée
            $deadline = $activity->deliverable_deadline
                ? new \DateTime($activity->deliverable_deadline)
                : null;
            $now = new \DateTime();
            $isLate = $deadline && $now > $deadline;

            // Si soumission tardive non autorisée
            if ($isLate && !$activity->allow_late_submission) {
                return back()->with('error', 'La date limite est dépassée et les soumissions tardives ne sont pas autorisées.');
            }


            // Préparer les données
            $submissionData = [
                'student_id' => $studentId,
                'activity_id' => $activityId,
                'parent_course_id' => $activity->parent_course_id,
                'title' => $validated['title'] ?? null,
                'description' => $validated['description'] ?? null,
                'status' => 'submitted',
                'submitted_at' => now(),
                'late_submission' => $isLate,
            ];

            if ($existingSubmission) {
                $submissionData['nb_attempt'] = $existingSubmission->nb_attempt + 1;
                $existingSubmission->update($submissionData);
                $message = 'Activité re-soumise avec succès.';
            } else {
                $submission = Submission::create($submissionData);
                $message = 'Activité soumise avec succès.';
            }
            $submission = $existingSubmission ?? $submission; // Utiliser la soumission existante ou la nouvelle soumission créée
            // Traiter les fichiers uploadés
            $uploadedList = json_decode($validated['uploaded_list'], true);
            if (is_array($uploadedList) && !empty($uploadedList)) {
                foreach ($uploadedList as $item) {
                    $item = array_merge(['activity_id' => $activityId, 'submission_id' => $submission->id], $item);
                    // Sauvegarder le fichier dans le storage
                    $path_dir = "activity/submission";
                    if ($existingSubmission) {
                        $submissionUploaded = SubmissionUpload::where('submission_id', $existingSubmission->id)->where('activity_id', $activityId)->where('requirement_id', $item['requirement_id'])->first();
                        if ($submissionUploaded) {
                            // Si c'est une resubmission, supprimer les fichiers précédents
                            if ($existingSubmission->submissionUploads) {
                                foreach ($existingSubmission->submissionUploads as $upload) {
                                    if ($upload->url_public_id != null) {
                                        $uploader->delete($upload->url_public_id);
                                    }
                                }
                            }
                            $submissionUploaded->update($item);
                        } else {
                            $submissionUploaded = SubmissionUpload::create($item);
                        }
                    } else {
                        $submissionUploaded = SubmissionUpload::create($item);
                    }
                    UploadFileJob::dispatch(
                        SubmissionUpload::class,
                        $item['tmp_path'],
                        $submissionUploaded->id,
                        $path_dir, // folder
                        'url', // url column
                        'url_public_id' // public id column
                    );
                }
            }

            return redirect()->route('students.activities.submissions.show', $activity->slug)
                ->with('success', $message);
        } catch (Exception $e) {
            Log::warning("Error de soumission activité :: " . $e->getMessage());
            return back()->with('error', "Quelques choses s'est mal passées");
        }
    }

    /**
     * Display the specified submission.
     */
    public function show($activitySlug)
    {
        $activity = Activity::with('delivRequirements')->whereIn('parent_course_id', $this->studentCoursesIds)->where('slug', $activitySlug)->firstOrFail();

        // Vérifier que l'étudiant est inscrit au cours
        $studentId = Student::where('user_id', Auth::id())->value('id');

        // Vérifier si une soumission existe déjà
        $submission = Submission::where('student_id', $studentId)
            ->where('activity_id', $activity->id)
            ->first();
        if (!$submission) {
            return back()->with('error', "Vous n'avez pas soumis cette activité");
        }

        // Charger les relations

        return Inertia::render('students/submissions/show', [
            'submission' => $submission,
            'submissionUploads' => $submission->submissionUploads,
            'activity' => $submission->activity,
            'parentCourse' => $submission->parentCourse,
        ]);
    }



    /**
     * Update the specified submission in storage.
     */


    /**
     * Remove the specified submission from storage.
     */
    public function destroy($activityId, FileUploadService $uploader)
    {
        $studentId = Student::where('user_id', Auth::id())->value('id');

        $activity = Activity::with('delivRequirements')->whereIn('parent_course_id', $this->studentCoursesIds)->findOrFail($activityId);

        $submission = Submission::where('student_id', $studentId)
            ->where('activity_id', $activityId)
            ->first();

        // Vérifier que c'est un brouillon ou pas encore soumis
        if (!in_array($submission->status, ['draft', 'submitted'])) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que les brouillons ou soumissions non évaluées.',
            ], 422);
        }

        // Supprimer les fichiers associés si existants
        if ($submission->submissionUploads) {
            try {
                foreach ($submission->submissionUploads as $upload) {
                    if ($upload->url_public_id != null) {
                        $uploader->delete($upload->url_public_id);
                    }
                }
            } catch (\Exception $e) {
                Log::warning("Erreur lors de la suppression des fichiers de la soumission {$submission->id}: " . $e->getMessage());
            }
        }

        // Supprimer la soumission
        $submission->delete();

        return redirect()->route('students.activities.details', $activity->slug)
            ->with('success', 'Soumission supprimée avec succès.');
    }
}
