import { SelectField } from '@/components/shared/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { handleEditClicked, subStrText } from '@/lib/tasks';
import {
    ActivityScope,
    activityScopeLabels,
    getActivityScopeLabel,
    getActivityTypeLabel,
} from '@/lib/type';
import { create, destroy, edit, show } from '@/routes/teachers/activities';
import { Course, CourseActivity } from '@/types/models/course';
import { Link, router } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import React, { useMemo } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FcViewDetails } from 'react-icons/fc';
import { IoAdd, IoRemoveCircle } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';

export const columns: ColumnDef<CourseActivity>[] = [
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const activity = row.original;
            const editUrl = activity.parent_course
                ? edit([activity.parent_course?.slug ?? '', activity.slug]).url
                : '#';
            function handleDelete(e: React.MouseEvent) {
                e.preventDefault();
                if (
                    confirm('Êtes-vous sûr de vouloir supprimer cette lesson ?')
                ) {
                    if (activity.parent_course) {
                        router.delete(
                            destroy([
                                activity.parent_course?.id ?? '',
                                activity.id,
                            ]),
                        );
                    }
                }
            }
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(activity.title)
                            }
                        >
                            Copier le titre
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <Link
                            href={
                                activity.parent_course
                                    ? show([
                                          activity.parent_course?.slug ?? '',
                                          activity.slug,
                                      ])
                                    : '#'
                            }
                        >
                            <DropdownMenuItem>
                                Détails
                                <DropdownMenuShortcut>
                                    <FcViewDetails className="text-blue-500" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            onClick={(e) =>
                                handleEditClicked(
                                    e,
                                    activity.resources_summary ?? '',
                                    editUrl,
                                )
                            }
                        >
                            Modifier
                            <DropdownMenuShortcut>
                                <FaEdit className="text-blue-500" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleDelete}>
                            Supprimer
                            <DropdownMenuShortcut>
                                <MdDelete className="text-red-500" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Sélectionner tout"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Sélectionner la ligne"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: 'title',
        header: 'Titre',
        cell: ({ row }) => (
            <div className="capitalize">
                {subStrText(row.getValue('title'), 0, 40)}
            </div>
        ),
    },

    {
        accessorKey: 'scope',
        header: 'Portée',
        cell: ({ row }) => (
            <div className="capitalize">
                {subStrText(
                    getActivityScopeLabel(row.getValue('scope')),
                    0,
                    20,
                )}
            </div>
        ),
    },
    {
        accessorKey: 'is_visible',
        header: 'Visibilité',
        cell: ({ row }) => (
            <div
                className={`capitalize ${row.getValue('is_visible') == 1 ? 'text-green-600' : 'text-red-600'}`}
            >
                {row.getValue('is_visible') == 1 ? 'Visible' : 'Invisible'}
            </div>
        ),
    },

    {
        accessorKey: 'activity_type',
        header: 'Type',
        cell: ({ row }) => (
            <div className="capitalize">
                {subStrText(
                    getActivityTypeLabel(row.getValue('activity_type')),
                    0,
                    20,
                )}
            </div>
        ),
    },
];

export default function CourseActivitiesDataTable({
    activities,
    course,
}: {
    activities: CourseActivity[];
    course: Course;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [scope, setScope] = React.useState<ActivityScope | undefined>(
        undefined,
    );
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const filtered = useMemo(() => {
        if (!scope) return activities;
        return (activities || []).filter(
            (item) => item.scope == scope,
        ) as CourseActivity[];
    }, [activities, scope]);
    const table = useReactTable({
        data: filtered,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="mb-3 flex flex-col justify-between gap-2 lg:flex-row lg:gap-4">
                <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
                    <input
                        placeholder="Filtrer par titre..."
                        value={
                            (table
                                .getColumn('title')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('title')
                                ?.setFilterValue(event.target.value)
                        }
                        className="form-input w-full"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Colonne <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={create(course.slug)}
                        className="btn-primary flex w-full items-center justify-center bg-cblue !py-1 text-center text-white"
                    >
                        Ajouter <IoAdd size={30} />
                    </Link>
                </div>
            </div>
            <div className="my-4 flex items-center gap-6">
                <div className="w-full">
                    <SelectField
                        options={activityScopeLabels}
                        label=""
                        emptyOption="Filtrer par portée"
                        value={scope ?? ''}
                        onChange={(val) => {
                            if (val != scope) {
                                setScope(val as ActivityScope);
                            }
                        }}
                    />
                </div>
                {scope && (
                    <Button
                        onClick={() => {
                            setScope(undefined);
                        }}
                        className="mt-2 bg-red-100 p-2"
                    >
                        <IoRemoveCircle size={25} className="text-red-500" />
                    </Button>
                )}
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Pas de résultats.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} sur{' '}
                    {table.getFilteredRowModel().rows.length} ligne(s)
                    sélectionné(s).
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Précédent
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    );
}
