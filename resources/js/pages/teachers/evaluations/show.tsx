// import { Divider } from '@/components/divider';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
// import GetHtmlContent from '@/lib/get-html-content';
// import { handleEditClicked, subStrText } from '@/lib/tasks';
// import type {
//     ActivityScope,
//     ActivityType,
//     DeliverableType,
//     EvaluateType,
//     ModalityType,
// } from '@/lib/type';
// import {
//     getActivityScopeLabel,
//     getActivityTypeLabel,
//     getDeliverableTypeLabel,
//     getEvaluateTypeLabel,
//     getModalityTypeLabel,
//     getPlateformeConferenceLabel,
// } from '@/lib/type';
// import {
//     formatBooleanText,
//     formatCompleteDate,
//     formatDate,
//     formatMinutes,
// } from '@/lib/utils';
// import { destroy, edit } from '@/routes/teachers/activities';
// import { show as showCourse } from '@/routes/teachers/courses';
// import { show as showModule } from '@/routes/teachers/modules';
// import {
//     create as createQuiz,
//     show as viewQuiz,
// } from '@/routes/teachers/quizzes';
// import { show as showSequ } from '@/routes/teachers/sequences';
// import { Course, CourseActivity } from '@/types/models/course';
// import { Link, router, usePage } from '@inertiajs/react';
// import { ArrowRight } from 'lucide-react';

// export default function TeacherEvaluationDetails() {
//     const { activity, current_course } = usePage().props as unknown as {
//         activity: CourseActivity;
//         current_course: Course;
//     };

//     const sequence =
//         activity.scope == 'sequence' && activity.sequence_id != null
//             ? activity.sequence
//             : null;
//     const module =
//         activity.scope == 'module' && activity.module_id != null
//             ? activity.module
//             : null;
//     const course =
//         activity.scope == 'course' && activity.course_id != null
//             ? activity.course
//             : null;

//     // Actions
//     const handleDelete = () => {
//         if (!confirm('Confirmer la suppression de cette activité ?')) return;
//         if (!activity || !current_course) return;
//         router.delete(destroy([current_course.slug ?? '', activity.id!]));
//     };
//     const editUrl = edit([current_course.slug ?? '', activity.slug]).url;
//     const showQuiz = activity.activity_type == 'quiz';
//     return (
//         <TeacherLayouts title={`Activité : ${activity.title}`}>
//             <div className="mx-auto md:max-w-6xl">
//                 <div className="mb-6">
//                     <div className="mb-3">
//                         <div className="mt-2 line-clamp-2 text-sm text-gray-500">
//                             {course && (
//                                 <>
//                                     <Link
//                                         href={showCourse(course?.slug)}
//                                         className="inline-block hover:text-cblue"
//                                     >
//                                         {course?.title ?? 'Cours inconnu'}
//                                     </Link>
//                                     <span>/</span>
//                                 </>
//                             )}
//                             {module && (
//                                 <>
//                                     <Link
//                                         href={showModule([
//                                             current_course.slug ?? '',
//                                             module?.id,
//                                         ])}
//                                         className="inline-block hover:text-cblue"
//                                     >
//                                         {module?.title ?? 'Module'}
//                                         <span> /</span>
//                                     </Link>
//                                 </>
//                             )}
//                             {sequence && (
//                                 <>
//                                     <Link
//                                         href={showSequ([
//                                             current_course.slug ?? '',
//                                             sequence.module?.id ?? 0,
//                                             sequence?.id,
//                                         ])}
//                                         className="inline-block hover:text-cblue"
//                                     >
//                                         {sequence?.title ?? 'Séquence'}
//                                         <span> /</span>
//                                     </Link>{' '}
//                                 </>
//                             )}
//                             <span className="mt-1 inline-block text-lg font-semibold text-gray-600">
//                                 {activity.title}
//                             </span>
//                         </div>
//                         <p className="mt-2 line-clamp-2 text-sm text-gray-600">
//                             {activity.description
//                                 ? activity.description
//                                 : 'Aucune description fournie.'}
//                         </p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <Button
//                             onClick={(e) =>
//                                 handleEditClicked(
//                                     e,
//                                     activity.resources_summary ?? '',
//                                     editUrl,
//                                 )
//                             }
//                             className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-cblue"
//                         >
//                             Modifier
//                         </Button>
//                         <Button
//                             variant="destructive"
//                             onClick={handleDelete}
//                             className="rounded-md px-4 py-2 text-sm"
//                         >
//                             Supprimer
//                         </Button>
//                     </div>
//                 </div>

//                 <div className="grid gap-6 md:grid-cols-3">
//                     <div className="md:col-span-2">
//                         <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-6">
//                             <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
//                                 <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
//                                     <Badge
//                                         variant="outline"
//                                         className="capitalize"
//                                     >
//                                         {subStrText(
//                                             getActivityTypeLabel(
//                                                 activity.activity_type as ActivityType,
//                                             ),
//                                             0,
//                                             35,
//                                         )}
//                                     </Badge>
//                                     <div className="text-sm text-gray-500">
//                                         <b>Portée : </b>
//                                         <Badge>
//                                             {subStrText(
//                                                 getActivityScopeLabel(
//                                                     activity.scope as ActivityScope,
//                                                 ),
//                                                 0,
//                                                 35,
//                                             )}
//                                         </Badge>
//                                     </div>
//                                     <div className="text-sm text-gray-500">
//                                         <b>Mode : </b>
//                                         <Badge>
//                                             {subStrText(
//                                                 getModalityTypeLabel(
//                                                     activity.modality as ModalityType,
//                                                 ),
//                                                 0,
//                                                 35,
//                                             )}
//                                         </Badge>
//                                     </div>
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                     <span
//                                         className={`${activity.is_visible ? 'text-green-600' : 'text-red-600'}`}
//                                     >
//                                         {activity.is_visible
//                                             ? 'Visible'
//                                             : 'Invisible'}
//                                     </span>
//                                 </div>
//                             </div>

//                             <Separator className="my-4" />

//                             <div className="grid gap-3 md:grid-cols-3">
//                                 <div className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3">
//                                     <div className="text-xs text-gray-500">
//                                         Durée estimée
//                                     </div>
//                                     <div className="mt-1 text-lg font-bold text-gray-900">
//                                         {formatMinutes(
//                                             activity.estimated_minutes,
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3">
//                                     <div className="text-xs text-gray-500">
//                                         Durée planifiée
//                                     </div>
//                                     <div className="mt-1 text-lg font-bold text-gray-900">
//                                         {formatMinutes(
//                                             activity.duration_minutes,
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3">
//                                     <div className="text-xs text-gray-500">
//                                         Ordre
//                                     </div>
//                                     <div className="mt-1 text-lg font-bold text-gray-900">
//                                         {activity.order ?? '-'}
//                                     </div>
//                                 </div>
//                             </div>

//                             {activity.description && (
//                                 <>
//                                     <Separator className="my-4" />
//                                     <h3 className="text-sm font-semibold text-gray-700">
//                                         Description
//                                     </h3>
//                                     <div className="mt-2 text-sm text-gray-600">
//                                         {activity.description ?? ''}
//                                     </div>
//                                 </>
//                             )}
//                         </div>

//                         {/* Evaluation & Livrables */}
//                         <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
//                             <h3 className="text-lg font-semibold text-gray-800">
//                                 Évaluation & Livrables
//                             </h3>
//                             <Separator className="my-3" />
//                             <div className="grid gap-4 md:grid-cols-3">
//                                 <div className="flex items-center justify-between gap-4">
//                                     <div className="text-sm text-gray-500">
//                                         Evaluée
//                                     </div>
//                                     <div className="mt-1 text-sm font-bold text-gray-900">
//                                         {activity.is_evaluated ? 'Oui' : 'Non'}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center justify-between gap-4">
//                                     <div className="text-sm text-gray-500">
//                                         Type d'évaluation
//                                     </div>
//                                     <div className="mt-1 text-sm font-bold text-gray-900">
//                                         {activity.evaluation_type
//                                             ? getEvaluateTypeLabel(
//                                                   activity.evaluation_type as EvaluateType,
//                                               )
//                                             : '-'}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center justify-between gap-4">
//                                     <div className="text-sm text-gray-500">
//                                         Poids
//                                     </div>
//                                     <div className="mt-1 text-sm font-bold text-gray-900">
//                                         {activity.evaluation_weight ?? '-'}
//                                         {activity.note_unit}
//                                     </div>
//                                 </div>
//                             </div>

//                             <Separator className="my-3" />

//                             <div className="grid gap-4 md:grid-cols-3">
//                                 <div className="flex items-center justify-between gap-4">
//                                     <div className="text-sm text-gray-500">
//                                         A un livrable
//                                     </div>
//                                     <div className="mt-1 text-sm font-bold text-gray-900">
//                                         {formatBooleanText(
//                                             activity.has_deliverable == 1,
//                                         )}
//                                     </div>
//                                 </div>
//                                 {activity.has_deliverable && (
//                                     <>
//                                         <div>
//                                             <div className="text-sm text-gray-500">
//                                                 Type de livraison
//                                             </div>
//                                             <div className="mt-1 text-sm font-bold text-gray-900">
//                                                 {activity.deliverable_type
//                                                     ? getDeliverableTypeLabel(
//                                                           activity.deliverable_type as DeliverableType,
//                                                       )
//                                                     : '-'}
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center justify-between gap-4">
//                                             <div className="text-sm text-gray-500">
//                                                 Date limite
//                                             </div>
//                                             <div className="mt-1 text-sm font-bold text-gray-900">
//                                                 {formatDate(
//                                                     activity.deliverable_deadline,
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>

//                             <Separator className="my-3" />

//                             <div className="grid gap-4 md:grid-cols-3">
//                                 {activity.requires_feedback && (
//                                     <div className="flex items-center justify-between gap-4">
//                                         <div className="text-sm text-gray-500">
//                                             Feedback requis
//                                         </div>
//                                         <div className="mt-1 text-sm font-bold text-gray-900">
//                                             {activity.requires_feedback
//                                                 ? 'Oui'
//                                                 : 'Non'}
//                                         </div>
//                                     </div>
//                                 )}
//                                 {activity.has_deliverable && (
//                                     <>
//                                         <div className="flex items-center justify-between gap-4">
//                                             <div className="text-sm text-gray-500">
//                                                 Autorise resoumission
//                                             </div>
//                                             <div className="mt-1 text-sm font-bold text-gray-900">
//                                                 {activity.allows_resubmission
//                                                     ? 'Oui'
//                                                     : 'Non'}
//                                             </div>
//                                         </div>
//                                         {activity.max_attempts && (
//                                             <div className="flex items-center justify-between gap-4">
//                                                 <div className="text-sm text-gray-500">
//                                                     Nombre max de tentatives
//                                                 </div>
//                                                 <div className="mt-1 text-sm font-bold text-gray-900">
//                                                     {activity.max_attempts ??
//                                                         '-'}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                         <Divider />
//                         {activity.resources_summary && (
//                             <div>
//                                 <Separator className="my-4" />
//                                 <h3 className="text-sm font-semibold text-gray-700">
//                                     Consignes pédagogiques, Ressources & résumé
//                                 </h3>
//                                 <div className="mt-2 text-sm text-gray-600">
//                                     <GetHtmlContent
//                                         contentHtml={
//                                             activity.resources_summary ?? ''
//                                         }
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Right column */}
//                     <aside className="order-first lg:order-last">
//                         {showQuiz && (
//                             <div className="top-24 my-4 rounded-lg border border-gray-400 bg-white p-6 shadow-sm sm:sticky dark:bg-cdcard">
//                                 <h4 className="inline-block border-b border-gray-300 pb-1 text-sm font-semibold">
//                                     Quize
//                                 </h4>
//                                 {activity.quiz ? (
//                                     <div className="mt-3">
//                                         <h3 className="text-md font-semibold text-cblue">
//                                             <Link
//                                                 href={viewQuiz([
//                                                     activity.slug,
//                                                     activity.quiz?.slug,
//                                                 ])}
//                                             >
//                                                 {activity.quiz?.title}
//                                             </Link>
//                                         </h3>
//                                     </div>
//                                 ) : (
//                                     <Link
//                                         href={createQuiz(activity.slug)}
//                                         className="btn-primary mt-3 flex items-center justify-center gap-3 text-white"
//                                     >
//                                         Ajouter <ArrowRight />
//                                     </Link>
//                                 )}
//                             </div>
//                         )}
//                         <div className="my-4 rounded-lg border bg-white p-3 shadow-sm sm:p-4">
//                             <h4 className="text-sm font-semibold text-gray-700">
//                                 Planification
//                             </h4>
//                             <div className="mt-3 text-sm text-gray-600">
//                                 <div className="flex items-center justify-between">
//                                     <div className="text-xs text-gray-500">
//                                         Début
//                                     </div>
//                                     <div className="font-medium text-gray-900">
//                                         {formatCompleteDate(
//                                             activity.start_at ?? '',
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="mt-3 flex items-center justify-between">
//                                     <div className="text-xs text-gray-500">
//                                         Synchronous
//                                     </div>
//                                     <div className="font-medium text-gray-900">
//                                         {formatBooleanText(
//                                             activity.is_synchronous,
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="mt-3 flex items-center justify-between">
//                                     <div className="text-xs text-gray-500">
//                                         Durée
//                                     </div>
//                                     <div className="font-medium text-gray-900">
//                                         {formatMinutes(
//                                             activity.duration_minutes,
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {activity.conference_platform ||
//                             activity.conference_url ? (
//                                 <>
//                                     <Separator className="my-3" />
//                                     <h5 className="text-sm font-semibold text-gray-700">
//                                         Visioconférence
//                                     </h5>
//                                     <div className="mt-2 text-sm text-gray-600">
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-28 text-xs text-gray-500">
//                                                 Plateforme
//                                             </div>
//                                             <div className="font-medium text-gray-900">
//                                                 {activity.conference_platform
//                                                     ? subStrText(
//                                                           getPlateformeConferenceLabel(
//                                                               activity.conference_platform,
//                                                           ),
//                                                           0,
//                                                           30,
//                                                       )
//                                                     : '-'}
//                                             </div>
//                                         </div>
//                                         <div className="mt-2 flex flex-wrap items-center gap-2">
//                                             <div className="w-28 text-xs text-gray-500">
//                                                 URL
//                                             </div>
//                                             <div className="font-medium text-cblue">
//                                                 <a
//                                                     href={
//                                                         activity.conference_url ??
//                                                         '#'
//                                                     }
//                                                     target="_blank"
//                                                     rel="noreferrer"
//                                                 >
//                                                     {activity.conference_url}
//                                                 </a>
//                                             </div>
//                                         </div>
//                                         {activity.conference_meeting_id && (
//                                             <div className="mt-2 flex items-center gap-2">
//                                                 <div className="w-28 text-xs text-gray-500">
//                                                     ID
//                                                 </div>
//                                                 <div className="font-medium text-gray-900">
//                                                     {
//                                                         activity.conference_meeting_id
//                                                     }
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </>
//                             ) : null}

//                             <Separator className="my-3" />

//                             <h5 className="text-sm font-semibold text-gray-700">
//                                 Visibilité & présence
//                             </h5>
//                             <div className="mt-2 text-sm text-gray-600">
//                                 <div className="flex items-center justify-between">
//                                     <div className="text-xs text-gray-500">
//                                         Présence requise
//                                     </div>
//                                     <div className="font-medium text-gray-900">
//                                         {formatBooleanText(
//                                             activity.attendance_required,
//                                         )}
//                                     </div>
//                                 </div>
//                                 {!activity.attendance_required && (
//                                     <div className="mt-3 flex items-center justify-between">
//                                         <div className="text-xs text-gray-500">
//                                             Obligatoire
//                                         </div>
//                                         <div className="font-medium text-gray-900">
//                                             {activity.is_mandatory
//                                                 ? 'Oui'
//                                                 : 'Non'}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </aside>
//                 </div>
//             </div>
//         </TeacherLayouts>
//     );
// }
