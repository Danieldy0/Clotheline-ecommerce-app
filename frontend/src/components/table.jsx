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
    ChevronDown as IconChevronDown,
    ChevronLeft as IconChevronLeft,
    ChevronRight as IconChevronRight,
    ChevronsLeft as IconChevronsLeft,
    ChevronsRight as IconChevronsRight,
    CheckCircle2 as IconCircleCheckFilled,
    MoreVertical as IconDotsVertical,
    GripVertical as IconGripVertical,
    Columns as IconLayoutColumns,
    Loader2 as IconLoader,
    Plus as IconPlus,
    TrendingUp as IconTrendingUp,
    Trash2 as IconTrash,
    Pencil as IconEdit,
    Search as IconSearch,
} from "lucide-react"
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
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

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
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

/**
 * DRAG HANDLE COMPONENT
 */
function DragHandle({ id }) {
    const { attributes, listeners } = useSortable({ id })
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

export const schema = z.object({
    id: z.number(),
    header: z.string(),
    type: z.string(),
    status: z.string(),
    target: z.string(),
    limit: z.string(),
    reviewer: z.string(),
})

/**
 * DRAGGABLE ROW COMPONENT
 */
function DraggableRow({ row }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id.toString(),
    })
    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 transition-colors"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="data-[slot=table-cell]:first:w-8">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

/**
 * MAIN DATA TABLE COMPONENT
 */
export function DateTable({ data: initialData, onRefresh }) {
    const [data, setData] = React.useState(() => initialData)
    const [categories, setCategories] = React.useState([])
    const [isSaving, setIsSaving] = React.useState(false)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingProduct, setEditingProduct] = React.useState(null)

    // Sync categories
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/products/categories/')
                if (response.ok) {
                    const d = await response.json()
                    setCategories(Array.isArray(d) ? d : (d.results || []))
                }
            } catch (error) { console.error('Fetch categories error:', error) }
        }
        fetchCategories()
    }, [])

    // Sync state with prop
    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

    // Form logic
    const [newName, setNewName] = React.useState("")
    const [newCategory, setNewCategory] = React.useState("")
    const [newPrice, setNewPrice] = React.useState("")
    const [newDescription, setNewDescription] = React.useState("")
    const [newVariants, setNewVariants] = React.useState([{ color: "", size: "M", stock: 0 }])
    const [newImages, setNewImages] = React.useState([])
    const [imagePreviews, setImagePreviews] = React.useState([])

    const resetForm = () => {
        setNewName(""); setNewCategory(""); setNewPrice(""); setNewDescription("")
        setNewVariants([{ color: "", size: "M", stock: 0 }])
        setNewImages([]); setImagePreviews([])
    }

    React.useEffect(() => {
        if (editingProduct) {
            setNewName(editingProduct.name)
            setNewCategory(editingProduct.category?.toString() || "")
            setNewPrice(editingProduct.base_price)
            setNewDescription(editingProduct.description)
            setNewVariants(editingProduct.variants?.length > 0 ? editingProduct.variants : [{ color: "", size: "M", stock: 0 }])
            setIsDialogOpen(true)
        }
    }, [editingProduct])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newCategory) { toast.error('Category required'); return }
        setIsSaving(true)

        const formData = new FormData()
        formData.append('name', newName)
        formData.append('category', newCategory)
        formData.append('base_price', newPrice)
        formData.append('description', newDescription)
        formData.append('slug', editingProduct ? editingProduct.slug : newName.toLowerCase().trim().replace(/\s+/g, '-'))
        formData.append('variants_json', JSON.stringify(newVariants.filter(v => v.color)))
        newImages.forEach(file => formData.append('image_files', file))

        try {
            const url = editingProduct ? `http://localhost:8000/api/products/products/${editingProduct.slug}/` : 'http://localhost:8000/api/products/products/'
            const res = await fetch(url, { method: editingProduct ? 'PUT' : 'POST', body: formData })

            if (res.ok) {
                toast.success(editingProduct ? 'Product updated' : 'Product created')
                setIsDialogOpen(false)
                setEditingProduct(null)
                resetForm()
                if (onRefresh) onRefresh()
            } else {
                const errData = await res.json()
                const errMsg = typeof errData === 'object'
                    ? Object.values(errData).flat().join(', ')
                    : 'Failed to save product'
                throw new Error(errMsg)
            }
        } catch (err) {
            toast.error(err.message || 'Check server connection')
        }
        finally { setIsSaving(false) }
    }

    const triggerDelete = async (slug) => {
        if (!confirm('Are you sure?')) return
        try {
            const res = await fetch(`http://localhost:8000/api/products/products/${slug}/`, { method: 'DELETE' })
            if (res.ok) { toast.success('Removed'); if (onRefresh) onRefresh() }
        } catch (e) { toast.error('Error') }
    }

    // Table Columns
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
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Product Detail",
            cell: ({ row }) => <TableCellViewer item={row.original} />,
        },
        {
            accessorKey: "category_name",
            header: "Category",
            cell: ({ row }) => (
                <div className="w-32">
                    <Badge variant="outline" className="px-1.5 text-muted-foreground font-normal">
                        {row.original.category_name}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "base_price",
            header: () => <div className="w-full text-right pr-4">Base Price</div>,
            cell: ({ row }) => (
                <div className="text-right pr-4 font-mono font-medium">
                    ${parseFloat(row.original.base_price).toLocaleString()}
                </div>
            )
        },
        {
            id: "stock",
            header: "Stock Status",
            cell: ({ row }) => {
                const totalStock = row.original.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0
                const isLow = totalStock < 10
                return (
                    <Badge variant="outline" className={`px-1.5 gap-1.5 ${isLow ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {totalStock > 0 ? (
                            <IconCircleCheckFilled className={`size-3.5 ${isLow ? 'fill-amber-500' : 'fill-emerald-500'}`} />
                        ) : (
                            <IconLoader className="size-3.5 animate-spin" />
                        )}
                        {totalStock} in stock
                    </Badge>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 data-[state=open]:bg-muted">
                            <IconDotsVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => setEditingProduct(row.original)}>
                            <IconEdit className="size-4 mr-2" />Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { }}>
                            <IconTrendingUp className="size-4 mr-2" />View Trends
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => triggerDelete(row.original.slug)}>
                            <IconTrash className="size-4 mr-2" />Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ]

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState([])
    const [sorting, setSorting] = React.useState([])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const sortableId = React.useId()
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))
    const dataIds = React.useMemo(() => data?.map(({ id }) => id.toString()) || [], [data])

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
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
                const oldIndex = dataIds.indexOf(active.id.toString())
                const newIndex = dataIds.indexOf(over.id.toString())
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    return (
        <Tabs defaultValue="inventory" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="inventory" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Inventory <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-none">{data.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Categories
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Historical
                    </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                    <div className="relative mr-2 hidden md:block">
                        <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Quick find..."
                            className="pl-9 h-9 w-64 bg-background/50 focus-visible:bg-background border-none shadow-none ring-1 ring-border"
                            onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <IconLayoutColumns className="size-4" />
                                <span className="hidden lg:inline">Colums</span>
                                <IconChevronDown className="size-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {table.getAllColumns().filter(c => c.getCanHide()).map(c => (
                                <DropdownMenuCheckboxItem key={c.id} checked={c.getIsVisible()} onCheckedChange={v => c.toggleVisibility(!!v)} className="capitalize text-xs font-medium">{c.id}</DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open) }}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-9 gap-2 shadow-sm"><IconPlus className="size-4" /> Add Product</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh] p-0 gap-0 border-none">
                            <DialogHeader className="p-6 bg-muted/30">
                                <DialogTitle className="text-xl">List New Product</DialogTitle>
                                <DialogDescription>Fill in details to sync with live inventory.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Basic Information</Label>
                                    <div className="space-y-4 pt-2">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="name">Display Name</Label>
                                            <Input id="name" value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. Vintage Denim Jacket" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="category">Category</Label>
                                                <Select value={newCategory} onValueChange={setNewCategory}>
                                                    <SelectTrigger id="category"><SelectValue placeholder="Select..." /></SelectTrigger>
                                                    <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="price">Price ($)</Label>
                                                <Input id="price" type="number" min="0" step="100" value={newPrice} onChange={e => setNewPrice(e.target.value)} required placeholder="1000" />
                                            </div>
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="desc">Description</Label>
                                            <Textarea id="desc" value={newDescription} onChange={e => setNewDescription(e.target.value)} className="h-24 resize-none" placeholder="Provide a brief story for this item..." />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                                        Size & Color Allocation
                                        <Button type="button" variant="link" size="sm" className="h-auto p-0 text-primary" onClick={() => setNewVariants([...newVariants, { color: '', size: 'M', stock: 0 }])}>+ Add Variant</Button>
                                    </Label>
                                    <div className="space-y-2 pt-2">
                                        {newVariants.map((v, i) => (
                                            <div key={i} className="flex gap-3 items-center bg-muted/20 p-3 rounded-lg border border-dashed hover:border-border transition-colors group">
                                                <Input placeholder="Color / Finish" className="h-8 bg-background" value={v.color} onChange={e => { const n = [...newVariants]; n[i].color = e.target.value; setNewVariants(n) }} />
                                                <Select value={v.size} onValueChange={val => { const n = [...newVariants]; n[i].size = val; setNewVariants(n) }}>
                                                    <SelectTrigger className="h-8 w-24 bg-background"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Input type="number" className="h-8 w-20 bg-background" value={v.stock} onChange={e => { const n = [...newVariants]; n[i].stock = parseInt(e.target.value); setNewVariants(n) }} />
                                                <Button type="button" variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setNewVariants(newVariants.filter((_, idx) => idx !== i))}><IconTrash className="size-4 text-destructive" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gallery</Label>
                                    <div className="grid grid-cols-4 gap-3 pt-2">
                                        {imagePreviews.map((p, i) => (
                                            <div key={i} className="relative aspect-square rounded-lg border bg-muted overflow-hidden group">
                                                <img src={p} className="size-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button type="button" variant="destructive" size="icon" className="size-8" onClick={() => { const nI = newImages.filter((_, idx) => idx !== i); const nP = imagePreviews.filter((_, idx) => idx !== i); setNewImages(nI); setImagePreviews(nP) }}>
                                                        <IconTrash className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all text-muted-foreground hover:text-primary">
                                            <IconPlus className="size-6 mb-1" />
                                            <span className="text-[10px] font-medium">UPLOAD</span>
                                            <input type="file" multiple accept="image/*" className="hidden" onChange={e => { const files = Array.from(e.target.files); setNewImages([...newImages, ...files]); setImagePreviews([...imagePreviews, ...files.map(f => URL.createObjectURL(f))]) }} />
                                        </label>
                                    </div>
                                </div>

                                <DialogFooter className="pt-4 border-t px-6 py-4">
                                    <Button type="submit" disabled={isSaving} className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]">
                                        {isSaving ? <IconLoader className="size-5 animate-spin mr-2" /> : null}
                                        {isSaving ? 'Synchronizing...' : (editingProduct ? 'Commit Changes' : 'Create Product Reference')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <TabsContent value="inventory" className="px-4 lg:px-6 relative flex flex-col gap-4">
                <div className="overflow-hidden rounded-xl border bg-card/50 backdrop-blur shadow-sm">
                    <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors} id={sortableId}>
                        <Table>
                            <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                {table.getHeaderGroups().map(hg => (
                                    <TableRow key={hg.id} className="hover:bg-transparent border-none">
                                        {hg.headers.map(h => (
                                            <TableHead key={h.id} className="h-11 text-[11px] uppercase tracking-wider font-bold text-muted-foreground px-4">
                                                {flexRender(h.column.columnDef.header, h.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                        {table.getRowModel().rows.map(row => <DraggableRow key={row.id} row={row} />)}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                <div className="p-3 bg-muted rounded-full">
                                                    <IconSearch className="size-6" />
                                                </div>
                                                <p className="font-medium">No inventory records found</p>
                                                <Button variant="link" onClick={() => onRefresh()} className="text-xs">Refresh Database</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>

                <div className="flex items-center justify-between py-4 px-2">
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary" />
                        {table.getFilteredRowModel().rows.length} Units Manifested
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-xs font-medium text-muted-foreground">Volume</Label>
                            <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(v) => table.setPageSize(Number(v))}>
                                <SelectTrigger size="sm" className="h-8 w-20 text-xs bg-muted/50 border-none shadow-none"><SelectValue /></SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 50, 100].map(s => <SelectItem key={s} value={`${s}`} className="text-xs">{s} units</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" className="size-8 bg-muted/30 border-none" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><IconChevronLeft className="size-4" /></Button>
                                <Button variant="outline" size="icon" className="size-8 bg-muted/30 border-none" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><IconChevronRight className="size-4" /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="analytics" className="px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 rounded-2xl border p-6 bg-card shadow-sm h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-lg leading-none">Inventory Turnover</h3>
                                <p className="text-xs text-muted-foreground mt-1">Real-time depletion velocity across categories</p>
                            </div>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none px-2 py-0.5">+12.4% trend</Badge>
                        </div>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                                    <ChartTooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} content={<ChartTooltipContent indicator="dot" />} />
                                    <Area dataKey="desktop" type="monotone" fill="url(#colorDesktop)" stroke="hsl(var(--primary))" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="rounded-2xl border p-5 bg-card shadow-sm">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Stock Health</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Optimal</span>
                                    <span className="text-sm font-bold">78%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[78%]" />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Based on average 30-day velocity metrics.</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border p-5 bg-card shadow-sm">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Replenishment Alert</h4>
                            <div className="space-y-3">
                                {data.filter(p => p.variants?.some(v => v.stock < 5)).slice(0, 3).map(p => (
                                    <div key={p.id} className="flex items-center gap-3">
                                        <div className="size-8 rounded bg-muted overflow-hidden flex-shrink-0">
                                            <img src={`http://localhost:8000${p.images?.[0]?.image || p.images?.[0]}`} className="size-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold truncate">{p.name}</p>
                                            <p className="text-[9px] text-amber-500 font-medium">Critical: {p.variants?.reduce((a, v) => a + v.stock, 0)} left</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}

function TableCellViewer({ item }) {
    const isMobile = useIsMobile()
    const imageUrl = item.images?.[0]?.image || item.images?.[0]
    const fullUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`) : null

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer group py-1">
                    <div className="size-9 rounded-lg bg-muted overflow-hidden border border-border group-hover:border-primary/30 transition-all shadow-sm">
                        {fullUrl ? <img src={fullUrl} className="size-full object-cover grayscale group-hover:grayscale-0 transition-all" /> : null}
                    </div>
                    <div>
                        <Button variant="link" className="p-0 h-auto font-bold text-foreground group-hover:text-primary transition-colors no-underline">
                            {item.name}
                        </Button>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">SKU: {item.slug?.slice(-6).toUpperCase()}</p>
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md h-full flex flex-col p-0 border-none shadow-2xl">
                <SheetHeader className="p-6 bg-muted/20 border-b">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="px-1.5 py-0 text-[9px] uppercase font-bold tracking-widest">{item.category_name}</Badge>
                        <Badge variant="outline" className="px-1.5 py-0 text-[9px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 border-emerald-100">Active</Badge>
                    </div>
                    <SheetTitle className="text-2xl font-black italic tracking-tight uppercase leading-none">{item.name}</SheetTitle>
                    <SheetDescription className="text-xs uppercase tracking-wider font-mono opacity-60">ID REF: {item.slug}</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                    <div className="aspect-square relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-2" />
                        <div className="relative size-full rounded-2xl border-4 border-background bg-muted overflow-hidden shadow-xl rotate-1">
                            {fullUrl ? <img src={fullUrl} className="size-full object-cover" /> : <div className="size-full flex items-center justify-center text-muted-foreground/20 italic">No Media Found</div>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">Context & Story</Label>
                        <p className="text-sm text-foreground/80 font-medium leading-[1.6]">
                            {item.description || "Synthesizing premium aesthetics with utilitarian durability. This piece represents the pinnacle of our current collection design cycle."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <Label className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">Inventory Breakdown</Label>
                            <span className="text-[10px] font-bold text-muted-foreground mr-2">Total Units: {item.variants?.reduce((a, v) => a + v.stock, 0)}</span>
                        </div>
                        <div className="rounded-2xl border-2 border-muted overflow-hidden shadow-inner">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="h-9 text-[9px] font-black uppercase tracking-widest">Variation</TableHead>
                                        <TableHead className="h-9 text-[9px] font-black uppercase tracking-widest text-center">Batch Size</TableHead>
                                        <TableHead className="h-9 text-[9px] font-black uppercase tracking-widest text-right">Liquidity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {item.variants?.length > 0 ? (
                                        item.variants.map((v, i) => (
                                            <TableRow key={i} className="h-12 border-muted hover:bg-muted/10 transition-colors">
                                                <TableCell className="font-bold">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-3 rounded-full border shadow-sm" style={{ backgroundColor: v.color?.toLowerCase() }} />
                                                        {v.color} - {v.size}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-mono opacity-80">{v.stock}</TableCell>
                                                <TableCell className="text-right font-black text-emerald-500">${(v.stock * parseFloat(item.base_price)).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow><TableCell colSpan={3} className="text-center h-20 italic text-muted-foreground text-xs">No variations defined</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-3xl bg-primary/5 p-6 border border-primary/10">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">Demand Projection</Label>
                            <IconTrendingUp className="size-4 text-emerald-500" />
                        </div>
                        <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.slice(-4)}>
                                    <Area type="monotone" dataKey="desktop" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground mt-2 font-medium">Predictive analysis suggests +5% growth in next session</p>
                    </div>
                </div>

                <SheetFooter className="p-6 border-t bg-muted/5">
                    <SheetClose asChild>
                        <Button className="w-full h-11 text-base font-bold tracking-tight rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                            EXIT PREVIEW
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]
