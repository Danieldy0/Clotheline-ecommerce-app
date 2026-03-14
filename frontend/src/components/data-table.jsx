"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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
import {
    CheckCircle2Icon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ColumnsIcon,
    GripVerticalIcon,
    LoaderIcon,
    MoreVerticalIcon,
    PlusIcon,
    TrendingUpIcon,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const FieldGroup = ({ className, ...props }) => <div className={cn("grid gap-4", className)} {...props} />
const FieldSet = ({ className, ...props }) => <fieldset className={cn("grid gap-2", className)} {...props} />
const FieldLegend = ({ className, ...props }) => <legend className={cn("text-sm font-semibold", className)} {...props} />
const FieldDescription = ({ className, ...props }) => <p className={cn("text-xs text-muted-foreground", className)} {...props} />
const Field = ({ className, orientation = "vertical", ...props }) => (
    <div className={cn("grid gap-1.5", orientation === "horizontal" && "flex items-center gap-2", className)} {...props} />
)
const FieldLabel = ({ className, ...props }) => <Label className={cn("text-sm font-medium", className)} {...props} />
const FieldSeparator = ({ className, ...props }) => <Separator className={cn("my-4", className)} {...props} />

export const schema = z.object({
    id: z.number(),
    name: z.string(),
    category_name: z.string(),
    base_price: z.string(),
    created_at: z.string(),
    description: z.string().optional(),
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
            <GripVerticalIcon className="size-3 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

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

export function DataTable({
    data: initialData,
    onRefresh
}) {
    const [isSaving, setIsSaving] = React.useState(false)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [categories, setCategories] = React.useState([])
    const [editingProduct, setEditingProduct] = React.useState(null)

    const handleDelete = async (slug) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const response = await fetch(`http://localhost:8000/api/products/products/${slug}/`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success('Product deleted')
                if (onRefresh) onRefresh()
            } else {
                throw new Error('Failed to delete')
            }
        } catch (error) {
            toast.error('Error deleting product')
        }
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
            header: "Product Name",
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
                        {row.original.category_name || "N/A"}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "base_price",
            header: () => <div className="w-full text-right">Price</div>,
            cell: ({ row }) => (
                <div className="text-right font-medium">
                    ${row.original.base_price}
                </div>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Added On",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.original.created_at).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: "placeholder",
            header: "",
            cell: () => null,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                            size="icon"
                        >
                            <MoreVerticalIcon />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => setEditingProduct(row.original)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Make a copy</DropdownMenuItem>
                        <DropdownMenuItem>Favorite</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(row.original.slug)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/products/categories/')
                if (response.ok) {
                    const data = await response.json()
                    setCategories(data)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    // Form states
    const [newName, setNewName] = React.useState("")
    const [newCategory, setNewCategory] = React.useState("")
    const [newPrice, setNewPrice] = React.useState("")
    const [newDescription, setNewDescription] = React.useState("")
    const [newVariants, setNewVariants] = React.useState([{ color: "", size: "M", stock: 0, price_override: "" }])
    const [newImages, setNewImages] = React.useState([])
    const [imagePreviews, setImagePreviews] = React.useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!newCategory) {
            toast.error('Please select a category')
            return
        }

        setIsSaving(true)

        const formData = new FormData()
        formData.append('name', newName)
        formData.append('category', newCategory)
        formData.append('base_price', newPrice)
        formData.append('description', newDescription)

        const slug = editingProduct ? editingProduct.slug : newName.toLowerCase().trim().replace(/\s+/g, '-')
        formData.append('slug', slug)

        // Clean variants
        const variantsToUpload = newVariants.filter(v => v.color && v.size)
        formData.append('variants_json', JSON.stringify(variantsToUpload))

        // Append images
        newImages.forEach((file) => {
            formData.append('image_files', file)
        })

        try {
            const url = editingProduct
                ? `http://localhost:8000/api/products/products/${editingProduct.slug}/`
                : 'http://localhost:8000/api/products/products/'

            const method = editingProduct ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method: method,
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(JSON.stringify(errorData))
            }

            toast.success(editingProduct ? 'Product updated' : 'Product added')
            setIsDialogOpen(false)
            setEditingProduct(null)
            if (onRefresh) onRefresh()

            // Reset form
            resetForm()

        } catch (error) {
            console.error('Error saving product:', error)
            toast.error(`Error saving product: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    const resetForm = () => {
        setNewName("")
        setNewCategory("")
        setNewPrice("")
        setNewDescription("")
        setNewVariants([{ color: "", size: "M", stock: 0, price_override: "" }])
        setNewImages([])
        setImagePreviews([])
    }

    React.useEffect(() => {
        if (editingProduct) {
            setNewName(editingProduct.name)
            setNewCategory(editingProduct.category?.toString() || "")
            setNewPrice(editingProduct.base_price)
            setNewDescription(editingProduct.description)
            setNewVariants(editingProduct.variants?.length > 0
                ? editingProduct.variants.map(v => ({ ...v, price_override: v.price_override || "" }))
                : [{ color: "", size: "M", stock: 0, price_override: "" }])
            setIsDialogOpen(true)
        }
    }, [editingProduct])

    const handleDialogChange = (open) => {
        setIsDialogOpen(open)
        if (!open) {
            setEditingProduct(null)
            resetForm()
        }
    }

    const addVariant = () => {
        setNewVariants([...newVariants, { color: "", size: "M", stock: 0, price_override: "" }])
    }

    const removeVariant = (index) => {
        setNewVariants(newVariants.filter((_, i) => i !== index))
    }

    const updateVariant = (index, field, value) => {
        const updated = [...newVariants]
        updated[index][field] = value
        setNewVariants(updated)
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setNewImages([...newImages, ...files])

        // Add previews
        const newPreviews = files.map(file => URL.createObjectURL(file))
        setImagePreviews([...imagePreviews, ...newPreviews])
    }

    const removeImage = (index) => {
        const updatedImages = newImages.filter((_, i) => i !== index)
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index)

        // Revoke URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index])

        setNewImages(updatedImages)
        setImagePreviews(updatedPreviews)
    }

    const [data, setData] = React.useState(() => initialData)
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
            className="flex w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6 dark:text-white">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <Select defaultValue="outline">
                    <SelectTrigger
                        className="@4xl/main:hidden flex w-fit"
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
                <TabsList className="@4xl/main:flex hidden">
                    <TabsTrigger value="outline">Outline</TabsTrigger>
                    <TabsTrigger value="past-performance" className="gap-1">
                        Past Performance{" "}
                        <Badge
                            variant="secondary"
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
                        >
                            3
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="key-personnel" className="gap-1">
                        Key Personnel{" "}
                        <Badge
                            variant="secondary"
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
                        >
                            2
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="dark:text-white">
                            <Button variant="outline" size="sm">
                                <ColumnsIcon />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <ChevronDownIcon />
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
                    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="dark:text-white text-black">
                                <PlusIcon />
                                <span className="hidden lg:inline">Add Product</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                                <DialogDescription>
                                    {editingProduct ? "Update product details." : "Add a new product to the table."}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    <FieldSet>
                                        <FieldLegend>Product Details</FieldLegend>
                                        <FieldDescription>
                                            Enter the details for the new entry.
                                        </FieldDescription>
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="new-name">Product Name</FieldLabel>
                                                <Input
                                                    id="new-name"
                                                    placeholder="e.g. Classic T-Shirt"
                                                    required
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                />
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="new-category">Category</FieldLabel>
                                                <Select value={newCategory} onValueChange={setNewCategory}>
                                                    <SelectTrigger id="new-category">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                        {categories.length === 0 && (
                                                            <SelectItem disabled value="none">No categories found</SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="new-price">Price ($)</FieldLabel>
                                                <Input
                                                    id="new-price"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="29.99"
                                                    required
                                                    value={newPrice}
                                                    onChange={(e) => setNewPrice(e.target.value)}
                                                />
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="new-description">Description</FieldLabel>
                                                <Textarea
                                                    id="new-description"
                                                    placeholder="Describe your product..."
                                                    value={newDescription}
                                                    onChange={(e) => setNewDescription(e.target.value)}
                                                />
                                            </Field>

                                            <FieldSeparator />

                                            <FieldSet>
                                                <div className="flex items-center justify-between">
                                                    <FieldLegend>Variants</FieldLegend>
                                                    <Button type="button" variant="ghost" size="sm" onClick={addVariant}>
                                                        <PlusIcon className="w-4 h-4 mr-1" /> Add
                                                    </Button>
                                                </div>
                                                <div className="grid gap-4 mt-2">
                                                    {newVariants.map((v, idx) => (
                                                        <div key={idx} className="grid grid-cols-12 gap-2 items-end border p-2 rounded-md bg-muted/20">
                                                            <div className="col-span-4">
                                                                <Label className="text-[10px]">Color</Label>
                                                                <Input
                                                                    placeholder="Blue"
                                                                    value={v.color}
                                                                    onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-span-3">
                                                                <Label className="text-[10px]">Size</Label>
                                                                <Select value={v.size} onValueChange={(val) => updateVariant(idx, 'size', val)}>
                                                                    <SelectTrigger className="h-9">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="S">S</SelectItem>
                                                                        <SelectItem value="M">M</SelectItem>
                                                                        <SelectItem value="L">L</SelectItem>
                                                                        <SelectItem value="XL">XL</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <Label className="text-[10px]">Stock</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={v.stock}
                                                                    onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value))}
                                                                />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <Label className="text-[10px]">Price ±</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Opt"
                                                                    value={v.price_override}
                                                                    onChange={(e) => updateVariant(idx, 'price_override', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-span-1">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-9 w-9 text-destructive"
                                                                    onClick={() => removeVariant(idx)}
                                                                    disabled={newVariants.length === 1}
                                                                >
                                                                    <MoreVerticalIcon className="rotate-45" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </FieldSet>

                                            <FieldSeparator />

                                            <FieldSet>
                                                <FieldLegend>Images</FieldLegend>
                                                <div className="grid grid-cols-4 gap-2 mt-2">
                                                    {imagePreviews.map((src, idx) => (
                                                        <div key={idx} className="relative aspect-square border rounded-md overflow-hidden bg-muted">
                                                            <img src={src} className="object-cover w-full h-full" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(idx)}
                                                                className="absolute top-0 right-0 p-1 bg-black/50 text-white hover:bg-black"
                                                            >
                                                                <MoreVerticalIcon className="rotate-45 w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <label className="aspect-square border border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-muted font-light text-muted-foreground">
                                                        <Input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                                        <PlusIcon className="w-6 h-6" />
                                                    </label>
                                                </div>
                                            </FieldSet>
                                        </FieldGroup>
                                    </FieldSet>
                                </FieldGroup>
                                <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
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
                        <div className="hidden items-center gap-2 lg:flex dark:text-white">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="w-20" id="rows-per-page">
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
                        <div className="flex w-fit items-center justify-center text-sm font-medium dark:text-white">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0 dark:text-white">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRightIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRightIcon />
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
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground">
                    {item.name}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
                <SheetHeader className="gap-1">
                    <SheetTitle>{item.name}</SheetTitle>
                    <SheetDescription>
                        {item.description || "No description available."}
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
                    {!isMobile && (
                        <>
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 0,
                                        right: 10,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        hide
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Area
                                        dataKey="mobile"
                                        type="natural"
                                        fill="var(--color-mobile)"
                                        fillOpacity={0.6}
                                        stroke="var(--color-mobile)"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="desktop"
                                        type="natural"
                                        fill="var(--color-desktop)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-desktop)"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="flex gap-2 font-medium leading-none">
                                    Trending up by 5.2% this month{" "}
                                    <TrendingUpIcon className="size-4" />
                                </div>
                                <div className="text-muted-foreground">
                                    Showing total visitors for the last 6 months. This is just
                                    some random text to test the layout. It spans multiple lines
                                    and should wrap around.
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}
                    <div className="flex flex-col gap-6 py-4 overflow-y-auto">
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground font-semibold uppercase text-xs">Images</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {item.images?.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-md border overflow-hidden">
                                        <img src={img.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {(!item.images || item.images.length === 0) && (
                                    <div className="col-span-2 aspect-square rounded-md border border-dashed flex items-center justify-center text-muted-foreground bg-muted/10">
                                        No images uploaded
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-muted-foreground font-semibold uppercase text-xs">Product Details</Label>
                            <div className="grid gap-1">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Category:</span>
                                    <span className="font-medium">{item.category_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Base Price:</span>
                                    <span className="font-medium">${item.base_price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Added:</span>
                                    <span className="font-medium">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-muted-foreground font-semibold uppercase text-xs">Variants & Stock</Label>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableHead className="py-2 h-8">Color</TableHead>
                                            <TableHead className="py-2 h-8">Size</TableHead>
                                            <TableHead className="py-2 h-8">Stock</TableHead>
                                            <TableHead className="py-2 h-8 text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {item.variants?.map((v, idx) => (
                                            <TableRow key={idx} className="hover:bg-transparent h-8">
                                                <TableCell className="py-2">{v.color}</TableCell>
                                                <TableCell className="py-2">{v.size}</TableCell>
                                                <TableCell className="py-2">{v.stock}</TableCell>
                                                <TableCell className="py-2 text-right">${v.price}</TableCell>
                                            </TableRow>
                                        ))}
                                        {(!item.variants || item.variants.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                                    No variants defined
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
                <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
                    <Button className="w-full">Submit</Button>
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">
                            Done
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
