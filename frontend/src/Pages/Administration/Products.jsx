import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DataTable } from "@/components/data-table"
import { toast } from "sonner"

export default function Products() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const user = localStorage.getItem('currentUser')

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/products/products/')
            if (!response.ok) throw new Error('Failed to fetch products')
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Could not load products. Please check if the server is running.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!user) {
            navigate('/adminlog')
            return
        }

        fetchProducts()
    }, [user, navigate])

    if (!user) {
        return null
    }

    return (
        <TooltipProvider>
            <SidebarProvider className="p-6"
                style={{
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                }}>
                <AppSidebar variant="inset" />
                <SidebarInset className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <div className="px-4 lg:px-6">
                                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                                </div>
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : (
                                    <DataTable data={products} onRefresh={fetchProducts} />
                                )}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
