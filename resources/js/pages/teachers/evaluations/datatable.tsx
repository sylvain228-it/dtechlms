import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { subStrText } from '@/lib/tasks';
import { getEvaluateTypeLabel } from '@/lib/type';
import { destroy, edit, show } from '@/routes/teachers/evaluations';
import { Evaluation } from '@/types/models/others';
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
import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { FcViewDetails } from 'react-icons/fc';
import { MdDelete } from 'react-icons/md';

export const columns: ColumnDef<Evaluation>[] = [
    {
        accessorKey: 'title',
        header: 'Titre',
        cell: ({ row }) => (
            <div className="capitalize">
                {subStrText(row.getValue('title'), 0, 30)}
            </div>
        ),
    },

    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
            <div className="capitalize">
                {subStrText(row.getValue('description'), 0, 50)}
            </div>
        ),
    },
    {
        accessorKey: 'evaluation_type',
        header: 'Type',
        cell: ({ row }) => (
            <div className="capitalize">
                {subStrText(
                    getEvaluateTypeLabel(row.getValue('evaluation_type')),
                    0,
                    20,
                )}
            </div>
        ),
    },

    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const evaluation = row.original;
            function handleDelete(e: React.MouseEvent) {
                e.preventDefault();
                if (confirm('Êtes-vous sûr de vouloir supprimer ce quize ?')) {
                    router.delete(
                        destroy([
                            evaluation?.activity?.id ?? '',
                            evaluation.id,
                        ]),
                    );
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
                                navigator.clipboard.writeText(evaluation.title)
                            }
                        >
                            Copier le titre
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link
                            href={show([
                                evaluation?.activity?.slug ?? '',
                                evaluation.slug,
                            ])}
                        >
                            <DropdownMenuItem>
                                Détails
                                <DropdownMenuShortcut>
                                    <FcViewDetails className="text-blue-500" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>
                        <Link
                            href={edit([
                                evaluation?.activity?.slug ?? '',
                                evaluation.slug,
                            ])}
                        >
                            <DropdownMenuItem>
                                Modifier
                                <DropdownMenuShortcut>
                                    <FaEdit className="text-blue-500" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>
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

type Props = {
    evaluations: Evaluation[];
};
export default function EvaluationsDataTable({ evaluations }: Props) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: evaluations,
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
            <div className="mb-3 flex w-full flex-col justify-between gap-2 lg:flex-row lg:gap-4">
                <Input
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
                    className="w-full"
                />
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
