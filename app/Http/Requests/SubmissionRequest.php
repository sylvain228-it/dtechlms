<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class SubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Vérifier que l'utilisateur est un étudiant et peut soumettre
        $studentId = Auth::id();
        $activityId = $this->input('activity_id');

        // Vérifier que l'étudiant est inscrit au cours de l'activité
        // et que l'activité existe
        return true; // À adapter selon votre logique d'autorisation
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'activity_id' => [
                'required',
                'integer',
                'exists:activities,id',
            ],

            // Relations - Optionnelles
            'evaluation_id' => [
                'nullable',
                'integer',
                'exists:evaluations,id',
            ],

            // Contenu
            'title' => [
                'nullable',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'uploaded_list' => [
                'required',
                'string',
            ],


            // Évaluation (généralement rempli par l'enseignant)
            'score' => [
                'nullable',
                'numeric',
                'min:0',
                'max:99.99',
                'regex:/^\d+(\.\d{1,2})?$/', // Contrôle le format decimal(5,2)
            ],
            'feedback' => [
                'nullable',
                'string',
            ],
            'feedback_details' => [
                'nullable',
                'string',
            ],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            // Relations
            'student_id.required' => 'L\'identifiant étudiant est requis.',
            'student_id.integer' => 'L\'identifiant étudiant doit être un entier.',
            'student_id.exists' => 'L\'étudiant spécifié n\'existe pas.',

            'course_id.required' => 'Le cours est requis.',
            'course_id.integer' => 'L\'identifiant du cours doit être un entier.',
            'course_id.exists' => 'Le cours spécifié n\'existe pas.',

            'activity_id.required' => 'L\'activité est requise.',
            'activity_id.integer' => 'L\'identifiant de l\'activité doit être un entier.',
            'activity_id.exists' => 'L\'activité spécifiée n\'existe pas.',

            'evaluation_id.exists' => 'L\'évaluation spécifiée n\'existe pas.',

            // Contenu
            'title.string' => 'Le titre doit être une chaîne de caractères.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',

            'description.string' => 'La description doit être une chaîne de caractères.',

            // Fichiers
            'files.array' => 'Les fichiers doivent être fournis sous forme de tableau.',
            'files.*.file' => 'Chaque élément doit être un fichier valide.',
            'files.*.max' => 'La taille maximale d\'un fichier est 10MB.',
            'files.*.mimes' => 'Les types de fichiers autorisés sont : PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, JPEG, PNG, GIF, ZIP.',

            // Soumission
            'submitted_at.date_format' => 'La date de soumission doit être au format : YYYY-MM-DD HH:MM:SS.',

            // Statut
            'status.in' => 'Le statut doit être l\'un des suivants : draft, submitted, graded, resubmitted.',
            'late_submission.boolean' => 'Le champ soumission tardive doit être un booléen.',

            // Évaluation
            'score.numeric' => 'La note doit être un nombre.',
            'score.min' => 'La note doit être supérieure ou égale à 0.',
            'score.max' => 'La note doit être inférieure ou égale à 99.99.',
            'score.regex' => 'La note doit avoir le format : nombre avec maximum 2 décimales.',

            'feedback.string' => 'Le retour doit être une chaîne de caractères.',
            'feedback_details.string' => 'Les détails du retour doivent être une chaîne de caractères.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Préparer late_submission en booléen si présent
        if ($this->has('late_submission')) {
            $this->merge([
                'late_submission' => $this->boolean('late_submission'),
            ]);
        }

        // Définir le statut par défaut si non fourni
        if (!$this->has('status')) {
            $this->merge([
                'status' => 'draft',
            ]);
        }

        // Convertir les fichiers en JSON s'ils sont présents
        if ($this->has('files') && is_array($this->input('files'))) {
            $filePaths = [];
            // Les chemins réels seront traités dans le controller
            $this->merge([
                'submitted_files' => json_encode($filePaths),
            ]);
        }
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validations personnalisées supplémentaires
            $activityId = $this->input('activity_id');
            $status = $this->input('status');

            // Exemple : vérifier si le statut 'graded' ne peut être défini que par l'enseignant
            // if ($status === 'graded' && !auth()->user()->isTeacher()) {
            //     $validator->errors()->add('status', 'Seul un enseignant peut définir le statut à \'graded\'.');
            // }

            // Vérifier si la soumission est tardive si le champ est défini
            if ($this->has('late_submission') && $this->boolean('late_submission')) {
                $activity = \App\Models\Activity::find($activityId);
                if ($activity && $activity->deliverable_deadline) {
                    $deadline = new \DateTime($activity->deliverable_deadline);
                    $now = new \DateTime();
                    if ($now <= $deadline) {
                        $validator->errors()->add(
                            'late_submission',
                            'La soumission n\'est pas tardive (la date limite n\'a pas été dépassée).'
                        );
                    }
                }
            }
        });
    }
}
