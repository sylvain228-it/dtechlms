import {
    DeliverableType,
    EvaluateType,
    LogicOperator,
    ModalityType,
    NoteUnit,
    PedagogicalRole,
    PlateformeConference,
    PrerequisiteType,
    QuizQuestionType,
    QuizType,
    ResourceType,
    SaveStatus,
    StorageType,
} from '@/lib/type';
import { Skill } from './skill';

export interface Prerequisite {
    entity_type: string;
    entity_id: number;

    prerequisite_type: PrerequisiteType;
    prerequisite_id?: number | null;

    // nullableMorphs('entitytable')
    entitytable_type?: string | null;
    entitytable_id?: number | null;

    description?: string | null;

    is_mandatory: boolean;

    min_score?: number | null;
    min_attempts?: number | null;

    logic: LogicOperator;
}

export interface CustomMapDataProposal {
    id: number;
    title: string;
}

export interface Resource {
    // Identification
    id: number;
    title: string;
    slug: string;
    description?: string | null;

    // Typologie de ressource
    resource_type: ResourceType;

    // Support technique
    storage_type: StorageType;
    file_path?: string | null;
    url?: string | null;
    url_public_id?: string | null;
    mime_type?: string | null;
    file_ext?: string | null;
    file_size?: number | null;
    duration_minute?: number | null;

    // Accessibilité pédagogique
    language?: string;
    has_subtitles: number;
    has_transcript: number;
    accessibility_level?: string | null;

    // Usage pédagogique
    pedagogical_role: PedagogicalRole;
    is_mandatory: number;
    is_downloadable: number;

    // Métadonnées pédagogiques
    learning_objectives?: string | null;
    keywords?: string | null;
    tags?: string | null;

    // Droits & licences
    author?: string | null;
    source?: string | null;
    license?: string | null;
    notes?: string | null;
    access_instructions?: string | null;
    attribution?: string | null;

    // Statut & gouvernance
    status: SaveStatus;
    is_visible: number;

    // Versioning
    version: number;
    parent_id?: number | null;

    // Timestamps (API Laravel)
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface EntityResource {
    id: number;
    entity_type: string;
    entity_id: number;
    resource_id: number;
    role: PedagogicalRole;
    is_mandatory: boolean;
    is_visible: boolean;
    created_at?: string;
    updated_at?: string;
    resource?: Resource;
}

export interface Quiz {
    id: number;
    title: string;
    slug: string;
    description?: string | null;

    // Paramètres pédagogiques
    quiz_type: QuizType;
    time_limit_minutes?: number | null;
    max_attempts: number;
    is_mandatory: boolean;

    // Comportement
    shuffle_questions: boolean;
    shuffle_answers: boolean;
    show_results_immediately: boolean;
    show_correct_answers: boolean;

    // Scoring
    max_score?: number | null;
    success_threshold?: number | null;
    quize_instructions?: string | null;
    note_unit?: NoteUnit;
    // Publication
    status: SaveStatus;
    published_at?: string | null; // ISO date string
    created_at?: string;
    updated_at?: string;
    // Versioning
    version: number;

    quizzable_type: string;
    quizzable_id: number;
}

export interface QuizQuestion {
    id: number;
    quiz_id: number;
    skill_id?: number;

    // Contenu
    question_text: string;
    question_type: QuizQuestionType;

    // Paramètres
    points: number;
    order: number;
    is_mandatory: boolean;
    quize?: Quiz;
    skill?: Skill;

    // Feedback
    feedback_correct?: string | null;
    feedback_incorrect?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface QuizAnswer {
    id: number;
    quiz_question_id: number;

    // Contenu
    answer_text?: string | null;
    is_correct: boolean;
    order: number;

    question?: QuizQuestion;
    // Numérique
    numeric_value?: number | null;
    tolerance?: number | null;
    created_at?: string;
    updated_at?: string;
}

export interface Evaluation {
    id: number;

    // Relations polymorphiques
    evaluable_type: string;
    evaluable_id: number;
    quiz_id?: number | null;

    // Identification
    title: string;
    slug: string;
    description?: string | null;

    // Typologie
    evaluation_type: EvaluateType;
    modality: ModalityType;

    // Organisation
    weight?: number | null;
    max_score?: number | null;
    note_unit?: NoteUnit;
    duration_minutes?: number | null;
    scheduled_at?: string | null;
    is_mandatory: boolean;

    // Ressources
    allowed_tools?: string | null;
    resources_summary?: string | null;

    // Feedback
    provides_feedback: boolean;
    feedback_instructions?: string | null;

    // Avancé
    is_group: boolean;
    max_group_size?: number | null;
    allows_resubmission: boolean;
    max_attempts?: number | null;

    // Fenêtre temporelle
    start_at?: string | null;
    end_at?: string | null;
    deliverable_type?: DeliverableType;
    // Accès
    is_synchronous: boolean;
    allow_late_submission: boolean;
    late_penalty_percentage?: number | null;

    // Sécurité
    lock_after_end: boolean;
    shuffle_questions: boolean;

    // Visioconférence
    conference_platform?: PlateformeConference;
    conference_url?: string | null;
    conference_meeting_id?: string | null;
    conference_passcode?: string | null;

    // Statut & version
    status: SaveStatus;
    version: number;
    parent_evaluation_id?: number | null;

    // Métadonnées
    language: string;
    published_at?: string | null;

    // Timestamps
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface EvaluationAttempt {
    id: number;
    evaluation_id: number;
    student_id: number;
    attempt_number: number;
    score?: number | null;
    started_at?: string | null;
    submitted_at?: string | null;
    created_at?: string;
    updated_at?: string;
}
export interface EvaluationSubmission {
    id: number;
    evaluation_attempt_id: number;
    quiz_question_id: number;
    answer_id?: number | null;
    answer_text?: string | null;
    score?: number | null;
    created_at?: string;
    updated_at?: string;
}

// export interface EventCalendar {
//     id: number;
//     title: string;
//     description?: string | null;

//     // Type d'événement
//     event_type: EventType;

//     // Liaison polymorphique
//     eventable_type: string;
//     eventable_id: number;

//     // Dates
//     start_at: string;
//     end_at?: string | null;
//     duration_minutes?: number | null;

//     // Mode
//     is_synchronous: boolean;

//     // Lieu / plateforme
//     modality: ModalityType;
//     location?: string | null;
//     conference_platform?: PlateformeConference;
//     conference_url?: string | null;
//     conference_meeting_id?: string | null;
//     conference_passcode?: string | null;

//     // Visibilité
//     visibility: EventVisibilityType;

//     // Contexte pédagogique
//     course_id?: number | null;
//     module_id?: number | null;

//     // Créateur
//     teacher_id: number;

//     // Statut
//     status: EventStatusType;

//     // Couleur calendrier
//     color?: string | null;

//     // Métadonnées
//     metadata?: string | null;

//     // Timestamps
//     created_at?: string;
//     updated_at?: string;
// }
