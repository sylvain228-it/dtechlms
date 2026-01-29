// import TeacherLayouts from '@/layouts/teacher/teacher-layouts';
// import {
//     eventVisibilityTypeLabels,
//     getEventStatusTypeLabel,
//     getEventTypeLabel,
//     getEventVisibilityLabel,
//     getModalityTypeLabel,
//     getPlateformeConferenceLabel,
// } from '@/lib/type';
// import { formatCompleteDate, formatDate, formatMinutes } from '@/lib/utils';
// import { EventCalendar } from '@/types/models/others';
// import { router, usePage } from '@inertiajs/react';
// import {
//     ArrowLeft,
//     Calendar,
//     Clock,
//     Copy,
//     Eye,
//     FileText,
//     MapPin,
//     Video,
// } from 'lucide-react';
// import React from 'react';

// export default function TeacherEventDetails() {
//     const { event } = usePage().props as unknown as { event: EventCalendar };
//     const [copied, setCopied] = React.useState(false);

//     const getStatusBadgeColor = (status: string) => {
//         switch (status) {
//             case 'scheduled':
//                 return 'bg-blue-100 text-blue-800 border-blue-300';
//             case 'live':
//                 return 'bg-green-100 text-green-800 border-green-300';
//             case 'completed':
//                 return 'bg-gray-100 text-gray-800 border-gray-300';
//             case 'canceled':
//                 return 'bg-red-100 text-red-800 border-red-300';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const getEventTypeColor = (type: string) => {
//         switch (type) {
//             case 'formative':
//                 return 'text-blue-600 bg-blue-50 border-blue-300';
//             case 'summative':
//                 return 'text-purple-600 bg-purple-50 border-purple-300';
//             case 'certifying':
//                 return 'text-green-600 bg-green-50 border-green-300';
//             default:
//                 return 'text-gray-600 bg-gray-50 border-gray-300';
//         }
//     };

//     const handleDelete = () => {
//         if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
//             router.delete(`/events/${event.id}`);
//         }
//     };

//     const handleCopyUrl = () => {
//         navigator.clipboard.writeText(event.conference_url || '');
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//     };

//     return (
//         <TeacherLayouts title={event.title}>
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
//                 <div className="mx-auto max-w-5xl px-4">
//                     {/* Back Button */}
//                     <button
//                         onClick={() => history.back()}
//                         className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
//                     >
//                         <ArrowLeft className="h-4 w-4" />
//                         Retour aux activités
//                     </button>

//                     {/* Header */}
//                     <div className="mb-8 rounded-xl bg-white p-8 shadow-md">
//                         {/* Color Bar */}
//                         <div
//                             className="absolute top-0 left-0 h-1 rounded-t-xl"
//                             style={{
//                                 width: '100%',
//                                 backgroundColor: event.color || '#3B82F6',
//                             }}
//                         />

//                         <div className="flex items-start justify-between gap-6">
//                             <div className="flex-1">
//                                 {/* Title */}
//                                 <h1 className="mb-4 text-4xl font-bold text-gray-900">
//                                     {event.title}
//                                 </h1>

//                                 {/* Badges */}
//                                 <div className="mb-4 flex flex-wrap gap-3">
//                                     <span
//                                         className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${getEventTypeColor(event.event_type)}`}
//                                     >
//                                         {getEventTypeLabel(event.event_type)}
//                                     </span>
//                                     <span
//                                         className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${getStatusBadgeColor(event.status)}`}
//                                     >
//                                         {getEventStatusTypeLabel(event.status)}
//                                     </span>
//                                     <span className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
//                                         <Eye className="h-4 w-4" />
//                                         {getEventVisibilityLabel(
//                                             event.visibility,
//                                         )}
//                                     </span>
//                                 </div>

//                                 {/* Quick Info */}
//                                 <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//                                     {event.is_synchronous && (
//                                         <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
//                                             <Clock className="h-4 w-4" />
//                                             Synchrone
//                                         </span>
//                                     )}
//                                     {!event.is_synchronous && (
//                                         <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
//                                             <Clock className="h-4 w-4" />
//                                             Asynchrone
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Action Buttons */}
//                             {/* <div className="flex flex-col gap-3">
//                             <Link
//                                 href={`/events/${event.id}/edit`}
//                                 className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium transition-colors hover:bg-blue-700"
//                             >
//                                 <Edit className="h-4 w-4" />
//                                 Modifier
//                             </Link>
//                             <button
//                                 onClick={handleDelete}
//                                 className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-red-600 font-medium transition-colors hover:bg-red-100"
//                             >
//                                 <Trash2 className="h-4 w-4" />
//                                 Supprimer
//                             </button>
//                         </div> */}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//                         {/* Main Content */}
//                         <div className="space-y-8 lg:col-span-2">
//                             {/* Description */}
//                             {event.description && (
//                                 <div className="rounded-xl bg-white p-8 shadow-md">
//                                     <div className="mb-4 flex items-center gap-3">
//                                         <FileText className="h-6 w-6 text-blue-600" />
//                                         <h2 className="text-xl font-semibold text-gray-900">
//                                             Description
//                                         </h2>
//                                     </div>
//                                     <p className="leading-relaxed text-gray-700">
//                                         {event.description}
//                                     </p>
//                                 </div>
//                             )}

//                             {/* Date & Time Information */}
//                             <div className="rounded-xl bg-white p-8 shadow-md">
//                                 <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
//                                     <Calendar className="h-6 w-6 text-green-600" />
//                                     <h2 className="text-xl font-semibold text-gray-900">
//                                         Calendrier et horaires
//                                     </h2>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
//                                         <p className="mb-1 text-sm font-medium text-blue-900">
//                                             Date de début
//                                         </p>
//                                         <p className="text-lg font-semibold text-blue-600">
//                                             {formatCompleteDate(event.start_at)}
//                                         </p>
//                                     </div>

//                                     {event.end_at && (
//                                         <div className="rounded-lg border border-green-200 bg-green-50 p-4">
//                                             <p className="mb-1 text-sm font-medium text-green-900">
//                                                 Date de fin
//                                             </p>
//                                             <p className="text-lg font-semibold text-green-600">
//                                                 {formatCompleteDate(
//                                                     event.end_at,
//                                                 )}
//                                             </p>
//                                         </div>
//                                     )}

//                                     {event.duration_minutes && (
//                                         <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
//                                             <p className="mb-1 text-sm font-medium text-purple-900">
//                                                 Durée
//                                             </p>
//                                             <p className="text-lg font-semibold text-purple-600">
//                                                 {formatMinutes(
//                                                     event.duration_minutes,
//                                                 )}
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Location Information */}
//                             <div className="rounded-xl bg-white p-8 shadow-md">
//                                 <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
//                                     <MapPin className="h-6 w-6 text-orange-600" />
//                                     <h2 className="text-xl font-semibold text-gray-900">
//                                         Lieu et mode
//                                     </h2>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
//                                         <p className="mb-1 text-sm font-medium text-gray-900">
//                                             Type de lieu
//                                         </p>
//                                         <p className="text-lg font-semibold text-gray-700">
//                                             {getModalityTypeLabel(
//                                                 event.modality,
//                                             )}
//                                         </p>
//                                     </div>

//                                     {(event.modality === 'onsite' ||
//                                         event.modality === 'hybrid') &&
//                                         event.location && (
//                                             <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
//                                                 <p className="mb-1 text-sm font-medium text-amber-900">
//                                                     Adresse
//                                                 </p>
//                                                 <p className="text-lg font-semibold text-amber-700">
//                                                     {event.location}
//                                                 </p>
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>

//                             {/* Conference Information */}
//                             {event.is_synchronous &&
//                                 event.modality !== 'onsite' &&
//                                 event.conference_platform && (
//                                     <div className="rounded-xl bg-white p-8 shadow-md">
//                                         <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
//                                             <Video className="h-6 w-6 text-blue-600" />
//                                             <h2 className="text-xl font-semibold text-gray-900">
//                                                 Informations de visioconférence
//                                             </h2>
//                                         </div>

//                                         <div className="space-y-4">
//                                             <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
//                                                 <p className="mb-1 text-sm font-medium text-blue-900">
//                                                     Plateforme
//                                                 </p>
//                                                 <p className="text-lg font-semibold text-blue-600 capitalize">
//                                                     {getPlateformeConferenceLabel(
//                                                         event.conference_platform ??
//                                                             '',
//                                                     )}
//                                                 </p>
//                                             </div>

//                                             {event.conference_url && (
//                                                 <div className="rounded-lg border border-green-200 bg-green-50 p-4">
//                                                     <p className="mb-2 text-sm font-medium text-green-900">
//                                                         URL de la conférence
//                                                     </p>
//                                                     <div className="flex items-center gap-2">
//                                                         <a
//                                                             href={
//                                                                 event.conference_url
//                                                             }
//                                                             target="_blank"
//                                                             rel="noopener noreferrer"
//                                                             className="flex-1 font-mono text-sm break-all text-blue-600 hover:underline"
//                                                         >
//                                                             {
//                                                                 event.conference_url
//                                                             }
//                                                         </a>
//                                                         <button
//                                                             onClick={
//                                                                 handleCopyUrl
//                                                             }
//                                                             className="flex-shrink-0 rounded-lg bg-green-200 p-2 text-green-700 transition-colors hover:bg-green-300"
//                                                             title="Copier l'URL"
//                                                         >
//                                                             <Copy className="h-4 w-4" />
//                                                         </button>
//                                                     </div>
//                                                     {copied && (
//                                                         <p className="mt-2 text-sm font-medium text-green-600">
//                                                             ✓ Copié !
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                             )}

//                                             {event.conference_meeting_id && (
//                                                 <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
//                                                     <p className="mb-1 text-sm font-medium text-purple-900">
//                                                         ID de réunion
//                                                     </p>
//                                                     <p className="font-mono text-lg font-semibold text-purple-600">
//                                                         {
//                                                             event.conference_meeting_id
//                                                         }
//                                                     </p>
//                                                 </div>
//                                             )}

//                                             {event.conference_passcode && (
//                                                 <div className="rounded-lg border border-red-200 bg-red-50 p-4">
//                                                     <p className="mb-1 text-sm font-medium text-red-900">
//                                                         Mot de passe
//                                                     </p>
//                                                     <p className="font-mono text-lg font-semibold text-red-600">
//                                                         {
//                                                             event.conference_passcode
//                                                         }
//                                                     </p>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}
//                         </div>

//                         {/* Sidebar */}
//                         <div className="space-y-6">
//                             {/* Summary Card */}
//                             <div className="rounded-xl bg-white p-6 shadow-md">
//                                 <h3 className="mb-6 text-lg font-semibold text-gray-900">
//                                     Résumé
//                                 </h3>

//                                 <div className="space-y-4">
//                                     {/* Type */}
//                                     <div>
//                                         <p className="mb-1 text-sm font-medium text-gray-600">
//                                             Type d'événement
//                                         </p>
//                                         <p className="text-sm font-semibold text-gray-900">
//                                             {getEventTypeLabel(
//                                                 event.event_type,
//                                             )}
//                                         </p>
//                                     </div>

//                                     <div className="border-t border-gray-200" />

//                                     {/* Status */}
//                                     <div>
//                                         <p className="mb-1 text-sm font-medium text-gray-600">
//                                             Statut
//                                         </p>
//                                         <span
//                                             className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(event.status)}`}
//                                         >
//                                             {getEventStatusTypeLabel(
//                                                 event.status,
//                                             )}
//                                         </span>
//                                     </div>

//                                     <div className="border-t border-gray-200" />

//                                     {/* Visibility */}
//                                     <div>
//                                         <p className="mb-1 text-sm font-medium text-gray-600">
//                                             Visibilité
//                                         </p>
//                                         <p className="text-sm font-semibold text-gray-900">
//                                             {eventVisibilityTypeLabels.find(
//                                                 (v) =>
//                                                     v.key === event.visibility,
//                                             )?.value || event.visibility}
//                                         </p>
//                                     </div>

//                                     <div className="border-t border-gray-200" />

//                                     {/* Synchronous */}
//                                     <div>
//                                         <p className="mb-2 text-sm font-medium text-gray-600">
//                                             Mode
//                                         </p>
//                                         <span
//                                             className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
//                                                 event.is_synchronous
//                                                     ? 'bg-green-100 text-green-700'
//                                                     : 'bg-amber-100 text-amber-700'
//                                             }`}
//                                         >
//                                             <Clock className="h-3 w-3" />
//                                             {event.is_synchronous
//                                                 ? 'Synchrone'
//                                                 : 'Asynchrone'}
//                                         </span>
//                                     </div>

//                                     {event.color && (
//                                         <>
//                                             <div className="border-t border-gray-200" />

//                                             <div>
//                                                 <p className="mb-2 text-sm font-medium text-gray-600">
//                                                     Couleur
//                                                 </p>
//                                                 <div className="flex items-center gap-2">
//                                                     <div
//                                                         className="h-6 w-6 rounded-lg border-2 border-gray-200"
//                                                         style={{
//                                                             backgroundColor:
//                                                                 event.color,
//                                                         }}
//                                                     />
//                                                     <p className="font-mono text-sm text-gray-600">
//                                                         {event.color}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                             {/* Timestamps */}
//                             <div className="rounded-xl bg-white p-6 shadow-md">
//                                 <h3 className="mb-4 text-sm font-medium text-gray-600">
//                                     Informations système
//                                 </h3>

//                                 <div className="space-y-3 font-mono text-xs text-gray-600">
//                                     {event.created_at && (
//                                         <div>
//                                             <p className="font-medium text-gray-900">
//                                                 Créé le
//                                             </p>
//                                             <p>
//                                                 {formatDate(event.created_at)}
//                                             </p>
//                                         </div>
//                                     )}
//                                     {event.updated_at && (
//                                         <div>
//                                             <p className="font-medium text-gray-900">
//                                                 Modifié le
//                                             </p>
//                                             <p>
//                                                 {formatDate(event.updated_at)}
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </TeacherLayouts>
//     );
// }
