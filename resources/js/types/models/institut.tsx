import { StudyLevel } from '@/lib/type';
import { User } from '..';
import { Course, Enrollment } from './course';

export interface InstitutProfileProps {
    id: number;

    // Identité & contact
    username: string;
    name: string;
    slug: string;
    email?: string | null;
    contact_email?: string | null;
    tel?: string | null;
    phone_number?: string | null;
    whatsapp_number?: string | null;

    // Adresses & visuels
    address?: string | null;
    s_address?: string | null;
    logo_url?: string | null;
    logo_public_id?: string | null;
    cover_url?: string | null;
    cover_public_id?: string | null;
    website_url?: string | null;

    // Thème / configuration
    theme?: Record<string, unknown> | null;

    // Type & plan
    type: 'university' | 'training_organization' | 'school';
    billing_plan: 'free' | 'standard' | 'premium';
    is_active: boolean;

    // Dates & statistique
    born_date?: string | null; // ISO date
    last_login_date?: string | null; // ISO date
    email_verified_at?: string | null; // ISO datetime

    // Sécurité
    password?: string; // stocké côté serveur uniquement, évite de l'exposer côté client

    // Localisation
    country?: string | null;
    city?: string | null;

    // Timestamps Eloquent
    created_at?: string | null;
    updated_at?: string | null;

    // Relations optionnelles
    // (ajoute/importe les interfaces correspondantes si tu veux typer les relations)
    // admins?: Admin[] | null;
    // courses?: Course[] | null;

    [key: string]: unknown;
}

export interface Location {
    id: number;
    name: string;
    address?: string | null;
    address_line?: string | null;
    city?: string | null;
    state?: string | null;
    cover_url?: string | null;
    country?: string | null;
    maps_url?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    [key: string]: unknown;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface InstitutSharedData {
    name: string;
    quote: { message: string; author: string };
    auth: InstitutAuth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}
export interface InstitutAuth {
    institut: InstitutProfileProps;
}

export interface Teacher {
    id: number;
    user_id?: number | null;
    Institut_id?: number | null;

    // Informations personnelles
    first_name?: string;
    last_name?: string;
    email?: string;
    bio?: string;
    birth_date?: Date | null; // ISO date string
    gender?: 'M' | 'F' | 'O' | string;
    phone_number?: string;
    whatsapp_number?: string;

    // Localisation
    country?: string | null;
    city?: string | null;
    address?: string | null;

    // Infos académiques & pro
    qualification?: string | null;
    diplom?: string | null;
    exp_year?: number | null;
    specialties?: string | null;
    subjects_taught?: string[] | null;
    teaching_level?: string | null;
    contract_type?: string | null;
    hire_date?: string | null; // ISO date string
    end_contract_date?: string | null; // ISO date string
    hourly_rate?: number | null;
    workload?: string | null;
    availability?: string | null;

    // Compétences
    skills?: string[] | null;
    languages?: string[] | null;
    certifications?: string[] | null;

    // Évaluation
    rating?: number | null; // e.g. 4.5
    reviews_count?: number | null;

    // Préférences d'enseignement
    online_teaching?: number;
    classroom_preference?: string | null;

    // Documents
    cv_path?: string | null;
    cv_public_id?: string | null;
    portfolio_url?: string | null;
    documents?: string | null;

    // Sécurité & admin
    national_id?: string | null;
    passport_number?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    bank_name?: string | null;
    bank_number?: string | null;
    is_active?: boolean;
    is_verified?: boolean;
    is_changeable?: boolean;

    // Données système
    profile_picture_url?: string | null;
    profile_picture_public_id?: string | null;
    last_login_at?: string | null; // ISO date string
    status?: string | null;

    // Audit
    updated_by_history?: string | null;

    created_at?: string | null;
    updated_at?: string | null;

    user: User | null;

    [key: string]: unknown;
}

export interface Student {
    id: number;

    // Relations
    user_id?: number | null;
    Institut_id?: number;

    // Informations personnelles
    first_name?: string | null;
    last_name?: string | null;
    email?: string;
    birth_date?: Date | null; // ISO date string
    gender?: 'M' | 'F' | 'O' | null;
    phone_number?: string | null;
    whatsapp_number?: string | null;

    profile_picture_url?: string | null;
    profile_picture_public_id?: string | null;

    // Localisation
    country?: string | null;
    city?: string | null;
    address?: string | null;
    postal_code?: string | null;

    // Informations académiques
    student_code?: string | null; // Matricule étudiant
    current_level?: StudyLevel; // ex : L1, Terminale, BTS 2
    program?: string | null; // Filière / formation
    interests?: string[] | null; // intérêts d'apprentissage
    enrollment_date?: string | null; // ISO date string
    year?: string | null; // année scolaire
    session?: string | null; // session de formation
    study_mode?: 'online' | 'onsite' | 'hybrid' | null;

    // Système & activité
    is_active?: number; // 1 = actif, 0 = inactif
    credits?: number; // ECTS / points

    // Documents
    documents?: string | null;

    // Famille / contacts d'urgence
    guardian_name?: string | null;
    guardian_phone?: string | null;
    guardian_email?: string | null;

    // Santé
    medical_info?: string | null; // ex : allergies

    // Sécurité administrative
    national_id?: string | null;
    is_verified?: number | null;

    // Audit
    updated_by_history?: string;

    created_at?: string | null;
    updated_at?: string | null;
    courses?: Course[] | null;
    enrollments?: Enrollment[] | null;

    user: User | null;
    [key: string]: unknown;
}

export interface TeacherStudent {
    id: number;
    teacher_id: number;
    course_id: number;
    student_id: number;
    teacher?: Teacher;
    student?: Student;
    course?: Course;
    created_at?: string | null;
    updated_at?: string | null;
}
