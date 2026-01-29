import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { update } from '@/routes/institut/profile';
import { InstitutSharedData } from '@/types/models/institut';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function InstitutEditProfile() {
    const page = usePage<InstitutSharedData>();
    const { errors } = usePage().props;
    const { auth } = page.props;
    const [form, setForm] = useState(auth.institut);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const data = {
            ...form,
        };
        router.post(update(), data, { onFinish: onFinish });
    };
    const [processing, setProcessing] = useState(false);
    function onFinish() {
        setProcessing(false);
    }
    return (
        <InstitutLayouts title="Mise à jour du profil">
            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                        method="POST"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Nom de l'organisation
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-input !w-full"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Type
                            </label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="form-input !w-full"
                            >
                                <option value="university">Université</option>
                                <option value="training_center">
                                    Centre de Formation
                                </option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.type}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Site Web
                                </label>
                                <input
                                    type="url"
                                    name="website_url"
                                    value={form.website_url ?? ''}
                                    onChange={handleChange}
                                    className="form-input !w-full"
                                />
                                {errors.website_url && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.website_url}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Email de contact
                                </label>
                                <input
                                    type="email"
                                    name="contact_email"
                                    value={form.contact_email ?? ''}
                                    onChange={handleChange}
                                    className="form-input !w-full"
                                />
                                {errors.contact_email && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.contact_email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Téléphone
                                </label>
                                <input
                                    type="text"
                                    name="tel"
                                    value={form.tel ?? ''}
                                    onChange={handleChange}
                                    className="form-input !w-full"
                                />
                                {errors.tel && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.tel}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Mobile
                                </label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={form.phone_number ?? ''}
                                    onChange={handleChange}
                                    className="form-input !w-full"
                                />
                                {errors.phone_number && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.phone_number}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Adresse
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={form.address ?? ''}
                                onChange={handleChange}
                                className="form-input !w-full"
                            />
                            {errors.address && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Complément d'adresse
                            </label>
                            <input
                                type="text"
                                name="s_address"
                                value={form.s_address ?? ''}
                                onChange={handleChange}
                                className="form-input !w-full"
                            />
                            {errors.s_address && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.s_address}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Pays
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={form.country ?? ''}
                                    onChange={handleChange}
                                    className="form-input !w-full"
                                />
                                {errors.country && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.country}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Ville
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={form.city ?? ''}
                                    onChange={handleChange}
                                    className="form-input !w-full"
                                />
                                {errors.city && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.city}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Date de création
                            </label>
                            <input
                                type="date"
                                name="born_date"
                                value={form.born_date ?? ''}
                                onChange={handleChange}
                                className="form-input !w-full"
                            />
                            {errors.born_date && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.born_date}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                className="btn-primary mt-4 w-full !py-6"
                                tabIndex={4}
                                disabled={processing}
                                data-test="create-category-button"
                            >
                                {processing && <Spinner />}
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </InstitutLayouts>
    );
}
