import { Button } from '@/components/ui/button';
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
import { destroy } from '@/routes/teachers/quizzes/responses';
import { QuizAnswer, QuizQuestion } from '@/types/models/others';
import { router } from '@inertiajs/react';
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
import React from 'react';
import { MdDelete } from 'react-icons/md';
import QuestionAnswerFormDialog from './add-answers-dialog';

export const columns: ColumnDef<QuizAnswer>[] = [
    {
        accessorKey: 'order',
        header: 'Ordre',
        cell: ({ row }) => (
            <div className="capitalize">
                {row.getValue('order') ?? 'Non ordonner'}
            </div>
        ),
    },
    {
        accessorKey: 'answer_text',
        header: 'Réponse',
        cell: ({ row }) => (
            <div className="capitalize">
                {subStrText(row.getValue('answer_text'), 0, 30)}
            </div>
        ),
    },
    {
        accessorKey: 'is_correct',
        header: 'Bonne réponse',
        cell: ({ row }) => (
            <div className="capitalize">
                {row.getValue('is_correct') == 1 ? 'Oui' : 'Non'}
            </div>
        ),
    },

    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const questAnswer = row.original;
            const quizSlug = questAnswer.question?.quize?.slug ?? '';
            function handleDelete(e: React.MouseEvent) {
                e.preventDefault();
                if (
                    confirm(
                        'Êtes-vous sûr de vouloir supprimer cette question ?',
                    )
                ) {
                    router.delete(
                        destroy([
                            quizSlug,
                            questAnswer.question?.id ?? 0,
                            questAnswer.id,
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
                                navigator.clipboard.writeText(
                                    questAnswer.answer_text ?? '',
                                )
                            }
                        >
                            Copier le texte de la réponse
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <div className="flex items-center justify-between gap-2 px-2">
                            <h3>Détails</h3>
                            <QuestionAnswerFormDialog
                                quizId={questAnswer.question?.quize?.id ?? 0}
                                title={questAnswer.question?.quize?.title ?? ''}
                                response={questAnswer}
                                question={questAnswer.question ?? null}
                                triggerTexte={false}
                                iconSize={20}
                                className="flex items-center justify-between !py-2 text-center text-app-blue"
                            />
                        </div>

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
    questAnswers: QuizAnswer[];
    question: QuizQuestion;
};
export default function QuestResponsesDataTable({
    questAnswers,
    question,
}: Props) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: questAnswers,
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
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <Input
                        placeholder="Filtrer par réponse..."
                        value={
                            (table
                                .getColumn('answer_text')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('answer_text')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
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
                <QuestionAnswerFormDialog
                    quizId={question.quize?.id ?? 0}
                    title={question.quize?.title ?? ''}
                    question={question ?? null}
                    className="btn-primary flex items-center bg-app-blue !py-2 text-center text-white"
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
