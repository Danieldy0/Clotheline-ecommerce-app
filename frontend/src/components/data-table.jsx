"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconGripVertical,
    IconLayoutColumns,
    IconLoader,
    IconPlus,
    IconTrendingUp,
    IconAlertCircle,
} from "@tabler/icons-react"
import { SonnerTypes } from "./SonnerTypes"
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"
import { cn } from "@/lib/utils"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import InventoryDialog from "./inventory-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog"
import { IconTrash } from "@tabler/icons-react"
import { DialogClose } from "@radix-ui/react-dialog"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"


export const schema = z.object({
    id: z.number(),
    name: z.string(),
    category_name: z.string(),
    global_stock: z.string(),
    created_at: z.string(),
    variant: z.string(),
    base_price: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }) {
    const { attributes, listeners } = useSortable({
        id,
    })

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-transparent"
        >
            <IconGripVertical className="size-3 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

const columns = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Product Detail",
        cell: ({ row }) => {
            return <TableCellViewer item={row.original} />
        },
        enableHiding: false,
    },
    {
        accessorKey: "category_name",
        header: "Category",
        cell: ({ row }) => (
            <div className="w-32">
                <Badge variant="outline" className="px-1.5 text-muted-foreground">
                    {row.original.category_name}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "global_stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = parseInt(row.original.global_stock) || 0
            const isOut = stock === 0
            const isLow = stock < 10 && !isOut

            return (
                <Badge
                    variant="outline"
                    className={cn(
                        "px-1.5 gap-1.5",
                        isOut ? "text-rose-600 border-rose-200 bg-rose-50" :
                            isLow ? "text-amber-600 border-amber-200 bg-amber-50" :
                                "text-emerald-600 border-emerald-200 bg-emerald-50"
                    )}
                >
                    {isOut ? (
                        <IconAlertCircle className="size-3" />
                    ) : isLow ? (
                        <IconLoader className="size-3" />
                    ) : (
                        <IconCircleCheckFilled className="size-3 fill-emerald-500" />
                    )}
                    {isOut ? "Out of Stock" : isLow ? `${stock} Low Stock` : `${stock} in stock`}
                </Badge>
            )
        },
    },
    {
        accessorKey: "base_price",
        header: () => <div className="w-full text-right">Price</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium">
                ${parseFloat(row.original.base_price).toLocaleString()}
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Listed Date",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at)
            return (
                <div className="text-muted-foreground text-xs">
                    {date.toLocaleDateString()}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const item = row.original
            const onRefresh = table.options.meta?.onRefresh

            const handleDelete = async () => {
                const lookupValue = item.slug || item.id
                const response = await fetch(`http://localhost:8000/api/products/products/${lookupValue}/`, {
                    method: "DELETE",
                })
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.detail || "Failed to delete product")
                }
                if (onRefresh) onRefresh()
                return item
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                            size="icon"
                        >
                            <IconDotsVertical />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <Drawer direction="right">
                            <DrawerTrigger className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground outline-none transition-colors">Edit</DrawerTrigger>
                            <DrawerContent className="ml-auto h-full w-full sm:max-w-md rounded-none">
                                <DrawerHeader>
                                    <DrawerTitle className="text-xl font-bold">Edit Product</DrawerTitle>
                                    <DrawerDescription>Update your product details and inventory levels here.</DrawerDescription>
                                </DrawerHeader>
                                <div className="flex-1 overflow-y-auto p-6">
                                    <FieldSet>
                                        <FieldLegend>Profile</FieldLegend>
                                        <FieldDescription>This appears on invoices and emails.</FieldDescription>
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="name">Full name</FieldLabel>
                                                <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
                                                <FieldDescription>This appears on invoices and emails.</FieldDescription>
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                                <Input id="username" autoComplete="off" aria-invalid />
                                                <FieldError>Choose another username.</FieldError>
                                            </Field>
                                            <Field orientation="horizontal">
                                                <Switch id="newsletter" />
                                                <FieldLabel htmlFor="newsletter">Subscribe to the newsletter</FieldLabel>
                                            </Field>
                                        </FieldGroup>
                                    </FieldSet>
                                </div>
                                <DrawerFooter className="border-t flex-col gap-2">
                                    <Button className="w-full">Save Changes</Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline" className="w-full">Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Dialog>
                            <DialogTrigger className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground outline-none transition-colors">
                                <IconTrash className="size-4" />
                                Delete
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete <strong>{item.name}</strong> and remove all related variants from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            toast.promise(handleDelete(), {
                                                loading: "Deleting product...",
                                                success: (data) => `${data.name} has been deleted`,
                                                error: (err) => `Error: ${err.message}`,
                                            })
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

function DraggableRow({ row }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function DataTable({ data: initialData, onRefresh }) {
    const [data, setData] = React.useState(() => initialData)

    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState([])
    const [sorting, setSorting] = React.useState([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    const dataIds = React.useMemo(
        () => data?.map(({ id }) => id) || [],
        [data]
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        meta: {
            onRefresh,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    return (
        <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <Select defaultValue="outline">
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="view-selector"
                    >
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="past-performance">Past Performance</SelectItem>
                        <SelectItem value="key-personnel">Key Personnel</SelectItem>
                        <SelectItem value="focus-documents">Focus Documents</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="outline">Outline</TabsTrigger>
                    <TabsTrigger value="past-performance">
                        Past Performance <Badge variant="secondary">3</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="key-personnel">
                        Key Personnel <Badge variant="secondary">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
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
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <InventoryDialog onRefresh={onRefresh} />
                </div>
            </div>
            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-muted">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent
                value="past-performance"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent
                value="focus-documents"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    )
}

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--primary)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--primary)",
    },
}

function TableCellViewer({ item }) {
    const isMobile = useIsMobile()

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground font-bold hover:text-primary">
                    {item.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="uppercase text-[10px]">{item.category_name}</Badge>
                        <Badge variant="outline" className="uppercase text-[10px] text-emerald-600 bg-emerald-50 border-emerald-100">Live Inventory</Badge>
                    </div>
                    <DrawerTitle className="text-2xl font-black tracking-tight">{item.name}</DrawerTitle>
                    <DrawerDescription>
                        SKU ID: {item.id} | Listed on {new Date(item.created_at).toLocaleDateString()}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-6 text-sm">
                    {!isMobile && (
                        <>
                            <div className="grid grid-cols-2 gap-8 py-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Base Price</Label>
                                    <p className="text-3xl font-black">${parseFloat(item.base_price).toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Inventory Level</Label>
                                    <p className={cn("text-3xl font-black", parseInt(item.global_stock) < 10 ? "text-amber-500" : "text-emerald-500")}>
                                        {item.global_stock} Units
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <ChartContainer config={chartConfig} className="h-48">
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{ left: 0, right: 10 }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" hide />
                                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                                    <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" />
                                </AreaChart>
                            </ChartContainer>
                            <Separator />
                        </>
                    )}
                    <form className="grid grid-cols-2 gap-6 pb-8">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">Display Name</Label>
                            <Input id="name" defaultValue={item.name} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" defaultValue={item.category_name} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" type="number" defaultValue={item.base_price} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="stock">Total Stock</Label>
                            <Input id="stock" type="number" defaultValue={item.global_stock} readOnly className="bg-muted font-bold" />
                        </div>
                        <div className="flex flex-col gap-3 col-span-2">
                            <Label htmlFor="variant">Default Variant</Label>
                            <Input id="variant" defaultValue={item.variant} placeholder="e.g. Cotton / Blue / Large" />
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}