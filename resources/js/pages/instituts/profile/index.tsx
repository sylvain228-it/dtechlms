import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { edit } from '@/routes/institut/profile';
import { InstitutSharedData } from '@/types/models/institut';
import { Link, usePage } from '@inertiajs/react';
import { Edit3Icon, Settings } from 'lucide-react';
import UploadFileDialog from './upload-file-dialog';

export default function ProfileInstitut() {
    const page = usePage<InstitutSharedData>();
    const { auth } = page.props;
    const institut = auth.institut;

    const getBillingPlanColor = (plan: string) => {
        const colors: Record<string, string> = {
            free: 'bg-gray-100 text-gray-800',
            standard: 'bg-blue-100 text-blue-800',
            premium: 'bg-purple-100 text-purple-800',
        };
        return colors[plan] || 'bg-gray-100 text-gray-800';
    };

    const getTypeLabel = (type: string) => {
        return type === 'university' ? 'Université' : 'Centre de Formation';
    };

    return (
        <InstitutLayouts title="Profile">
            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Cover Image */}
                    <div className="relative mb-6 h-48 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                        {institut.cover_url && (
                            <img
                                src={institut.cover_url}
                                alt="Cover"
                                className="h-full w-full object-cover"
                            />
                        )}
                        <UploadFileDialog inputName="cover" />
                    </div>

                    {/* Profile Header */}
                    <div className="relative z-10 -mt-16 mb-6 rounded-lg bg-white p-6 shadow-md">
                        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
                            {/* Logo */}
                            <div className="relative flex h-[80px] w-[80px] rounded-lg bg-amber-500">
                                {institut.logo_url && (
                                    <img
                                        src={institut.logo_url}
                                        alt={institut.name}
                                        className="h-[80px] w-[80px] rounded-lg border-4 border-white object-cover shadow-md"
                                    />
                                )}
                                <UploadFileDialog
                                    inputName="logo"
                                    className="-right-2 -bottom-2"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-grow">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {institut.name}
                                        </h1>
                                        <p className="mt-1 text-gray-600">
                                            @{institut.slug}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span
                                            className={`rounded-full px-4 py-2 text-sm font-semibold ${getBillingPlanColor(institut.billing_plan)}`}
                                        >
                                            {institut.billing_plan
                                                .charAt(0)
                                                .toUpperCase() +
                                                institut.billing_plan.slice(1)}
                                        </span>
                                        <span
                                            className={`rounded-full px-4 py-2 text-sm font-semibold ${institut.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                        >
                                            {institut.is_active
                                                ? '✓ Actif'
                                                : 'Inactif'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column - Main Info */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Organization Info */}
                            <div className="rounded-lg bg-white p-6 shadow-md">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">
                                    Informations de l'organisation
                                </h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Type
                                        </label>
                                        <p className="mt-1 text-gray-900">
                                            {getTypeLabel(institut.type)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Site Web
                                        </label>
                                        <p className="mt-1 text-blue-600">
                                            <a
                                                href={
                                                    institut.website_url ?? ''
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {institut.website_url}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="rounded-lg bg-white p-6 shadow-md">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">
                                    Coordonnées
                                </h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Email
                                        </label>
                                        <p className="mt-1 text-gray-900">
                                            {institut.email || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Email de Contact
                                        </label>
                                        <p className="mt-1 text-gray-900">
                                            {institut.contact_email || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Téléphone
                                        </label>
                                        <p className="mt-1 text-gray-900">
                                            {institut.tel || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Mobile
                                        </label>
                                        <p className="mt-1 text-gray-900">
                                            {institut.phone_number || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="rounded-lg bg-white p-6 shadow-md">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">
                                    Localisation
                                </h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Adresse
                                        </label>
                                        <p className="mt-1 text-gray-900">
                                            {institut.address || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Complément d'adresse
                                        </label>
                                        <p className="mt-1 text-gray-900">
                                            {institut.s_address || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Pays
                                        </label>
                                        <p className="mt-1 text-gray-900">
                                            {institut.country || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">
                                            Ville
                                        </label>
                                        <p className="mt-1 text-gray-900">
                                            {institut.city || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="space-y-6">
                            {/* Stats Card */}
                            <div className="rounded-lg bg-white p-6 shadow-md">
                                <h2 className="mb-4 text-lg font-bold text-gray-900">
                                    Statut
                                </h2>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <p className="text-sm text-gray-600">
                                            Plan de facturation
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 capitalize">
                                            {institut.billing_plan}
                                        </p>
                                    </div>
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <p className="text-sm text-gray-600">
                                            Dernière connexion
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {institut.last_login_date
                                                ? new Date(
                                                      institut.last_login_date,
                                                  ).toLocaleDateString('fr-FR')
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid gap-3 rounded-lg bg-white p-6 shadow-md">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Actions
                                </h2>
                                <Link
                                    href={edit()}
                                    className="btn-primary flex items-center justify-center gap-2 !rounded-lg"
                                >
                                    <Edit3Icon className="inline-block" />
                                    Modifier le profil
                                </Link>
                                <Link
                                    href={edit()}
                                    className="btn-primary !hover:bg-gray-300 flex items-center justify-center gap-2 !rounded-lg !bg-gray-200 !text-gray-800 transition"
                                >
                                    <Settings className="inline-block" />
                                    Paramètres de sécurité
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </InstitutLayouts>
    );
}
