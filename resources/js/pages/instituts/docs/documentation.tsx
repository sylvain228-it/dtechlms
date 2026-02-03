import { Spacer } from '@/components/spacer';
import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { docs } from '@/routes/institut';
import { type BreadcrumbItem } from '@/types';
import {
    BarChart3,
    BookOpen,
    CheckSquare,
    Clock,
    FileText,
    HelpCircle,
    Lightbulb,
    MapPin,
    MessageCircle,
    Settings,
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
        description: "Vue d'ensemble de votre institution et de ses activités",
        content: [
            {
                title: 'Accéder au Tableau de Bord',
                description:
                    "Le tableau de bord est votre point d'entrée principal pour gérer votre institution.",
                steps: [
                    "Connectez-vous à votre compte administrateur d'institut",
                    'Vous arrivez automatiquement sur le tableau de bord',
                    "Consultez les statistiques principales : nombre d'étudiants, d'enseignants et de cours",
                    'Cliquez sur les cartes de statistiques pour accéder directement aux sections correspondantes',
                    "Suivez l'activité générale de votre institution",
                ],
                tips: [
                    'Les statistiques se mettent à jour en temps réel',
                    "Vous pouvez consulter l'historique des activités récentes",
                    "Utilisez le tableau de bord pour une vue d'ensemble quotidienne",
                ],
            },
        ],
    },
    {
        id: 'courses',
        title: 'Gestion des Cours',
        icon: <BookOpen className="h-6 w-6" />,
        description: "Créer, approuver et gérer les cours de l'institution",
        content: [
            {
                title: 'Voir la Liste des Cours',
                description:
                    'Consultez tous les cours proposés par votre institution.',
                steps: [
                    'Accédez à la section "Cours" depuis le menu principal',
                    'Visualisez la liste complète des cours',
                    'Consultez le statut de chaque cours (brouillon, approuvé, publié)',
                    'Filtrez par catégorie, domaine ou statut',
                    'Cliquez sur un cours pour voir ses détails',
                ],
                tips: [
                    'Utilisez la barre de recherche pour trouver rapidement un cours',
                    'Vous pouvez filtrer par statut de publication',
                    'Les détails incluent les informations du cours et ses participants',
                ],
            },
            {
                title: 'Approuver les Cours',
                description:
                    'Approuvez les cours créés par les enseignants avant leur publication.',
                steps: [
                    'Allez à la section "Cours" et filtrez par statut "En attente"',
                    'Cliquez sur un cours pour consulter ses détails',
                    'Examinez le contenu, la description et les ressources',
                    "Vérifiez que le cours respecte les standards de l'institution",
                    'Cliquez sur "Approuver" pour autoriser sa publication',
                    'Ou "Rejeter" avec des commentaires si des modifications sont nécessaires',
                ],
                tips: [
                    'Vérifiez la qualité du contenu avant approbation',
                    'Demandez des modifications précises si nécessaire',
                    'Les enseignants reçoivent une notification de votre décision',
                ],
            },
            {
                title: 'Gérer le Contenu des Cours',
                description:
                    'Superviser et gérer le contenu créé par les enseignants.',
                steps: [
                    'Ouvrez un cours approuvé',
                    'Consultez l\'onglet "Contenu" pour voir tous les éléments',
                    'Examinez les modules, séquences et ressources',
                    'Vous pouvez modifier ou supprimer le contenu si nécessaire',
                    'Archivez les cours anciens ou inactifs',
                ],
                tips: [
                    'Maintenez une cohérence pédagogique dans les cours',
                    'Archivez régulièrement les cours terminés',
                    "Consultez les statistiques d'engagement des étudiants",
                ],
            },
        ],
    },
    {
        id: 'students',
        title: 'Gestion des Étudiants',
        icon: <Users className="h-6 w-6" />,
        description: 'Gérer les inscriptions et le suivi des étudiants',
        content: [
            {
                title: 'Voir la Liste des Étudiants',
                description:
                    'Consultez tous les étudiants inscrits dans votre institution.',
                steps: [
                    'Accédez à la section "Étudiants" depuis le menu principal',
                    'Visualisez la liste complète des étudiants',
                    'Consultez leur statut, leur niveau et leurs cours',
                    'Utilisez les filtres pour affiner votre recherche',
                    'Cliquez sur un étudiant pour voir son profil détaillé',
                ],
                tips: [
                    'Vous pouvez exporter la liste des étudiants',
                    'Utilisez les filtres par cours, niveau ou statut',
                    "Les profils incluent l'historique d'apprentissage complet",
                ],
            },
            {
                title: 'Gérer les Inscriptions',
                description:
                    "Approuver ou rejeter les demandes d'inscription des étudiants.",
                steps: [
                    'Allez à la section "Étudiants" et consultez les demandes',
                    "Examinez les demandes d'inscription en attente",
                    "Vérifiez les informations fournies par l'étudiant",
                    'Cliquez sur "Approuver" pour confirmer l\'inscription',
                    'Ou "Rejeter" avec une explication si nécessaire',
                    "L'étudiant reçoit une notification de votre décision",
                ],
                tips: [
                    'Vérifiez les documents requis avant approbation',
                    "Gardez un registre des décisions d'inscription",
                    'Communiquez clairement les raisons de rejet si nécessaire',
                ],
            },
            {
                title: 'Assigner des Étudiants aux Cours',
                description:
                    'Enrôlez les étudiants dans des cours spécifiques.',
                steps: [
                    'Ouvrez un cours depuis la section "Cours"',
                    'Allez à l\'onglet "Participants" ou "Assignation"',
                    'Cliquez sur "Ajouter des étudiants"',
                    'Sélectionnez les étudiants à assigner',
                    "Confirmez l'assignation",
                    'Les étudiants reçoivent une notification',
                ],
                tips: [
                    'Vous pouvez assigner plusieurs étudiants à la fois',
                    'Consultez la liste des étudiants déjà inscrits',
                    'Les étudiants peuvent refuser une assignation',
                ],
            },
        ],
    },
    {
        id: 'teachers',
        title: 'Gestion des Enseignants',
        icon: <CheckSquare className="h-6 w-6" />,
        description: "Gérer les profils et l'assignation des enseignants",
        content: [
            {
                title: 'Voir la Liste des Enseignants',
                description:
                    'Consultez tous les enseignants de votre institution.',
                steps: [
                    'Accédez à la section "Enseignants" depuis le menu principal',
                    'Visualisez la liste de tous les enseignants',
                    'Consultez leur statut, leurs spécialités et leurs cours',
                    'Utilisez les filtres pour rechercher des enseignants',
                    'Cliquez sur un enseignant pour voir son profil',
                ],
                tips: [
                    "Vous pouvez consulter l'historique des enseignants",
                    'Filtrez par spécialité ou département',
                    'Importez de nouveaux enseignants en masse si nécessaire',
                ],
            },
            {
                title: 'Ajouter un Enseignant',
                description:
                    'Enregistrer un nouvel enseignant dans votre institution.',
                steps: [
                    'Allez à la section "Enseignants"',
                    'Cliquez sur "Nouvel Enseignant"',
                    'Remplissez les informations personnelles',
                    "Configurez l'accès et les permissions",
                    "Assignez les domaines d'expertise",
                    'Créez le compte et enregistrez',
                    "L'enseignant reçoit ses identifiants de connexion",
                ],
                tips: [
                    "Vérifiez les qualifications avant d'ajouter",
                    'Définissez les permissions selon leur niveau',
                    'Vous pouvez importer plusieurs enseignants à la fois',
                ],
            },
            {
                title: 'Assigner des Cours aux Enseignants',
                description:
                    'Attribuez des cours aux enseignants de votre institution.',
                steps: [
                    'Ouvrez un enseignant ou un cours',
                    'Allez à l\'onglet "Assignations" ou "Cours"',
                    'Cliquez sur "Assigner un cours"',
                    'Sélectionnez le cours et confirmez',
                    "L'enseignant reçoit la notification d'assignation",
                    'Il peut commencer à créer du contenu',
                ],
                tips: [
                    'Vérifiez les compétences avant assignation',
                    'Vous pouvez assigner plusieurs cours à un enseignant',
                    'Les assignations peuvent être temporaires ou permanentes',
                ],
            },
        ],
    },
    {
        id: 'domaines',
        title: 'Gestion des Domaines',
        icon: <Target className="h-6 w-6" />,
        description: "Créer et gérer les domaines d'études de l'institution",
        content: [
            {
                title: 'Voir la Liste des Domaines',
                description:
                    "Consultez tous les domaines d'études proposés par votre institution.",
                steps: [
                    'Accédez à la section "Domaines" depuis le menu principal',
                    'Visualisez la liste de tous les domaines',
                    'Consultez les informations de chaque domaine',
                    'Voyez le nombre de cours par domaine',
                    'Cliquez sur un domaine pour ses détails',
                ],
                tips: [
                    'Les domaines organisent votre offre pédagogique',
                    'Utilisez des noms clairs et descriptifs',
                    "Consultez les statistiques d'inscription par domaine",
                ],
            },
            {
                title: 'Créer un Domaine',
                description:
                    "Ajouter un nouveau domaine d'études à votre institution.",
                steps: [
                    'Allez à la section "Domaines"',
                    'Cliquez sur "Nouveau Domaine"',
                    'Entrez le nom du domaine',
                    'Ajoutez une description détaillée',
                    "Configurez les paramètres d'accès",
                    'Enregistrez le domaine',
                ],
                tips: [
                    'Organisez vos domaines de façon logique',
                    'Une bonne description aide les étudiants à choisir',
                    'Vous pouvez modifier les domaines à tout moment',
                ],
            },
            {
                title: 'Gérer les Sous-domaines',
                description:
                    'Organiser les domaines avec des catégories enfants.',
                steps: [
                    'Ouvrez un domaine',
                    'Allez à l\'onglet "Sous-domaines"',
                    'Cliquez sur "Ajouter une catégorie"',
                    'Entrez le nom et la description',
                    'Organisez la hiérarchie des catégories',
                    'Enregistrez les modifications',
                ],
                tips: [
                    'Les sous-domaines permettent une meilleure organisation',
                    'Limitez à 3-4 niveaux de profondeur maximum',
                    'Utilisez une hiérarchie cohérente',
                ],
            },
        ],
    },
    {
        id: 'locations',
        title: 'Gestion des Localisations',
        icon: <MapPin className="h-6 w-6" />,
        description:
            "Gérer les sites physiques et localisations de l'institution",
        content: [
            {
                title: 'Voir la Liste des Localisations',
                description:
                    'Consultez tous les sites et localisations de votre institution.',
                steps: [
                    'Accédez à la section "Localisations" depuis le menu principal',
                    'Visualisez la liste de tous les sites',
                    "Consultez les informations d'adresse et de contact",
                    "Voyez le nombre d'activités par localisation",
                    'Cliquez sur une localisation pour ses détails',
                ],
                tips: [
                    "Les localisations permettent d'organiser les activités",
                    'Consultez la capacité de chaque site',
                    'Gardez les adresses à jour',
                ],
            },
            {
                title: 'Ajouter une Localisation',
                description:
                    'Enregistrer un nouveau site physique pour votre institution.',
                steps: [
                    'Allez à la section "Localisations"',
                    'Cliquez sur "Nouvelle Localisation"',
                    'Entrez le nom du site',
                    "Configurez l'adresse complète",
                    'Ajoutez les informations de contact',
                    'Spécifiez la capacité et les équipements',
                    'Enregistrez la localisation',
                ],
                tips: [
                    'Une adresse précise aide pour les activités',
                    'Mettez à jour les informations si elles changent',
                    'Vous pouvez définir les équipements disponibles',
                ],
            },
            {
                title: 'Gérer les Espaces et Ressources',
                description:
                    'Configurer les salles, équipements et ressources disponibles.',
                steps: [
                    'Ouvrez une localisation',
                    'Allez à l\'onglet "Espaces" ou "Ressources"',
                    'Cliquez sur "Ajouter un espace" ou "Ajouter une ressource"',
                    'Entrez les détails (nom, capacité, équipement)',
                    'Définissez les horaires de disponibilité',
                    'Enregistrez les informations',
                ],
                tips: [
                    'Cataloguez tous vos espaces disponibles',
                    'Définissez les capacités réalistes',
                    'Maintenez à jour les équipements disponibles',
                ],
            },
        ],
    },
    {
        id: 'profile',
        title: "Paramètres de l'Institution",
        icon: <Settings className="h-6 w-6" />,
        description:
            "Configurer les informations et les paramètres de l'institution",
        content: [
            {
                title: "Modifier le Profil de l'Institution",
                description:
                    'Mettre à jour les informations générales de votre institution.',
                steps: [
                    'Accédez à la section "Profil" ou "Paramètres"',
                    "Consultez les informations actuelles de l'institution",
                    'Cliquez sur "Modifier" pour éditer',
                    'Mettez à jour le nom, la description et le logo',
                    'Configurez les informations de contact',
                    'Définissez les paramètres de sécurité',
                    'Enregistrez les modifications',
                ],
                tips: [
                    'Gardez votre profil à jour',
                    'Utilisez un logo professionnel',
                    'Mettez en avant votre mission et valeurs',
                ],
            },
            {
                title: 'Configurer les Paramètres Généraux',
                description: 'Gérer les paramètres généraux de la plateforme.',
                steps: [
                    'Allez à la section "Paramètres"',
                    'Consultez les différentes options disponibles',
                    'Configurez la langue par défaut',
                    'Définissez les paramètres de notification',
                    "Gérez les permissions d'accès",
                    'Enregistrez les modifications',
                ],
                tips: [
                    'Testez les paramètres avant de les finaliser',
                    'Notifiez les utilisateurs des changements importants',
                    'Documentez vos configurations',
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
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
            }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`mt-1 ${
                        isActive ? 'text-indigo-600' : 'text-gray-600'
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
            <div className="flex items-start gap-4 border-b-2 border-indigo-200 pb-4">
                <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
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
                            <div className="mt-5 rounded border-l-4 border-green-500 bg-green-50 p-4">
                                <h4 className="mb-2 flex items-center gap-2 font-semibold text-green-900">
                                    <Lightbulb className="h-4 w-4" />
                                    Conseils utiles :
                                </h4>
                                <ul className="space-y-2">
                                    {item.tips.map((tip, tipIndex) => (
                                        <li
                                            key={tipIndex}
                                            className="flex items-start gap-2 text-sm text-green-800"
                                        >
                                            <span className="mt-0.5 font-bold text-green-600">
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

export default function InstitutDocumentation() {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    const currentSection = sections.find((s) => s.id === activeSection);

    return (
        <InstitutLayouts breadcrumbs={breadcrumbs} title="Documentation">
            <div className="space-y-6">
                {/* Header */}
                <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white">
                    <div className="flex items-start gap-4">
                        <div className="bg-opacity-20 rounded-lg bg-white p-3">
                            <HelpCircle className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Bienvenue dans la Documentation
                            </h1>
                            <p className="mt-2 text-indigo-100">
                                Apprenez comment gérer votre institution et
                                tirer le meilleur parti de toutes les
                                fonctionnalités de la plateforme.
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
                        <MessageCircle className="h-6 w-6 text-indigo-600" />
                        Questions Fréquemment Posées
                    </h2>
                    <div className="space-y-4">
                        <details className="cursor-pointer border-l-4 border-indigo-500 py-3 pl-4">
                            <summary className="font-semibold text-gray-900 hover:text-indigo-600">
                                Comment puis-je approuver les cours des
                                enseignants ?
                            </summary>
                            <p className="mt-3 text-gray-700">
                                Accédez à la section "Cours", filtrez par statut
                                "En attente", et consultez les détails de chaque
                                cours. Après avoir vérifié le contenu et
                                vérifier qu\'il respecte vos standards, cliquez
                                sur "Approuver" pour autoriser sa publication.
                            </p>
                        </details>
                        <details className="cursor-pointer border-l-4 border-indigo-500 py-3 pl-4">
                            <summary className="font-semibold text-gray-900 hover:text-indigo-600">
                                Comment gérer les inscriptions des étudiants ?
                            </summary>
                            <p className="mt-3 text-gray-700">
                                Allez à la section "Étudiants" pour consulter
                                les demandes d\'inscription en attente. Examinez
                                les informations fournies et approuvez ou
                                rejetez chaque demande. Les étudiants reçoivent
                                une notification de votre décision.
                            </p>
                        </details>
                        <details className="cursor-pointer border-l-4 border-indigo-500 py-3 pl-4">
                            <summary className="font-semibold text-gray-900 hover:text-indigo-600">
                                Comment assigner des enseignants à des cours ?
                            </summary>
                            <p className="mt-3 text-gray-700">
                                Ouvrez un cours depuis la section "Cours", allez
                                à l\'onglet "Enseignants" ou "Assignations", et
                                cliquez sur "Assigner un enseignant".
                                Sélectionnez l\'enseignant qualifié et
                                confirmez. L\'enseignant reçoit la notification
                                et peut commencer à créer du contenu.
                            </p>
                        </details>
                        <details className="cursor-pointer border-l-4 border-indigo-500 py-3 pl-4">
                            <summary className="font-semibold text-gray-900 hover:text-indigo-600">
                                Comment organiser les domaines d\'études ?
                            </summary>
                            <p className="mt-3 text-gray-700">
                                Utilisez la section "Domaines" pour créer et
                                organiser vos domaines d\'études. Vous pouvez
                                créer une hiérarchie avec des sous-domaines pour
                                une meilleure organisation. Chaque domaine peut
                                contenir plusieurs cours.
                            </p>
                        </details>
                        <details className="cursor-pointer border-l-4 border-indigo-500 py-3 pl-4">
                            <summary className="font-semibold text-gray-900 hover:text-indigo-600">
                                Puis-je importer plusieurs utilisateurs à la
                                fois ?
                            </summary>
                            <p className="mt-3 text-gray-700">
                                Oui ! Dans les sections "Enseignants" ou
                                "Étudiants", vous trouverez une option
                                "Importer" qui vous permet de charger un fichier
                                CSV avec plusieurs enregistrements. Cela
                                accélère le processus d\'enregistrement de
                                masse.
                            </p>
                        </details>
                    </div>
                </div>

                {/* Support Section */}
                <div className="mt-8 rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
                    <div className="flex items-start gap-4">
                        <FileText className="mt-1 h-6 w-6 flex-shrink-0 text-indigo-600" />
                        <div>
                            <h3 className="font-bold text-gray-900">
                                Besoin d\'aide supplémentaire ?
                            </h3>
                            <p className="mt-2 text-gray-700">
                                Consultez notre base de connaissances complète
                                ou contactez l\'équipe de support technique.
                                Nous sommes disponibles pour vous aider à
                                optimiser votre gestion institutionnelle et
                                répondre à toutes vos questions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Spacer />
        </InstitutLayouts>
    );
}
