import StudentLayouts from '@/layouts/student/student-layouts';
import { calendars } from '@/routes/students/activities';
import { index as course } from '@/routes/students/courses';
import { index as evaluation } from '@/routes/students/evaluations';
import { index as quizzes } from '@/routes/students/quizzes';
import { Link } from '@inertiajs/react';

export default function StudentInterfaceDocs() {
    return (
        <StudentLayouts title="Documentation étudiant">
            <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                <div className="mb-3">
                    <h1 className="text-2xl font-bold">
                        Guide d'utilisation — Espace étudiant
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Ce guide explique comment naviguer et utiliser les
                        principales fonctionnalités de l'interface étudiant. Les
                        sections ci-dessous sont concises et optimisées pour
                        mobile et desktop.
                    </p>
                </div>
                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Main content */}
                    <div className="lg:col-span-3">
                        <section id="navigation" className="mt-6">
                            <h2 className="text-lg font-semibold">
                                Navigation
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Le menu principal se trouve dans la barre
                                supérieure et le menu latéral. Sur mobile,
                                utilisez le bouton menu (icône hamburger /
                                profil) pour ouvrir la navigation.
                            </p>
                            <ul className="mt-2 list-inside list-disc text-sm text-gray-600 dark:text-gray-300">
                                <li>
                                    Accédez à <strong>Mes Cours</strong> pour
                                    voir vos formations.
                                </li>
                                <li>
                                    Le menu utilisateur (en haut à droite) donne
                                    accès au profil et aux paramètres.
                                </li>
                                <li>
                                    Sur écrans larges, le panneau latéral
                                    affiche les sections principales pour un
                                    accès rapide.
                                </li>
                            </ul>
                        </section>

                        <section id="cours" className="mt-6">
                            <h2 className="text-lg font-semibold">Cours </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Pour consulter un cours :{' '}
                                <strong>Mes Cours &gt; Choisir un cours</strong>
                                . Un cours est structuré en modules et
                                séquences.
                            </p>
                            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                <li>
                                    Ouvrez un module pour voir les séquences et
                                    ressources.
                                </li>
                                <li>
                                    Chaque séquence peut contenir vidéos,
                                    documents et activités.
                                </li>
                                <li>
                                    Utilisez la navigation de module pour suivre
                                    votre progression.
                                </li>
                            </ol>
                        </section>

                        <section id="lectures" className="mt-6">
                            <h2 className="text-lg font-semibold">
                                Lectures et contenu
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Pendant la lecture d'un contenu, vous pouvez :
                            </p>
                            <ul className="mt-2 list-inside list-disc text-sm text-gray-600 dark:text-gray-300">
                                <li>Télécharger les ressources disponibles.</li>
                                <li>
                                    Marquer une séquence comme terminée si
                                    l'option est disponible.
                                </li>
                                <li>
                                    Revenir facilement aux autres séquences
                                    depuis la barre de navigation du cours.
                                </li>
                            </ul>
                        </section>

                        <section id="quiz" className="mt-6">
                            <h2 className="text-lg font-semibold">
                                Quiz & Evaluations
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Accédez à la rubrique <strong>Quiz</strong> pour
                                voir les évaluations disponibles. Les étapes
                                générales :
                            </p>
                            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                <li>
                                    Cliquer sur <strong>Commencer</strong> pour
                                    lancer le quiz.
                                </li>
                                <li>
                                    Respecter la durée indiquée (si limitée).
                                </li>
                                <li>
                                    Vérifier vos réponses et{' '}
                                    <strong>Soumettre</strong> avant la fin du
                                    temps.
                                </li>
                            </ol>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Conseil : sur mobile, activez le mode avion si
                                vous souhaitez éviter les interruptions réseau —
                                mais ne fermez pas l'onglet avant d'avoir
                                soumis.
                            </p>
                        </section>

                        <section id="calendrier" className="mt-6">
                            <h2 className="text-lg font-semibold">
                                Calendrier & Activités
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Le calendrier montre les sessions, dates limites
                                et événements. Ouvrez un événement pour voir les
                                détails et actions possibles (participer,
                                ajouter un rappel, etc.).
                            </p>
                        </section>

                        <section id="discussions" className="mt-6">
                            <h2 className="text-lg font-semibold">
                                Discussions & Messages
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Utilisez la section Discussions pour poser des
                                questions au formateur ou échanger avec d'autres
                                étudiants. Envoyez des messages clairs et
                                pertinents, et joignez des fichiers si
                                nécessaire.
                            </p>
                        </section>

                        <section id="profil" className="mt-6">
                            <h2 className="text-lg font-semibold">
                                Profil & Paramètres
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Ouvrez le menu utilisateur en haut à droite pour
                                modifier votre profil, changer votre mot de
                                passe ou gérer les notifications.
                            </p>
                        </section>

                        <section id="support" className="mt-6">
                            <h2 className="text-lg font-semibold">
                                Support & FAQ
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Si vous rencontrez un problème technique ou une
                                question pédagogique :
                            </p>
                            <ul className="mt-2 list-inside list-disc text-sm text-gray-600 dark:text-gray-300">
                                <li>Consultez les discussions du cours.</li>
                                <li>
                                    Contactez le support technique via le
                                    formulaire ou l'adresse fournie par
                                    l'établissement.
                                </li>
                            </ul>
                        </section>

                        <section id="raccourcis" className="mt-6">
                            <h2 className="text-lg font-semibold">
                                Raccourcis et bonnes pratiques
                            </h2>
                            <ul className="mt-2 list-inside list-disc text-sm text-gray-600 dark:text-gray-300">
                                <li>
                                    Sauvegardez souvent vos réponses dans les
                                    évaluations si possible.
                                </li>
                                <li>
                                    Utilisez un bureau ou tablette pour les
                                    contenus vidéo lourds.
                                </li>
                                <li>
                                    Vérifiez vos notifications régulièrement
                                    pour ne manquer aucune échéance.
                                </li>
                            </ul>
                        </section>

                        <div className="mt-8 border-t pt-4 text-sm text-gray-600 dark:text-gray-300">
                            <p>Besoin d'aide personnalisée ?</p>
                            <p className="mt-2">
                                Si vous avez toujours des questions, contactez
                                votre instructeur via la{' '}
                                <Link
                                    href="#"
                                    className="text-blue-600 hover:underline"
                                >
                                    page de discussion
                                </Link>{' '}
                                ou signalez un problème au support.
                            </p>
                        </div>
                    </div>

                    {/* Quick links / Sidebar */}
                    <aside className="order-first lg:order-last">
                        <div className="sticky top-24 rounded-lg border bg-white p-4 shadow-sm dark:bg-cdcard">
                            <h3 className="mb-2 text-sm font-semibold">
                                Accès rapide
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>
                                    <Link
                                        href={calendars()}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Activités
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={course()}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Cours
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={quizzes()}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Quiz
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={evaluation()}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Quiz & Evaluations
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </StudentLayouts>
    );
}
