import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Ai from '../components/Ai'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import {
    IconArrowLeft,
    IconShoppingBag,
    IconTruckDelivery,
    IconRefresh,
    IconShieldCheck
} from '@tabler/icons-react'
import { toast } from 'sonner'

export default function ProductSlug() {
    const { slug } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)

    const API_BASE = 'http://localhost:8000'

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/products/products/${slug}/`)
                if (!response.ok) throw new Error("Product not found")
                const data = await response.json()
                setProduct(data)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [slug])

    // Resolve image URL
    const getResolvedImageUrl = (imgObj) => {
        if (!imgObj) return "https://via.placeholder.com/800";
        const src = imgObj.image || imgObj.url || imgObj;
        if (typeof src === 'string') {
            return src.startsWith('http') ? src : `${API_BASE}${src}`;
        }
        return "https://via.placeholder.com/800";
    }

    const handleAddToCart = () => {
        toast.success(`${product.name} added to cart!`)
    }
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
            <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin dark:border-neutral-800 dark:border-t-white" />
                <p className="text-sm font-medium animate-pulse">Unveiling perfection...</p>
            </div>
        </div>
    )

    if (error || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 p-6 text-center">
            <Header />
            <div className="max-w-md space-y-6 pt-20">
                <div className="size-20 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <IconShoppingBag size={40} />
                </div>
                <h1 className="text-3xl font-black tracking-tight">Product Not Found</h1>
                <p className="text-muted-foreground">The item you're looking for might have been moved or is no longer available in our collection.</p>
                <Button asChild variant="outline" className="rounded-full px-8">
                    <Link to="/">Back to Collection</Link>
                </Button>
            </div>
        </div>
    )

    const images = product.images?.length > 0 ? product.images : [{ image: "https://via.placeholder.com/800" }]

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans">
            <Header />

            <main className="mx-auto px-6 py-20 animate-in fade-in duration-1000">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-neutral-400 hover:text-black dark:hover:text-white transition-colors group"
                >
                    <IconArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                </Link>

                {/* Style Header (as seen in the portfolio image) */}
                <div className="flex flex-col items-center text-center mb-24 space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">Curated Item</span>
                    <div className="w-12 h-[1px] bg-neutral-300 dark:bg-neutral-700 mb-2"></div>
                    <h1 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 dark:text-white">
                        Product Details
                    </h1>
                    <p className="max-w-2xl text-neutral-500 dark:text-neutral-400 leading-relaxed font-light text-lg px-4">
                        Discover the harmony of design and functionality. Every piece in our collection is a testament to meticulous craftsmanship and timeless elegance.
                    </p>
                </div>

                {/* Main Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-neutral-50/50 dark:bg-neutral-900/20 rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-800 p-8 lg:p-0">

                    {/* Left side: Image (takes 7 cols) */}
                    <div className="lg:col-span-7 relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                        <div className="aspect-[16/10] lg:h-full">
                            <img
                                src={getResolvedImageUrl(images[selectedImage])}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                            />
                        </div>
                        {product.global_stock === 0 && (
                            <Badge variant="destructive" className="absolute top-8 left-8 px-6 py-2 rounded-full text-[10px] uppercase font-black tracking-widest bg-rose-600 text-white border-none shadow-2xl">
                                Out of Stock
                            </Badge>
                        )}

                        {/* Thumbnail Strip (Floating) */}
                        {images.length > 1 && (
                            <div className="absolute bottom-8 left-8 right-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`size-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 backdrop-blur-sm ${selectedImage === idx ? 'border-white scale-110 shadow-2xl' : 'border-white/20 opacity-60'
                                            }`}
                                    >
                                        <img src={getResolvedImageUrl(img)} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right side: Detailed Information (takes 5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-center p-8 lg:p-16 space-y-10">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                                <span>{product.category_name}</span>
                                <span className="text-neutral-300">2024</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
                                {product.name}
                            </h2>

                            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-light text-base lg:text-lg">
                                {product.description}
                            </p>

                            <div className="pt-4 space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2">Pricing</p>
                                <p className="text-3xl font-light text-neutral-900 dark:text-white">
                                    ${parseFloat(product.base_price).toLocaleString()}
                                </p>
                            </div>

                            {/* Options with Portfolio aesthetics */}
                            {product.variants?.length > 0 && (
                                <div className="pt-4 space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Specifications</p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                                        {[...new Set(product.variants.map(v => `${v.color} · ${v.size}`))].map((variantText, idx) => (
                                            <span key={idx} className="text-xs font-light text-neutral-400">
                                                {variantText}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-8 space-y-4">
                            <Button
                                onClick={handleAddToCart}
                                disabled={product.global_stock === 0}
                                className="h-14 w-full lg:w-fit px-12 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white hover:bg-neutral-900 hover:text-white dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-black transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white shadow-sm"
                            >
                                {product.global_stock > 0 ? "Add to Cart" : "Item Unavailable"}
                            </Button>

                            <div className="flex items-center gap-4 pt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300">
                                <span className="flex items-center gap-1.5"><IconTruckDelivery size={14} /> Shipping</span>
                                <span className="flex items-center gap-1.5"><IconRefresh size={14} /> Returns</span>
                                <span className="flex items-center gap-1.5"><IconShieldCheck size={14} /> Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Ai />
            <Footer />
        </div>
    )
}