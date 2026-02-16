export type SequenceType =
    | 'discovery'
    | 'practice'
    | 'integration'
    | 'assessment'
    | 'remediation'
    | 'project';

export type Language = 'fr' | 'en' | 'es';
export type GenderOption = 'F' | 'M' | 'O';

export type CourseLevel =
    | 'all_level'
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'expert';
export type CourseType = 'professional' | 'university' | 'hybrid';
export const courseTypesLabels: Array<{ key: CourseType; value: string }> = [
    {
        key: 'professional',
        value: 'Professionnel — formation orientée vers les compétences métier',
    },
    {
        key: 'university',
        value: 'Universitaire — formation académique et théorique',
    },
    {
        key: 'hybrid',
        value: 'Hybride — mélange de formation professionnelle et académique',
    },
];
// module type
export type ModuleType =
    | 'core'
    | 'elective'
    | 'remedial'
    | 'advanced'
    | 'capstone';
export type ModalityType = 'online' | 'onsite' | 'hybrid' | 'asynchronous';

export type EvaluateType = 'formative' | 'summative' | 'certifying';
export type DeliverableType =
    | 'file'
    | 'link'
    | 'text'
    | 'video'
    | 'image'
    | 'audio'
    | 'github_repo_link';
export type PrerequisiteType =
    | 'course'
    | 'module'
    | 'sequence'
    | 'activity'
    | 'skill'
    | 'experience'
    | 'submission'
    | 'custom';
export type LogicOperator = 'AND' | 'OR';
export type PlateformeConference = 'zoom' | 'teams' | 'google_meet';
export type StudyLevel =
    | 'middle_school' // Collège
    | 'high_school' // Lycée
    | 'high_school_diploma' // Baccalauréat
    | 'associate_degree' // Bac +2 (DUT, BTS, DEUG)
    | 'bachelor' // Licence
    | 'professional_bachelor' // Licence professionnelle
    | 'master' // Master
    | 'professional_master' // Master professionnel
    | 'doctorate' // Doctorat / PhD
    | 'post_doctorate' // Post-doctorat
    | 'diploma' // Diplôme générique
    | 'certificate' // Certificat académique
    | 'professional_certificate' // Certificat professionnel
    | 'continuing_education'; // Formation continue

export type SkillType =
    | 'technical'
    | 'methodological'
    | 'behavioral'
    | 'transversal';

export type AccountRole =
    | 'admin'
    | 'institut'
    | 'teacher'
    | 'student'
    | 'guest';
export type StorageType = 'local' | 's3' | 'cloudinary' | 'external';

export type PedagogicalRole = 'core' | 'support' | 'extension' | 'reference';

export type QuizType = 'diagnostic' | 'formative' | 'summative';

// label type

export const sequenceTypeLabels: Array<{ key: SequenceType; value: string }> = [
    {
        key: 'discovery',
        value: 'Découverte — introduction et exploration du sujet',
    },
    {
        key: 'practice',
        value: 'Pratique — exercices et applications pratiques',
    },
    {
        key: 'integration',
        value: 'Intégration — combinaison des concepts appris',
    },
    {
        key: 'assessment',
        value: 'Évaluation — test des connaissances acquises',
    },
    {
        key: 'remediation',
        value: 'Remédiation — renforcement et correction des lacunes',
    },
    {
        key: 'project',
        value: "Projet — réalisation d'un projet pratique ou théorique",
    },
];

export const langueLabels: Array<{ key: Language; value: string }> = [
    { key: 'fr', value: 'Français — contenu en français' },
    { key: 'en', value: 'Anglais — contenu en anglais' },
    { key: 'es', value: 'Espagnol — contenu en espagnol' },
];

export const genderOptionLabels: Array<{ key: GenderOption; value: string }> = [
    { key: 'M', value: 'Masculin' },
    { key: 'F', value: 'Féminin' },
    { key: 'O', value: 'Autre' },
];

export const courseLevelLabels: Array<{ key: CourseLevel; value: string }> = [
    { key: 'all_level', value: 'Tous niveaux' },
    { key: 'beginner', value: 'Débutant' },
    { key: 'intermediate', value: 'Intermédiaire' },
    { key: 'advanced', value: 'Avancé' },
    { key: 'expert', value: 'Expert' },
];

export const moduleTypeLabels: Array<{ key: ModuleType; value: string }> = [
    { key: 'core', value: 'Module principal — contenu fondamental' },
    { key: 'elective', value: 'Module optionnel — choix de spécialisation' },
    { key: 'remedial', value: 'Remédiation — renforcement des acquis' },
    { key: 'advanced', value: 'Module avancé — approfondissement' },
    {
        key: 'capstone',
        value: 'Projet de synthèse — application finale du parcours',
    },
];
export const modalityTypeLabels: Array<{ key: ModalityType; value: string }> = [
    { key: 'online', value: 'En ligne — entièrement numérique' },
    { key: 'onsite', value: 'Sur site — en présentiel' },
    { key: 'hybrid', value: 'Hybride — mélange en ligne et présentiel' },
    {
        key: 'asynchronous',
        value: 'Asynchrone — sans interaction en temps réel',
    },
];

export const evaluateTypeLabels: Array<{ key: EvaluateType; value: string }> = [
    {
        key: 'formative',
        value: "Formatif — évaluation pour améliorer l'apprentissage",
    },
    { key: 'summative', value: 'Sommatif — évaluation de fin de parcours' },
    {
        key: 'certifying',
        value: 'Certifiant — validation officielle des compétences',
    },
];

export const deliverableTypeLabels: Array<{
    key: DeliverableType;
    value: string;
}> = [
    { key: 'file', value: 'Fichier' },
    { key: 'link', value: 'Lien' },
    { key: 'text', value: 'Texte' },
    { key: 'video', value: 'Vidéo' },
    { key: 'audio', value: 'Audio' },
    { key: 'image', value: 'Image' },
    { key: 'github_repo_link', value: 'Lien du dépôt GitHub' },
];

export const prerequisiteTypeLabels: Array<{
    key: PrerequisiteType;
    value: string;
}> = [
    { key: 'course', value: 'Cours' },
    { key: 'module', value: 'Module' },
    { key: 'sequence', value: 'Séquence' },
    { key: 'activity', value: 'Activité' },
    { key: 'skill', value: 'Compétence' },
    { key: 'experience', value: 'Expérience' },
    { key: 'submission', value: 'Soumission' },
    { key: 'custom', value: 'Personnalisé' },
];
export const logicOperatorLabels: Array<{ key: LogicOperator; value: string }> =
    [
        { key: 'AND', value: 'ET' },
        { key: 'OR', value: 'OU' },
    ];
export const plateformeConferenceLabels: Array<{
    key: PlateformeConference;
    value: string;
}> = [
    { key: 'zoom', value: 'Zoom' },
    { key: 'teams', value: 'Microsoft Teams' },
    { key: 'google_meet', value: 'Google Meet' },
];

export const studyLevelLabels: Array<{ key: StudyLevel; value: string }> = [
    { key: 'middle_school', value: 'Collège' },
    { key: 'high_school', value: 'Lycée' },
    { key: 'high_school_diploma', value: 'Baccalauréat' },
    { key: 'associate_degree', value: 'Bac +2 (DUT, BTS, DEUG)' },
    { key: 'bachelor', value: 'Licence' },
    { key: 'professional_bachelor', value: 'Licence professionnelle' },
    { key: 'master', value: 'Master' },
    { key: 'professional_master', value: 'Master professionnel' },
    { key: 'doctorate', value: 'Doctorat / PhD' },
    { key: 'post_doctorate', value: 'Post-doctorat' },
    { key: 'diploma', value: 'Diplôme générique' },
    { key: 'certificate', value: 'Certificat académique' },
    { key: 'professional_certificate', value: 'Certificat professionnel' },
    { key: 'continuing_education', value: 'Formation continue' },
];

export const skillTypeLabels: Array<{ key: SkillType; value: string }> = [
    {
        key: 'technical',
        value: 'Technique — compétences liées aux outils et technologies',
    },
    {
        key: 'methodological',
        value: 'Méthodologique — compétences de processus et organisation',
    },
    {
        key: 'behavioral',
        value: 'Comportementale — compétences relationnelles et personnelles',
    },
    {
        key: 'transversal',
        value: 'Transversale — compétences applicables à plusieurs domaines',
    },
];

export const storageTypeLabels: Array<{ key: StorageType; value: string }> = [
    { key: 'local', value: 'Stockage local' },
    // { key: 's3', value: 'Amazon S3' },
    // { key: 'cloudinary', value: 'Cloudinary' },
    // { key: 'external', value: 'Stockage externe' },
];
export const pedagogicalRoleLabels: Array<{
    key: PedagogicalRole;
    value: string;
}> = [
    { key: 'core', value: 'Rôle principal — contenu fondamental' },
    { key: 'support', value: 'Rôle de soutien — ressources complémentaires' },
    { key: 'extension', value: "Rôle d'extension — approfondissement" },
    { key: 'reference', value: 'Rôle de référence — matériel de consultation' },
];
export const accountRoleLabels: Array<{
    key: AccountRole;
    value: string;
}> = [
    {
        key: 'guest',
        value: 'Utilisateur',
    },
    {
        key: 'student',
        value: 'Etudiant',
    },
    {
        key: 'teacher',
        value: 'Enseignant',
    },
    {
        key: 'institut',
        value: 'Institut',
    },
    {
        key: 'admin',
        value: 'Admin',
    },
];

export const quizeTypeLabels: Array<{ key: QuizType; value: string }> = [
    {
        key: 'diagnostic',
        value: 'Diagnostique — évaluation initiale des connaissances',
    },
    {
        key: 'formative',
        value: "Formatif — évaluation pour améliorer l'apprentissage",
    },
    { key: 'summative', value: 'Sommatif — évaluation de fin de parcours' },
];

// get label type
export function getCourseTypeLabel(type: CourseType): string {
    return courseTypesLabels.find((item) => item.key === type)?.value || '';
}
export function getSequenceTypeLabel(type: SequenceType): string {
    // get label from sequenceTypeLabels
    return sequenceTypeLabels.find((item) => item.key === type)?.value || '';
}

export function getLanguageLabel(lang: Language): string {
    return langueLabels.find((item) => item.key === lang)?.value || '';
}
export function getGenderOptionLabel(lang: GenderOption): string {
    return genderOptionLabels.find((item) => item.key === lang)?.value || '';
}
export function getCourseLevelLabel(level: CourseLevel): string {
    return courseLevelLabels.find((item) => item.key === level)?.value || '';
}
export function getModuleTypeLabel(type: ModuleType): string {
    return moduleTypeLabels.find((item) => item.key === type)?.value || '';
}
export function getModalityTypeLabel(type: ModalityType): string {
    return modalityTypeLabels.find((item) => item.key === type)?.value || '';
}

export type ActivityType =
    | 'lecture'
    | 'quiz'
    | 'exercise'
    // | 'practical_work'
    // | 'case_study'
    | 'project'
    // | 'simulation'
    // | 'challenge'
    | 'discussion'
    | 'assessment';
export const activityTypeLabels: Array<{ key: ActivityType; value: string }> = [
    {
        key: 'lecture',
        value: 'Cours — présentation du contenu et des concepts',
    },
    { key: 'quiz', value: 'Quiz — questions pour tester les connaissances' },
    { key: 'exercise', value: 'Exercice — pratique guidée avec feedback' },
    // {
    //     key: 'practical_work',
    //     value: 'Travail pratique — application directe des compétences',
    // },
    // {
    //     key: 'case_study',
    //     value: 'Étude de cas — analyse de situations réelles',
    // },
    { key: 'project', value: "Projet — réalisation d'un livrable concret" },
    // {
    //     key: 'simulation',
    //     value: "Simulation — environnement virtuel d'apprentissage",
    // },
    // { key: 'challenge', value: 'Défi — problème à résoudre avec contraintes' },
    {
        key: 'discussion',
        value: 'Discussion — échange et collaboration entre apprenants',
    },
    { key: 'assessment', value: 'Évaluation — test sommative des acquis' },
];
export function getActivityTypeLabel(type: ActivityType): string {
    return activityTypeLabels.find((item) => item.key === type)?.value || '';
}

export function getEvaluateTypeLabel(type: EvaluateType): string {
    return evaluateTypeLabels.find((item) => item.key === type)?.value || '';
}

export function getDeliverableTypeLabel(type: DeliverableType): string {
    return deliverableTypeLabels.find((item) => item.key === type)?.value || '';
}
export function getPrerequisiteTypeLabel(type: PrerequisiteType): string {
    return (
        prerequisiteTypeLabels.find((item) => item.key === type)?.value || ''
    );
}
export function getLogicOperatorLabel(type: LogicOperator): string {
    return logicOperatorLabels.find((item) => item.key === type)?.value || '';
}

export function getPlateformeConferenceLabel(
    type: PlateformeConference,
): string {
    return (
        plateformeConferenceLabels.find((item) => item.key === type)?.value ||
        ''
    );
}

export function getStudyLevelLabel(level: StudyLevel): string {
    return studyLevelLabels.find((item) => item.key === level)?.value || '';
}
export function getSkillTypeLabel(level: SkillType): string {
    return skillTypeLabels.find((item) => item.key === level)?.value || '';
}

export type ResourceType =
    | 'video'
    | 'document'
    | 'link'
    | 'tool'
    | 'dataset'
    | 'audio'
    | 'image'
    | 'slide'
    | 'external_activity'
    | 'other';
export const resourceTypeLabels: Array<{ key: ResourceType; value: string }> = [
    { key: 'video', value: 'Vidéo' },
    { key: 'document', value: 'Document' },
    { key: 'link', value: 'Lien' },
    // { key: 'tool', value: 'Outil' },
    // { key: 'dataset', value: 'Jeu de données' },
    { key: 'audio', value: 'Audio' },
    { key: 'image', value: 'Image' },
    // { key: 'slide', value: 'Diapositive Powerpoint' },
    // { key: 'external_activity', value: 'Activité externe' },
    // { key: 'other', value: 'Autre' },
];
export function getResourceTypeLabel(level: ResourceType): string {
    return resourceTypeLabels.find((item) => item.key === level)?.value || '';
}
export function getStorageTypeLabel(level: StorageType): string {
    return storageTypeLabels.find((item) => item.key === level)?.value || '';
}
export function getPedagogicalRoleLabel(level: PedagogicalRole): string {
    return (
        pedagogicalRoleLabels.find((item) => item.key === level)?.value || ''
    );
}
export function getAccountRoleLabel(level: AccountRole): string {
    return accountRoleLabels.find((item) => item.key === level)?.value || '';
}
export function getQuizeTypeLabel(level: QuizType): string {
    return quizeTypeLabels.find((item) => item.key === level)?.value || '';
}

export type QuizQuestionType =
    | 'single_choice'
    | 'multiple_choice'
    | 'true_false';
// | 'short_answer'
// | 'numeric'
// | 'ordering'

export const quizeQuestionTypeLabels: Array<{
    key: QuizQuestionType;
    value: string;
}> = [
    {
        key: 'single_choice',
        value: 'Choix unique — une seule réponse correcte',
    },
    {
        key: 'multiple_choice',
        value: 'Choix multiples — plusieurs réponses correctes',
    },
    { key: 'true_false', value: 'Vrai/Faux — évaluation binaire' },
    // { key: 'short_answer', value: 'Réponse courte — texte libre limité' },
    // { key: 'numeric', value: 'Réponse numérique — valeur calculée' },
    // { key: 'ordering', value: "Ordonnancement — organisation d'éléments" },
];

export function getQuizQuestionTypeLabel(type: QuizQuestionType): string {
    return (
        quizeQuestionTypeLabels.find((item) => item.key === type)?.value || ''
    );
}

export type SaveStatus = 'draft' | 'review' | 'published' | 'archived';

export const saveStatusLabels: Array<{
    key: SaveStatus;
    value: string;
}> = [
    { key: 'draft', value: 'Brouillon' },
    { key: 'review', value: 'En révision' },
    { key: 'published', value: 'Publié' },
    { key: 'archived', value: 'Archivé' },
];

export function getSaveStatusLabel(status: SaveStatus): string {
    return saveStatusLabels.find((item) => item.key === status)?.value || '';
}
export type NoteUnit = '%' | 'pt';

export const noteUnitLabels: Array<{
    key: NoteUnit;
    value: string;
}> = [
    { key: '%', value: 'Pourcentage' },
    { key: 'pt', value: 'Points' },
];

export function getNoteUnitLabel(unit: NoteUnit): string {
    return noteUnitLabels.find((item) => item.key === unit)?.value || '';
}

export type EventType =
    | 'meeting'
    | 'deadline'
    | 'reminder'
    | 'general'
    | 'course'
    | 'module'
    | 'sequence'
    | 'activity'
    | 'evaluation'
    | 'quiz'
    | 'conference'
    | 'exam'
    | 'custom';

export const eventTypeLabels: Array<{
    key: EventType;
    value: string;
}> = [
    { key: 'meeting', value: 'Réunion' },
    { key: 'deadline', value: 'Date limite' },
    { key: 'reminder', value: 'Rappel' },
    { key: 'general', value: 'Général' },
    { key: 'course', value: 'Cours' },
    { key: 'module', value: 'Module' },
    { key: 'sequence', value: 'Séquence' },
    { key: 'activity', value: 'Activité' },
    { key: 'evaluation', value: 'Évaluation' },
    { key: 'quiz', value: 'Quiz' },
    { key: 'conference', value: 'Conférence' },
    { key: 'exam', value: 'Examen' },
    { key: 'custom', value: 'Personnalisé' },
];

export function getEventTypeLabel(type: EventType): string {
    return eventTypeLabels.find((item) => item.key === type)?.value || '';
}

export type EventVisibilityType = 'public' | 'course' | 'private';

export const eventVisibilityTypeLabels: Array<{
    key: EventVisibilityType;
    value: string;
}> = [
    { key: 'public', value: 'Public' },
    { key: 'course', value: 'Cours' },
    { key: 'private', value: 'Privé' },
];
export function getEventVisibilityLabel(
    visibility: EventVisibilityType,
): string {
    return (
        eventVisibilityTypeLabels.find((item) => item.key === visibility)
            ?.value || ''
    );
}

export type ActivityStatusType =
    | 'scheduled'
    | 'live'
    | 'completed'
    | 'cancelled'
    | 'open'
    | 'closed'
    | 'corrected'
    | 'archived';
export const activityStatusTypeLabels: Array<{
    key: ActivityStatusType;
    value: string;
}> = [
    { key: 'scheduled', value: 'Planifié' },
    { key: 'live', value: 'En cours' },
    { key: 'completed', value: 'Terminé' },
    { key: 'cancelled', value: 'Annulé' },
    { key: 'open', value: 'Ouvert' },
    { key: 'closed', value: 'Fermé' },
    { key: 'corrected', value: 'Corrigé' },
    { key: 'archived', value: 'Archivé' },
];
export function getActivityStatusTypeLabel(status: ActivityStatusType): string {
    return (
        activityStatusTypeLabels.find((item) => item.key === status)?.value ||
        ''
    );
}

export type EntityType =
    | 'course'
    | 'module'
    | 'sequence'
    | 'activity'
    | 'evaluation';

export const entityTypeLabels: Array<{
    key: EntityType;
    value: string;
}> = [
    { key: 'course', value: 'Cours' },
    { key: 'module', value: 'Module' },
    { key: 'sequence', value: 'Séquence' },
    { key: 'activity', value: 'Activité' },
    { key: 'evaluation', value: 'Évaluation' },
];
export function getEntityTypeLabel(type: EntityType): string {
    return entityTypeLabels.find((item) => item.key === type)?.value || '';
}

export type ActivityScope = 'course' | 'module' | 'sequence';

export const activityScopeLabels: Array<{
    key: ActivityScope;
    value: string;
}> = [
    { key: 'course', value: 'Cours — activité au niveau du cours complet' },
    { key: 'module', value: 'Module — activité au niveau du module' },
    {
        key: 'sequence',
        value: 'Séquence — activité au niveau de la séquence pédagogique',
    },
];

export function getActivityScopeLabel(scope: ActivityScope): string {
    return activityScopeLabels.find((item) => item.key === scope)?.value || '';
}

export type FileType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'zip' | 'sql';
export const fileTypeLabels: Array<{ key: FileType; value: string }> = [
    { key: 'pdf', value: 'PDF' },
    { key: 'docx', value: 'Word (DOCX)' },
    { key: 'xlsx', value: 'Excel (XLSX)' },
    { key: 'pptx', value: 'PowerPoint (PPTX)' },
    { key: 'zip', value: 'Archive ZIP' },
    { key: 'sql', value: 'Fichier Sql' },
];
export function getFileTypeLabel(type: FileType): string {
    return fileTypeLabels.find((item) => item.key === type)?.value || '';
}

export type SubmissionStatus = 'draft' | 'submitted' | 'graded' | 'resubmitted';
export const submissionStatusLabels: Array<{
    key: SubmissionStatus;
    value: string;
}> = [
    { key: 'draft', value: 'Brouillon' },
    { key: 'submitted', value: 'Soumis' },
    { key: 'graded', value: 'Noté' },
    { key: 'resubmitted', value: 'Resoumis' },
];
export function getSubmissionStatusLabel(status: SubmissionStatus): string {
    return (
        submissionStatusLabels.find((item) => item.key === status)?.value || ''
    );
}

export type CriterionType = 'knowledge' | 'skill' | 'attitude' | 'transversal';

export const criterionTypeLabels = [
    { key: 'knowledge', value: 'Connaissance' },
    { key: 'skill', value: 'Compétence' },
    { key: 'attitude', value: 'Attitude' },
    { key: 'transversal', value: 'Transversal' },
];
export function getCriterionTypeLabel(type: CriterionType): string {
    return criterionTypeLabels.find((item) => item.key === type)?.value || '';
}

export type EvaluationMethod = 'points' | 'rubric' | 'pass_fail';

export const evaluationMethodLabels = [
    { key: 'points', value: 'Points' },
    { key: 'rubric', value: "Grille d'évaluation" },
    { key: 'pass_fail', value: 'Validé/Non validé' },
];
export function getEvaluationMethodLabel(method: EvaluationMethod): string {
    return (
        evaluationMethodLabels.find((item) => item.key === method)?.value || ''
    );
}

export function getSaveStatusColorClass(status: SaveStatus): string {
    const statusColorClasses: Record<SaveStatus, string> = {
        draft: 'bg-yellow-50 text-yellow-700',
        review: 'bg-blue-50 text-blue-700',
        published: 'bg-green-50 text-green-700',
        archived: 'bg-gray-50 text-gray-700',
    };
    return statusColorClasses[status] || '';
}
export function getActivityStatusColorClass(
    status: ActivityStatusType,
): string {
    const activityStatusColorClasses: Record<ActivityStatusType, string> = {
        scheduled: 'bg-purple-50 text-purple-700',
        open: 'bg-green-50 text-green-700',
        live: 'bg-blue-50 text-blue-700',
        completed: 'bg-gray-50 text-gray-700',
        cancelled: 'bg-red-50 text-red-700',
        closed: 'bg-red-50 text-red-700',
        corrected: 'bg-indigo-50 text-indigo-700',
        archived: 'bg-gray-50 text-gray-700',
    };
    return activityStatusColorClasses[status] || '';
}
