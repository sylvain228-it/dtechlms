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
import { handleEditClicked } from '@/lib/tasks';
import { getSequenceTypeLabel } from '@/lib/type';
import { index as listActivities } from '@/routes/teachers/activities';
import { create, destroy, edit, show } from '@/routes/teachers/sequences';
import { CourseActivity, Module, Sequence } from '@/types/models/course';
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
import { ArrowRight, ChevronDown, MoreHorizontal } from 'lucide-react';
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { FcViewDetails } from 'react-icons/fc';
import { IoAdd } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';

export const columns: ColumnDef<Sequence>[] = [
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
        accessorKey: 'order',
        header: 'Numéro',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('order')}</div>
        ),
    },

    {
        accessorKey: 'title',
        header: 'Titre',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('title')}</div>
        ),
    },

    {
        accessorKey: 'sequence_type',
        header: 'Type',
        cell: ({ row }) => (
            <div className="capitalize">
                {getSequenceTypeLabel(row.getValue('sequence_type'))}
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
        accessorKey: 'activities',
        header: 'Total Activités',
        cell: ({ row }) => (
            <div className={`capitalize`}>
                {(row.getValue('activities') as CourseActivity[])?.length ?? 0}{' '}
                Activité(s)
            </div>
        ),
    },

    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const sequence = row.original;
            const editUrl =
                sequence.module && sequence.module.course
                    ? edit([
                          sequence.module.course.slug,
                          sequence.module?.id ?? '',
                          sequence.id,
                      ]).url
                    : '#';
            function handleDelete(e: React.MouseEvent) {
                e.preventDefault();
                if (
                    confirm('Êtes-vous sûr de vouloir supprimer cette lesson ?')
                ) {
                    if (sequence.module && sequence.module?.course) {
                        router.delete(
                            destroy([
                                sequence.module.course.slug!,
                                sequence.module?.id ?? '',
                                sequence.id,
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
                                navigator.clipboard.writeText(sequence.title)
                            }
                        >
                            Copier le titre
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <Link
                            href={
                                sequence.module && sequence.module.course
                                    ? show([
                                          sequence.module.course.slug,
                                          sequence.module?.id ?? '',
                                          sequence.id,
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

                        <Link
                            href={
                                sequence.module && sequence.module.course
                                    ? listActivities(sequence.slug)
                                    : '#'
                            }
                        >
                            <DropdownMenuItem>
                                Voir les activités
                                <DropdownMenuShortcut>
                                    <ArrowRight className="text-blue-500" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem
                            onClick={(e) =>
                                handleEditClicked(
                                    e,
                                    sequence.syllabus ?? '',
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
];

export default function ModuleSequenceDataTable({
    sequences,
    module,
}: {
    sequences: Sequence[];
    module: Module;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: sequences,
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
                        href={
                            module.course
                                ? create([module.course?.slug, module.id])
                                : '#'
                        }
                        className="btn-primary inline-block bg-app-blue !py-2 text-center text-white"
                    >
                        Ajouter <IoAdd className="inline-block h-7 w-7" />
                    </Link>
                    <button
                        onClick={() => history.back()}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium hover:bg-gray-50"
                    >
                        <ArrowRight />
                    </button>
                </div>
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
