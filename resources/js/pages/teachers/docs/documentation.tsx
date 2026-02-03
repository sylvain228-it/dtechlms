import { Spacer } from '@/components/spacer';
import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
import { docs } from '@/routes/teachers';
import { type BreadcrumbItem } from '@/types';
import {
    Award,
    BarChart3,
    BookOpen,
    Calendar,
    CheckSquare,
    Clock,
    FileText,
    HelpCircle,
    Lightbulb,
    MessageCircle,
    Target,
    Users,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documentation',
        href: docs().url,
    },
];

interface Section {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    content: {
        title: string;
        description: string;
        steps: string[];
        tips?: string[];
    }[];
}

const sections: Section[] = [
    {
        id: 'dashboard',
        title: 'Tableau de Bord',
        icon: <BarChart3 className="h-6 w-6" />,
        description: "Vue d'ensemble de vos cours, activités et étudiants",
        content: [
            {
                title: 'Accéder au Tableau de Bord',
                description:
                    "Le tableau de bord est votre point d'entrée principal pour accéder à toutes les fonctionnalités.",
                steps: [
                    'Connectez-vous à votre compte enseignant',
                    'Vous arrivez automatiquement sur le tableau de bord',
                    "Consultez les statistiques principales : nombre de cours, activités à venir et effectifs d'étudiants",
                    'Cliquez sur les cartes de statistiques pour accéder directement aux sections correspondantes',
                ],
                tips: [
                    'Les statistiques se mettent à jour en temps réel',
                    'Vous pouvez consulter le calendrier intégré pour voir vos activités à venir',
                ],
            },
        ],
    },
    {
        id: 'courses',
        title: 'Gestion des Cours',
        icon: <BookOpen className="h-6 w-6" />,
        description: 'Créer, modifier et organiser vos cours',
        content: [
            {
                title: 'Créer un Nouveau Cours',
                description:
                    'Apprenez comment créer un nouveau cours et le configurer correctement.',
                steps: [
                    'Accédez à la section "Cours" depuis le menu principal',
                    'Cliquez sur le bouton "Nouveau Cours"',
                    'Remplissez les informations du cours (titre, description, catégorie)',
                    "Sélectionnez le public cible et les domaines d'étude",
                    "Configurez les paramètres d'accès et de publication",
                    'Cliquez sur "Créer" pour finaliser',
                ],
                tips: [
                    'Utilisez des titres clairs et descriptifs pour vos cours',
                    'Ajoutez une description détaillée pour aider les étudiants',
                    'Vous pouvez modifier le cours à tout moment après sa création',
                ],
            },
            {
                title: 'Organiser un Cours',
                description:
                    'Structurez votre cours avec des modules, séquences et ressources.',
                steps: [
                    'Ouvrez un cours existant en cliquant sur son nom',
                    'Accédez à l\'onglet "Modules" ou "Séquences"',
                    'Créez une nouvelle section avec le bouton "+"',
                    'Organisez vos contenus (ressources, textes, activités)',
                    "Définissez l'ordre d'apparition avec le drag & drop",
                    'Publiez votre contenu pour que les étudiants y accèdent',
                ],
                tips: [
                    'Organisez votre contenu de manière logique et progressive',
                    'Utilisez des titres significatifs pour chaque module',
                    'Les étudiants voient uniquement le contenu publié',
                ],
            },
            {
                title: 'Ajouter des Ressources',
                description:
                    'Intégrez documents, fichiers et liens dans vos cours.',
                steps: [
                    'Dans une séquence de cours, cliquez sur "Ajouter une ressource"',
                    'Sélectionnez le type de ressource (document, lien, fichier)',
                    'Chargez ou liez votre contenu',
                    'Ajoutez une description et un titre',
                    'Enregistrez la ressource',
                ],
                tips: [
                    'Supportez plusieurs formats : PDF, vidéos, images, documents',
                    'Nommez clairement vos ressources pour faciliter la navigation',
                    'Testez les liens externes avant de les partager',
                ],
            },
        ],
    },
    {
        id: 'activities',
        title: 'Activités & Événements',
        icon: <Calendar className="h-6 w-6" />,
        description: 'Planifier et gérer les activités pédagogiques',
        content: [
            {
                title: 'Créer une Activité',
                description: 'Créez des activités interactives pour vos cours.',
                steps: [
                    'Accédez à un cours et allez à l\'onglet "Activités"',
                    'Cliquez sur "Nouvelle Activité"',
                    "Sélectionnez le type d'activité (conférence, travail, discussion)",
                    'Configurez les paramètres (titre, date, durée, lieu)',
                    'Définissez les étudiants participants',
                    'Ajoutez une description et des instructions',
                    "Publiez l'activité",
                ],
                tips: [
                    "Planifiez vos activités suffisamment à l'avance",
                    'Envoyez des rappels automatiques aux étudiants',
                    "Vous pouvez modifier une activité jusqu'à sa date de début",
                ],
            },
            {
                title: 'Gérer le Calendrier',
                description: 'Visualisez et organisez toutes vos activités.',
                steps: [
                    'Consultez le calendrier intégré depuis le tableau de bord',
                    'Cliquez sur une date pour voir les activités planifiées',
                    'Accédez à la section "Calendrier" pour une vue complète',
                    'Créez directement des activités depuis le calendrier',
                    'Utilisez les filtres pour voir uniquement vos cours ou activités',
                ],
                tips: [
                    'Le calendrier se synchronise avec votre contenu',
                    'Vous recevez des notifications pour les activités à venir',
                ],
            },
        ],
    },
    {
        id: 'quizzes',
        title: 'Questionnaires & Évaluations',
        icon: <CheckSquare className="h-6 w-6" />,
        description: 'Créer et gérer des quiz et évaluations',
        content: [
            {
                title: 'Créer un Questionnaire',
                description:
                    'Mettez en place des quiz pour tester les connaissances.',
                steps: [
                    'Allez à la section "Quiz" d\'un cours',
                    'Cliquez sur "Nouveau Quiz"',
                    'Configurez les paramètres (titre, temps limite, tentatives)',
                    'Ajoutez des questions (choix multiples, vrai/faux, texte libre)',
                    'Définissez la grille de notation',
                    'Configurez quand le quiz est accessible',
                    'Publiez le quiz',
                ],
                tips: [
                    "Variez les types de questions pour plus d'engagement",
                    "Fixez un temps limite approprié au niveau d'étude",
                    'Les étudiants peuvent voir leurs résultats immédiatement',
                ],
            },
            {
                title: 'Gérer les Réponses',
                description:
                    'Consultez et analysez les réponses des étudiants.',
                steps: [
                    'Ouvrez un quiz depuis la section "Quiz"',
                    'Allez à l\'onglet "Réponses"',
                    'Visualisez les résultats de tous les participants',
                    'Consultez les réponses détaillées par étudiant',
                    'Accédez à un rapport statistique global',
                    'Téléchargez les résultats au format CSV',
                ],
                tips: [
                    'Analysez les questions les plus difficiles',
                    'Utilisez les statistiques pour améliorer votre contenu',
                    'Vous pouvez modifier les réponses si nécessaire',
                ],
            },
        ],
    },
    {
        id: 'students',
        title: 'Gestion des Étudiants',
        icon: <Users className="h-6 w-6" />,
        description: "Gérer l'inscription et le suivi des étudiants",
        content: [
            {
                title: 'Voir la Liste des Étudiants',
                description: 'Consultez et gérez vos étudiants inscrits.',
                steps: [
                    'Accédez à la section "Étudiants" depuis le menu',
                    'Visualisez la liste complète de vos étudiants',
                    "Consultez leur statut d'inscription et de participation",
                    'Cliquez sur un étudiant pour voir son profil détaillé',
                    'Accédez à ses activités et résultats',
                ],
                tips: [
                    'Vous pouvez filtrer et trier la liste des étudiants',
                    'Utilisez la barre de recherche pour trouver un étudiant',
                    'Consultez le détail de la participation de chaque étudiant',
                ],
            },
            {
                title: 'Assigner des Étudiants aux Activités',
                description:
                    'Assignez des étudiants spécifiques aux activités.',
                steps: [
                    'Ouvrez une activité ou un cours',
                    'Allez à l\'onglet "Participants" ou "Assignation"',
                    'Cliquez sur "Ajouter des étudiants"',
                    'Sélectionnez les étudiants à assigner',
                    'Définissez leur rôle (participant, observateur)',
                    "Confirmez l'assignation",
                ],
                tips: [
                    "Vous pouvez assigner des groupes d'étudiants",
                    'Modifiez les assignations à tout moment',
                    'Les étudiants reçoivent une notification',
                ],
            },
        ],
    },
    {
        id: 'evaluations',
        title: 'Évaluations & Notation',
        icon: <Award className="h-6 w-6" />,
        description: 'Évaluer et noter le travail des étudiants',
        content: [
            {
                title: "Créer une Grille d'Évaluation",
                description: "Établissez des critères d'évaluation structurés.",
                steps: [
                    'Accédez à la section "Évaluations"',
                    'Cliquez sur "Nouvelle Stratégie d\'Évaluation"',
                    "Définissez les critères d'évaluation",
                    'Configurez les niveaux de performance',
                    'Associez la grille à un cours ou une activité',
                    'Enregistrez la grille',
                ],
                tips: [
                    'Utilisez des critères clairs et mesurables',
                    'Décrivez chaque niveau de performance',
                    'Vous pouvez réutiliser vos grilles',
                ],
            },
            {
                title: 'Évaluer le Travail des Étudiants',
                description: 'Noté les submissions et travaux des étudiants.',
                steps: [
                    'Allez à l\'onglet "Évaluations" d\'une activité',
                    'Consultez les travaux soumis',
                    "Cliquez sur une soumission pour l'évaluer",
                    "Sélectionnez les critères d'évaluation",
                    'Attribuez une note ou un score',
                    'Ajoutez des commentaires et retours',
                    "Enregistrez et notifiez l'étudiant",
                ],
                tips: [
                    "Utilisez la grille d'évaluation pour la cohérence",
                    'Fourniez des commentaires constructifs',
                    'Les étudiants peuvent voir vos évaluations',
                ],
            },
        ],
    },
    {
        id: 'skills',
        title: 'Compétences & Badges',
        icon: <Target className="h-6 w-6" />,
        description: 'Gérer les compétences et reconnaître les succès',
        content: [
            {
                title: 'Définir des Compétences',
                description:
                    'Établissez les compétences que vos étudiants doivent acquérir.',
                steps: [
                    'Accédez à la section "Compétences"',
                    'Cliquez sur "Nouvelle Compétence"',
                    'Nommez et décrivez la compétence',
                    'Définissez les niveaux de maîtrise',
                    'Associez-la à des cours ou domaines',
                    'Enregistrez la compétence',
                ],
                tips: [
                    'Alignez les compétences avec vos objectifs de cours',
                    'Soyez spécifique dans les descriptions',
                    'Vous pouvez organiser les compétences par domaines',
                ],
            },
            {
                title: 'Attribuer des Badges',
                description: 'Récompensez les étudiants avec des badges.',
                steps: [
                    'Accédez à la section "Badges"',
                    'Cliquez sur "Nouveau Badge"',
                    'Téléchargez une image pour le badge',
                    "Définissez les critères d'obtention",
                    'Associez le badge à des activités ou compétences',
                    "Les badges s'attribuent automatiquement lorsque les critères sont atteints",
                ],
                tips: [
                    'Utilisez des designs attrayants pour vos badges',
                    'Célébrez les accomplissements des étudiants',
                    'Les badges motivent les étudiants',
                ],
            },
        ],
    },
];

function DocumentationCard({
    section,
    isActive,
    onClick,
}: {
    section: Section;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`mt-1 ${
                        isActive ? 'text-blue-600' : 'text-gray-600'
                    }`}
                >
                    {section.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                        {section.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        {section.description}
                    </p>
                </div>
            </div>
        </button>
    );
}

function ContentSection({ section }: { section: Section }) {
    return (
        <div className="space-y-6">
            <div className="flex items-start gap-4 border-b-2 border-blue-200 pb-4">
                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                    {section.icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {section.title}
                    </h2>
                    <p className="mt-1 text-gray-600">{section.description}</p>
                </div>
            </div>

            <div className="space-y-8">
                {section.content.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-lg border border-gray-200 bg-white p-6"
                    >
                        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                            <Zap className="h-5 w-5 text-orange-500" />
                            {item.title}
                        </h3>

                        {item.description && (
                            <p className="mt-3 text-gray-700">
                                {item.description}
                            </p>
                        )}

                        {item.steps && item.steps.length > 0 && (
                            <div className="mt-4">
                                <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                    <Clock className="h-4 w-4" />
                                    Étapes à suivre :
                                </h4>
                                <ol className="space-y-2 pl-6">
                                    {item.steps.map((step, stepIndex) => (
                                        <li
                                            key={stepIndex}
                                            className="list-decimal text-gray-700"
                                        >
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {item.tips && item.tips.length > 0 && (
                            <div className="mt-5 rounded border-l-4 border-amber-500 bg-amber-50 p-4">
                                <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-900">
                                    <Lightbulb className="h-4 w-4" />
                                    Conseils utiles :
                                </h4>
                                <ul className="space-y-2">
                                    {item.tips.map((tip, tipIndex) => (
                                        <li
                                            key={tipIndex}
                                            className="flex items-start gap-2 text-sm text-amber-800"
                                        >
                                            <span className="mt-0.5 font-bold text-amber-600">
                                                •
                                            </span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function TeacherDocumentation() {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    const currentSection = sections.find((s) => s.id === activeSection);

    return (
        <TeacherLayouts breadcrumbs={breadcrumbs} title="Documentation">
            <div className="space-y-6">
                {/* Header */}
                <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                    <div className="flex items-start gap-4">
                        <div className="bg-opacity-20 rounded-lg bg-white p-3">
                            <HelpCircle className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Bienvenue dans la Documentation
                            </h1>
                            <p className="mt-2 text-blue-100">
                                Apprenez comment utiliser efficacement
                                l\'interface enseignant et tirer le meilleur
                                parti de toutes les fonctionnalités disponibles.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-2">
                            <p className="mb-4 px-2 text-sm font-semibold text-gray-600">
                                Sections
                            </p>
                            {sections.map((section) => (
                                <DocumentationCard
                                    key={section.id}
                                    section={section}
                                    isActive={activeSection === section.id}
                                    onClick={() => setActiveSection(section.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {currentSection && (
                            <ContentSection section={currentSection} />
                        )}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12 rounded-lg border border-gray-200 bg-white p-8">
                    <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                        Questions Fréquemment Posées
                    </h2>
                    <div className="space-y-4">
                        <details className="cursor-pointer border-l-4 border-green-500 py-3 pl-4">
                            <summary className="font-semibold text-gray-900 hover:text-green-600">
                                Comment puis-je publier mon cours ?
                            </summary>
                            <p className="mt-3 text-gray-700">
                                Une fois votre cours configuré avec du contenu,
                                accédez aux paramètres du cours et activez
                                l\'option "Publier". Les étudiants inscrits
                                auront alors accès au contenu que vous avez
                                marqué comme publié.
                            </p>
                        </details>
                        <details className="cursor-pointer border-l-4 border-green-500 py-3 pl-4">
                            <summary className="font-semibold text-gray-900 hover:text-green-600">
                                Comment modifier une activité déjà créée ?
                            </summary>
                            <p className="mt-3 text-gray-700">
                                Accédez à l\'activité concernée, cliquez sur le
                                bouton "Modifier" et apportez les changements
                                nécessaires. Vous pouvez modifier une activité
                                jusqu\'à sa date de début. Les changements
                                seront immédiatement appliqués.
                            </p>
                        </details>
                        <details className="cursor-pointer border-l-4 border-green-500 py-3 pl-4">
                            <summary className="font-semibold text-gray-900 hover:text-green-600">
                                Puis-je voir les progrès de mes étudiants ?
                            </summary>
                            <p className="mt-3 text-gray-700">
                                Oui ! Accédez à la section "Étudiants", cliquez
                                sur un étudiant pour voir son profil détaillé
                                incluant ses activités complétées, ses quiz
                                réussis et ses compétences acquises. Vous pouvez
                                également consulter des rapports globaux.
                            </p>
                        </details>
                        <details className="cursor-pointer border-l-4 border-green-500 py-3 pl-4">
                            <summary className="font-semibold text-gray-900 hover:text-green-600">
                                Comment importer des ressources depuis d\'autres
                                sources ?
                            </summary>
                            <p className="mt-3 text-gray-700">
                                Utilisez l\'option "Importer" dans votre cours
                                pour charger des fichiers depuis votre
                                ordinateur ou créer des liens vers des
                                ressources externes. Les formats supportés
                                incluent PDF, vidéos, images et documents
                                bureautiques.
                            </p>
                        </details>
                    </div>
                </div>

                {/* Support Section */}
                <div className="mt-8 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6">
                    <div className="flex items-start gap-4">
                        <FileText className="mt-1 h-6 w-6 flex-shrink-0 text-purple-600" />
                        <div>
                            <h3 className="font-bold text-gray-900">
                                Besoin d\'aide supplémentaire ?
                            </h3>
                            <p className="mt-2 text-gray-700">
                                Consultez notre base de connaissances complète
                                ou contactez l\'équipe de support pour des
                                questions spécifiques. Nous sommes là pour vous
                                aider à tirer le meilleur parti de la
                                plateforme.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Spacer />
        </TeacherLayouts>
    );
}
