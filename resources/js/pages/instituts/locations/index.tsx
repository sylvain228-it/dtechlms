import InstitutLayouts from '@/layouts/instituts/institut-layouts';
import { Location } from '@/types/models/institut';
import { usePage } from '@inertiajs/react';
import LocationsDataTable from './datatable';

export default function LocationsIndex() {
    const { locations } = usePage().props as unknown as {
        locations: Location[];
    };

    return (
        <InstitutLayouts title="Liste des établissements">
            <LocationsDataTable locations={locations} />
        </InstitutLayouts>
    );
}
