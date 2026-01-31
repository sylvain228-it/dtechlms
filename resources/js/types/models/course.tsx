import {
    ActivityScope,
    ActivityStatusType,
    ActivityType,
    CourseLevel,
    CourseType,
    DeliverableType,
    EvaluateType,
    ModalityType,
    ModuleType,
    NoteUnit,
    PlateformeConference,
    SaveStatus,
    SequenceType,
} from '@/lib/type';
import { InstitutProfileProps, Student, Teacher } from './institut';
import { EntityResource, Evaluation, Quiz } from './others';

export interface Domaine {
    id: number;

    // Métadonnées
    name: string; // up to 200
    cover_url?: string | null;
    cover_url_id?: string | null;
    slug: string; // unique
    description?: string | null;

    // Flags
    is_active?: number;
    is_featured?: number;

    // Relations / FK
    admin_id?: number | null;
    domaine_id?: number | null;

    // Ordering & timestamps
    sort_order?: number;
    created_at?: string | null; // ISO datetime
    updated_at?: string | null; // ISO datetime

    // Relations optionnelles
    // admin?: Admin | null;
    parent_domaine?: Domaine | null;
    subdomaines?: Domaine[] | null;

    // Permet champs additionnels non anticipés
    [key: string]: unknown;
}

export interface Course {
    id: number;

    // Contenu principal
    title: string; // up to 300
    short_title?: string | null; // up to 150
    slug: string;
    description?: string | null;
    syllabus?: string | null; // longText (HTML or markdown)

    // Relations & FK
    domaine_id: number;
    teacher_id?: number | null;
    institut_id?: number | null;

    // Statut & workflow
    status: SaveStatus;
    review_status?: Record<string, unknown> | null; // JSON (ex: reviewer info)

    // Métadonnées
    course_type: CourseType;
    level: CourseLevel;
    modality: ModalityType;
    language?: string | null; // ex 'fr'
    academic_year?: string | null; // ex '2025-2026'

    // Avancé (JSON)
    prerequisites?: string | null;
    target_audience?: string | null;
    learning_outcomes?: string | null;

    // Dates
    start_date?: string | null; // ISO date string
    end_date?: string | null;

    // Charge & organisation
    duration_minutes?: number | null;
    total_hours?: number | null;
    estimated_days?: number | null;
    estimated_weeks?: number | null;
    estimated_months?: number | null;

    // Modalités pédagogiques
    is_modular?: number;
    is_certifying?: number;
    certification_details?: string | null;
    is_competency_based?: number;

    // Versioning
    version?: number;
    parent_course_id?: number | null;

    // Assets
    cover_url?: string | null;
    cover_public_id?: string | null;

    // Tarification / scolarité
    price: number; // decimal(8,2) -> number in TS
    is_free?: number;

    // Counters
    nb_module?: number;
    nb_lessons?: number;
    nb_of_enrollments?: number;

    // Publication lifecycle
    published_at?: string | null;
    updated_course_at?: string | null;
    archived_at?: string | null;

    // Moteur de recherche / SEO
    keywords?: string | null;

    // Timestamps Eloquent
    created_at?: string | null;
    updated_at?: string | null;

    // Relations optionnelles (implémenter les interfaces correspondantes si présentes)
    domaine?: Domaine | null;
    teacher?: Teacher | null;
    institut?: InstitutProfileProps | null;
    parent_course?: Course | null;
    modules?: Module[] | null;
    sequences?: Sequence[] | null;
    activities?: CourseActivity[] | null;
    enrollments?: Enrollment[] | null;
    teachers?: Teacher[] | null;
    resources?: EntityResource[] | null;
    // Index signature pour champs non anticipés
    [key: string]: unknown;
}

export interface Enrollment {
    id: number;
    // Relation au cours
    course_id: number;
    // Relation au student
    student_id: number;
    course?: Course | null;
    student?: Student | null;
    enrolled_at?: string | null;
    completed_at?: string | null;
    // Publication & traçabilité
    created_at?: string | null;
    updated_at?: string | null;
}
export interface Module {
    id: number;

    // Relation au cours
    course_id: number;

    // Informations générales
    title: string;
    slug: string;
    description?: string | null;
    syllabus?: string | null;

    // Organisation pédagogique
    order?: number; // unsignedInteger
    is_visible?: number; // unsignedInteger
    estimated_hours?: number | null;
    estimated_days?: number | null;

    // Typologie pédagogique
    module_type: ModuleType;

    // Modalités de diffusion
    modality: ModalityType;

    // Approche pédagogique
    is_competency_based?: number;
    is_certifying?: number;
    is_mandatory?: number;

    // Évaluation globale
    has_evaluation?: number;
    evaluation_weight?: number | null; // decimal(5,2) → number

    // Statut de vie
    status: SaveStatus;

    // Versioning pédagogique
    version?: number;
    parent_module_id?: number | null;

    // Paramètres avancés (JSON)
    // Prérequis (JSON)
    prerequisites?: string | null;
    learning_outcomes?: string | null;
    assessment_strategy?: string | null;
    teaching_methods?: string | null;

    // Métadonnées
    language?: string;

    // Publication & traçabilité
    published_at?: string | null; // ISO datetime
    created_at?: string | null;
    updated_at?: string | null;
    deleted_at?: string | null;

    // Relations optionnelles
    course?: Course | null;
    parent_module?: Module | null;
    sequences?: Sequence[] | null; // remplacer `any` par l'interface exacte si tu l'as
    resources?: EntityResource[] | null;
    // Autorise champs non anticipés
    [key: string]: unknown;
}

export interface Sequence {
    id: number;

    // Relation
    module_id: number;
    course_id?: number | null;

    // Identification
    title: string;
    slug: string;
    description?: string | null;

    // Objectifs pédagogiques
    syllabus?: string | null;
    learning_outcomes?: string | null;

    // Typologie pédagogique
    sequence_type: SequenceType;

    // Organisation temporelle
    order?: number; // unsigned integer
    estimated_hours?: number | null;
    estimated_days?: number | null;
    start_date?: string | null; // ISO date
    end_date?: string | null; // ISO date

    // Modalités pédagogiques
    modality: ModalityType;

    // Approche pédagogique
    teaching_methods?: string | null;
    learning_activities_summary?: string | null;

    // Liens & dépendances
    prerequisites?: string | null;
    dependencies?: string | null;

    // Évaluation
    has_assessment?: number;
    assessment_weight?: number | null; // decimal

    // Visibilité & statut
    status: SaveStatus;
    is_mandatory?: number;
    is_visible?: number;

    // Versioning
    version?: number;
    parent_sequence_id?: number | null;

    // Métadonnées
    language?: string;

    // Publication & traçabilité
    published_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    deleted_at?: string | null;

    // Relations optionnelles
    module?: Module | null;
    course?: Course | null;
    parent_sequence?: Sequence | null;
    activities?: CourseActivity[] | null;
    resources?: EntityResource[] | null;
    // Permet champs additionnels non anticipés
    [key: string]: unknown;
}
// sequence activity interface
export interface CourseActivity {
    id: number;
    parent_course_id: number | null;
    sequence_id?: number;
    module_id?: number;
    course_id?: number | null;
    scope: ActivityScope;
    // Identification
    title: string;
    slug: string;
    description?: string | null;

    // Typologie d'activité
    activity_type: ActivityType;

    // Consignes pédagogiques
    instructions?: string | null;
    steps?: string | null; // JSON array
    expected_outcomes?: string | null; // JSON array

    // Organisation
    order?: number;
    estimated_minutes?: number | null;

    // Modalités
    modality: ModalityType;
    is_individual: boolean;
    is_collaborative: boolean;
    max_group_size?: number | null;

    // Livrables
    has_deliverable?: number;
    deliverable_type?: DeliverableType;
    deliverable_requirements?: string | null; // JSON
    deliverable_deadline?: string | null; // ISO datetime

    // Évaluation
    is_evaluated: boolean;
    evaluation_type?: EvaluateType;
    evaluation_weight?: number | null; // decimal(5,2)
    note_unit?: NoteUnit;

    // Prérequis et dépendances
    prerequisites?: string | null; // JSON array
    dependencies?: string | null; // JSON array

    // Pédagogie avancée
    teaching_methods?: string | null; // JSON array
    tools?: string | null; // JSON array
    resources_summary?: string | null; // JSON

    // Feedback et accompagnement
    requires_feedback: boolean;
    allows_resubmission: boolean;
    max_attempts?: number | null;

    is_synchronous: boolean;

    // Planification
    start_at?: string | null; // ISO datetime
    duration_minutes?: number | null;

    // Visioconférence
    conference_platform?: PlateformeConference;
    conference_url?: string | null;
    conference_meeting_id?: string | null;
    conference_passcode?: string | null;

    // Gestion présence
    attendance_required: boolean;

    // États
    status: SaveStatus;
    activity_status: ActivityStatusType;
    is_mandatory: boolean;
    is_visible: boolean;

    // Timestamps
    created_at?: string | null;
    updated_at?: string | null;

    // Relations optionnelles
    sequence?: Sequence | null;
    module?: Module | null;
    course?: Course | null;
    parent_course?: Course | null;
    resources?: EntityResource[] | null;
    quiz?: Quiz | null;
    evaluation?: Evaluation | null;

    // Index signature pour champs non anticipés
    [key: string]: unknown;
}
