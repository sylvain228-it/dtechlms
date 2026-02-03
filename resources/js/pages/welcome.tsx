import HomeCarousel from '@/components/public/home-carousel';
import PublicNavbar from '@/layouts/public/nav-bar';
import {
    ArrowRight,
    Award,
    BarChart3,
    BookOpen,
    Building2,
    CheckCircle,
    Globe,
    Lightbulb,
    Mail,
    Play,
    Smartphone,
    Target,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletterSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            <HomeCarousel />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 md:py-24">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-400 mix-blend-multiply blur-3xl filter"></div>
                    <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-purple-400 mix-blend-multiply blur-3xl filter"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
                            Apprentissage Hybride de
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {' '}
                                Nouvelle Génération
                            </span>
                        </h1>
                        <p className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl">
                            DtechLMS est une plateforme complète de gestion
                            d'apprentissage qui combine l'enseignement en ligne
                            et en présentiel. Offrez à vos étudiants une
                            expérience d'apprentissage flexible, engageante et
                            riche.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg">
                                <Play className="h-5 w-5" />
                                Démarrer Gratuitement
                            </button>
                            <button className="rounded-lg border-2 border-gray-300 px-8 py-3 font-semibold text-gray-900 transition-all duration-300 hover:border-blue-600 hover:text-blue-600">
                                En Savoir Plus
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: Users, value: '50K+', label: 'Étudiants' },
                            { icon: BookOpen, value: '1K+', label: 'Cours' },
                            {
                                icon: Award,
                                value: '500+',
                                label: 'Certifications',
                            },
                            {
                                icon: TrendingUp,
                                value: '98%',
                                label: 'Satisfaction',
                            },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="mb-4 inline-block rounded-full bg-blue-100 p-4">
                                    <stat.icon className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="mb-2 text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">
                            Fonctionnalités Principales
                        </h2>
                        <p className="text-xl text-gray-600">
                            Tout ce dont vous avez besoin pour gérer un
                            apprentissage efficace
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: BookOpen,
                                title: 'Gestion Complète des Cours',
                                description:
                                    'Créez et organisez des cours avec modules, séquences, ressources et activités interactives.',
                                image: '/assets/fonctionnalité-1.jpeg',
                            },
                            {
                                icon: Users,
                                title: 'Collaboration en Temps Réel',
                                description:
                                    "Discussions, groupes d'étude, et conversations directes entre enseignants et étudiants.",
                                image: '/assets/fonctionnalité-02.jpeg',
                            },
                            {
                                icon: Target,
                                title: 'Évaluations Avancées',
                                description:
                                    "Questionnaires interactifs, grilles d'évaluation personnalisées et suivi des progrès en temps réel.",
                                image: '/assets/afro_student-3.jpeg',
                            },
                            {
                                icon: Award,
                                title: 'Badges & Certifications',
                                description:
                                    'Système de récompenses pour motiver les apprenants et reconnaître leurs accomplissements.',
                                image: '/assets/afro_student-2.jpg',
                            },
                            {
                                icon: Smartphone,
                                title: 'Accès Mobile',
                                description:
                                    "Apprenez de n'importe où, n'importe quand avec notre application mobile responsive.",
                                image: '/assets/fonctionnalité-4.jpeg',
                            },
                            {
                                icon: BarChart3,
                                title: 'Analytics Détaillées',
                                description:
                                    'Tableaux de bord intuitifs pour suivre les performances et identifier les lacunes.',
                                image: '/assets/fonctionnalité-6.jpeg',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
                            >
                                <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3">
                                    <feature.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="mb-3 line-clamp-1 text-xl font-bold text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="mb-4 line-clamp-2 text-gray-600">
                                    {feature.description}
                                </p>
                                <div className="rounded-t-md border border-gray-300 p-2 shadow-md">
                                    <img
                                        src={feature.image}
                                        alt=""
                                        className="h-[150px] w-full rounded-b-md object-cover object-top"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hybrid Learning Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="mb-6 text-4xl font-bold text-gray-900">
                                Apprentissage Hybride Optimisé
                            </h2>
                            <p className="mb-8 text-lg text-gray-600">
                                Combinez le meilleur de l'enseignement en ligne
                                et en présentiel pour créer une expérience
                                d'apprentissage complète et flexible.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    'Sessions virtuelles et en présentiel intégrées',
                                    'Calendrier unifié des événements',
                                    'Gestion des lieux et des ressources physiques',
                                    'Conférences et ateliers interactifs',
                                    'Suivi de la présence automatisé',
                                    'Contenu synchrone et asynchrone',
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span className="text-gray-700">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-12 text-center">
                            <Globe className="mx-auto mb-4 h-24 w-24 text-blue-600" />
                            <div className="rounded-t-md border border-gray-300 p-2 shadow-md">
                                <img
                                    src="/assets/afro_student-1.jpg"
                                    alt=""
                                    className="max-h-[500px] w-full rounded-b-md object-cover object-top"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Opportunities Section */}
            <section className="bg-gradient-to-br from-indigo-50 to-blue-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">
                            Opportunités pour Apprenants
                        </h2>
                        <p className="text-xl text-gray-600">
                            Développez vos compétences et avancez dans votre
                            carrière
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {[
                            {
                                icon: Lightbulb,
                                title: 'Apprentissage Personnalisé',
                                description:
                                    "Chemins d'apprentissage adapté à votre rythme et à vos objectifs spécifiques.",
                            },
                            {
                                icon: Target,
                                title: 'Compétences Professionnelles',
                                description:
                                    'Acquérez des compétences demandées par le marché du travail.',
                            },
                            {
                                icon: Award,
                                title: 'Certifications Reconnues',
                                description:
                                    'Obtenez des certifications valorisables dans votre domaine.',
                            },
                            {
                                icon: Users,
                                title: "Communauté d'Apprenants",
                                description:
                                    "Connectez-vous avec d'autres étudiants et enseignants du monde entier.",
                            },
                            {
                                icon: BarChart3,
                                title: 'Suivi des Progrès',
                                description:
                                    'Visualisez vos avancées et identifiez les domaines à améliorer.',
                            },
                            {
                                icon: Zap,
                                title: 'Accès Illimité',
                                description:
                                    'Révisez le contenu autant de fois que vous le souhaitez.',
                            },
                        ].map((opportunity, index) => (
                            <div
                                key={index}
                                className="rounded-lg border-l-4 border-blue-600 bg-white p-8 transition-all duration-300 hover:shadow-md"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                        <opportunity.icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-lg font-bold text-gray-900">
                                            {opportunity.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {opportunity.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">
                            Comment Ça Marche ?
                        </h2>
                        <p className="text-xl text-gray-600">
                            4 étapes simples pour commencer votre apprentissage
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        {[
                            {
                                step: 1,
                                title: "S'inscrire",
                                description:
                                    'Créez votre compte gratuitement en quelques secondes',
                            },
                            {
                                step: 2,
                                title: 'Choisir un Cours',
                                description:
                                    'Explorez nos milliers de cours disponibles',
                            },
                            {
                                step: 3,
                                title: 'Apprendre',
                                description:
                                    'Suivez le cours à votre rythme avec du contenu riche',
                            },
                            {
                                step: 4,
                                title: 'Certifier',
                                description:
                                    'Obtenez votre certificat après avoir complété le cours',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white">
                                    {item.step}
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">
                                    {item.description}
                                </p>
                                {index < 3 && (
                                    <div className="absolute top-1/2 right-0 hidden translate-x-1/2 -translate-y-1/2 transform md:block">
                                        <ArrowRight className="h-6 w-6 text-gray-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">
                            Utilisé Par
                        </h2>
                        <p className="text-xl text-gray-600">
                            Universités, centres de formation et organisations
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: BookOpen,
                                title: 'Universités',
                                description:
                                    "Offrez une expérience d'apprentissage moderne à vos étudiants avec un LMS complet.",
                            },
                            {
                                icon: Zap,
                                title: 'Centres de Formation',
                                description:
                                    'Développez vos programmes et suivez efficacement la progression des apprenants.',
                            },
                            {
                                icon: Building2,
                                title: 'Entreprises',
                                description:
                                    "Formez vos collaborateurs avec des programmes d'apprentissage structurés.",
                            },
                        ].map((useCase, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-blue-300 hover:shadow-lg"
                            >
                                <div className="mb-4 inline-block rounded-lg bg-blue-100 p-4">
                                    <useCase.icon className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-gray-900">
                                    {useCase.title}
                                </h3>
                                <p className="text-gray-600">
                                    {useCase.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center text-white">
                        <Mail className="mx-auto mb-4 h-12 w-12 opacity-80" />
                        <h2 className="mb-4 text-4xl font-bold">
                            Restez Informé
                        </h2>
                        <p className="mb-8 text-lg opacity-90">
                            Recevez les derniers conseils pédagogiques, mises à
                            jour des cours et offres exclusives directement dans
                            votre boîte de réception.
                        </p>

                        <form
                            onSubmit={handleNewsletterSubscribe}
                            className="mb-4 w-full"
                        >
                            <div className="flex flex-col items-center justify-between gap-3 rounded-b-md bg-gray-100 sm:flex-row sm:rounded-r-md">
                                <input
                                    type="email"
                                    placeholder="Entrez votre adresse email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-md border-0 px-4 py-3 text-gray-800 focus:border-0 focus:outline-0"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn-primary flex items-center gap-1 !py-3"
                                >
                                    S'abonner
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </form>

                        {subscribed && (
                            <div className="text-center text-blue-100">
                                ✓ Merci de vous être abonné! Consultez votre
                                email.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-16 text-gray-300">
                <div className="container mx-auto px-4">
                    <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
                        {/* About */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white">
                                DtechLMS
                            </h3>
                            <p className="text-sm">
                                La plateforme de gestion d'apprentissage hybride
                                de nouvelle génération pour universités,
                                organisations et centres de formation.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="mb-4 font-bold text-white">
                                Produit
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Fonctionnalités
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Sécurité
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Documentation
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="mb-4 font-bold text-white">
                                Entreprise
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        À Propos
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Carrières
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="mb-4 font-bold text-white">Légal</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Politique de Confidentialité
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Conditions d'Utilisation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Mentions Légales
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition hover:text-white"
                                    >
                                        Cookies
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <p className="text-sm">
                                © 2026 Dtech Group. Tous les droits réservés.
                            </p>
                            <div className="flex gap-6">
                                <a
                                    href="#"
                                    className="transition hover:text-white"
                                >
                                    Twitter
                                </a>
                                <a
                                    href="#"
                                    className="transition hover:text-white"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="#"
                                    className="transition hover:text-white"
                                >
                                    Facebook
                                </a>
                                <a
                                    href="#"
                                    className="transition hover:text-white"
                                >
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
