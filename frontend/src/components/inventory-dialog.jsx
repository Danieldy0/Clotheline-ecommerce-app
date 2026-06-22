"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { SonnerTypes } from "./SonnerTypes"

export default function InventoryDialog({ onRefresh }) {
    const [categories, setCategories] = useState([])
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [preview, setPreview] = useState(null)

    // Variant Management State
    const [variantsList, setVariantsList] = useState([])
    const [newVariant, setNewVariant] = useState({ color: "", size: "M", stock: "1" })

    // Calculate total stock automatically
    const globalStock = variantsList.reduce((acc, curr) => acc + parseInt(curr.stock || "0"), 0)

    const sizeOptions = [
        { value: "S", label: "Small" },
        { value: "M", label: "Medium" },
        { value: "L", label: "Large" },
        { value: "XL", label: "Extra Large" },
    ]

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/products/categories/`)
                if (response.ok) {
                    const d = await response.json()
                    setCategories(Array.isArray(d) ? d : (d.results || []))
                }
            } catch (error) {
                console.error("Fetch categories error:", error)
            }
        }
        if (open) fetchCategories()
    }, [open])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    const addVariant = () => {
        if (!newVariant.color) {
            toast.error("Please enter a color")
            return
        }
        if (parseInt(newVariant.stock) <= 0) {
            toast.error("Initial stock must be at least 1")
            return
        }
        setVariantsList([...variantsList, { ...newVariant, id: Date.now() }])
        setNewVariant({ color: "", size: "M", stock: "1" })
    }

    const removeVariant = (id) => {
        setVariantsList(variantsList.filter(v => v.id !== id))
    }

    // Helper to convert file to Base64
    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })

    async function handleSubmit(event) {
        event.preventDefault()
        if (!selectedCategory) {
            toast.error("Please select a category")
            return
        }
        if (variantsList.length === 0) {
            toast.error("Please add at least one product variant")
            return
        }

        setIsSubmitting(true)
        const formElement = event.currentTarget
        const mainFormData = new FormData(formElement)
        
        // We start with a fresh FormData to be absolutely sure no hidden fields interfere
        const submissionData = new FormData()
        
        // 1. Core Model Fields (as expected by ProductSerializer)
        submissionData.append("name", mainFormData.get("name"))
        submissionData.append("description", mainFormData.get("description"))
        submissionData.append("base_price", mainFormData.get("base_price"))
        submissionData.append("category", selectedCategory)
        submissionData.append("global_stock", globalStock.toString())

        // 2. Variants (via the backend's special 'variants_json' hook)
        const cleanVariants = variantsList.map(({ id, ...v }) => ({
            color: v.color,
            size: v.size,
            stock: parseInt(v.stock),
            price_override: null
        }))
        submissionData.append("variants_json", JSON.stringify(cleanVariants))

        // 3. Images (via the backend's 'image_files' hook)
        const fileInput = formElement.querySelector('input[type="file"]')
        const file = fileInput?.files?.[0]
        if (file) {
            submissionData.append("image_files", file)
        }

        try {
            const response = await fetch(`http://localhost:8000/api/products/products/`, {
                method: "POST",
                body: submissionData,
            })

            const text = await response.text()
            let responseData
            try {
                responseData = JSON.parse(text)
            } catch (e) {
                throw new Error(`Server returned HTML (Status ${response.status}). This usually means a crash at serializers.py line 64 or 76.`)
            }

            if (!response.ok) {
                const errorMessage = responseData.detail || JSON.stringify(responseData)
                throw new Error(errorMessage)
            }

            toast.success("Product added successfully!")
            setOpen(false)
            setPreview(null)
            setSelectedCategory("")
            setVariantsList([])
            formElement.reset()
            if (onRefresh) onRefresh()
        } catch (error) {
            toast.error(`Error: ${error.message || "Submission failed"}`)
            console.error("Submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconPlus className="mr-2 h-4 w-4" />
                    <span>Add Product</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Product to Inventory</DialogTitle>
                        <DialogDescription>
                            Enter details, manage variants, and upload an image.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-1">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="images">Product Image</Label>
                                    <div className="relative h-40 w-full rounded-md border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted/50">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground uppercase font-semibold">No Image</span>
                                        )}
                                    </div>
                                    <Input id="image" name="image_files" type="file" accept="image/*" onChange={handleImageChange} className="text-xs" />
                                </div>
                                <Field className="grid gap-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input id="name" name="name" required placeholder="e.g. Vintage Denim Jacket" />
                                </Field>
                            </div>

                            <div className="space-y-4">
                                <Field className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field className="grid gap-2">
                                    <Label htmlFor="base_price">Base Price ($)</Label>
                                    <Input id="base_price" name="base_price" type="number" step="100" required placeholder="Enter base price" min={0} />
                                </Field>
                            </div>
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="variants" className="text-sm font-bold">Variant</Label>
                                <Badge variant="outline" className="text-[7px] uppercase border-amber-200 text-amber-600">Required</Badge>
                            </div>
                            <div className="grid grid-cols-4 gap-2 items-end bg-muted/30 p-3 rounded-md border border-dashed">
                                <div className="space-y-1.5 flex-1">
                                    <Label htmlFor="color" className="text-[10px] uppercase font-bold text-muted-foreground">Color</Label>
                                    <Input
                                        placeholder="Blue"
                                        value={newVariant.color}
                                        onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                                        size="sm"
                                        className="h-8"
                                    />
                                </div>
                                <div className="space-y-0.2 w-24">
                                    <Label htmlFor="size" className="text-[10px] uppercase font-bold text-muted-foreground">Size</Label>
                                    <Select
                                        value={newVariant.size}
                                        onValueChange={(val) => setNewVariant({ ...newVariant, size: val })}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sizeOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.value}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5 w-20">
                                    <Label htmlFor="stock" className="text-[10px] uppercase font-bold text-muted-foreground">Stock</Label>
                                    <Input
                                        required
                                        type="number"
                                        value={newVariant.stock}
                                        onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                                        className="h-8 shadow-none"
                                        min={1}
                                    />
                                </div>
                                <Button type="button" size="sm" onClick={addVariant} className="h-8">
                                    Add
                                </Button>
                            </div>

                            {variantsList.length > 0 && (
                                <div className="border rounded-sm overflow-hidden shadow-sm">
                                    <table className="w-full text-xs" required>
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="p-2 text-left font-bold uppercase tracking-wider opacity-60">Color</th>
                                                <th className="p-2 text-left font-bold uppercase tracking-wider opacity-60">Size</th>
                                                <th className="p-2 text-left font-bold uppercase tracking-wider opacity-60">Stock</th>
                                                <th className="p-2 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {variantsList.map((v) => (
                                                <tr key={v.id} className="hover:bg-muted/10 transition-colors">
                                                    <td className="p-2"><Badge variant="outline">{v.color}</Badge></td>
                                                    <td className="p-2 font-black">{v.size}</td>
                                                    <td className="p-2 tabular-nums">{v.stock}</td>
                                                    <td className="p-2 text-right">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-6 text-destructive"
                                                            onClick={() => removeVariant(v.id)}
                                                        >
                                                            <IconTrash className="size-3" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <Field className="grid gap-2">
                            <Label htmlFor="global_stock">Global Stock (Calculated)</Label>
                            <Input
                                id="global_stock"
                                name="global_stock"
                                value={globalStock}
                                readOnly
                                className="bg-muted font-bold text-primary"
                            />
                            <p className="text-[10px] text-muted-foreground italic">Automatically calculated from variants above.</p>
                        </Field>
                        <Field className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" required placeholder="Describe the item's material, fit, and style..." />
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="gap-2 border-t pt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <SonnerTypes isSubmitting={isSubmitting} label="Save Product" />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}