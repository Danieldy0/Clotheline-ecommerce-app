import { useState, useEffect } from 'react';
import {
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    TagIcon,
    ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';

// Skeleton card for loading state
function SkeletonCard() {
    return (
        <div className="h-full bg-white dark:bg-neutral-900 p-10 rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse">
            <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-neutral-800 rounded-xl mb-8" />
            <div className="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-1/3 mb-5" />
            <div className="h-6 bg-gray-100 dark:bg-neutral-800 rounded w-2/3 mb-4" />
            <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-5/6 mb-8" />
            <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-1/4" />
        </div>
    );
}

const ProductSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/products/products/`);
                if (!res.ok) throw new Error('Failed to load products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Resolve product image URL
    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            const img = product.images[0];
            const src = img.image || img.url || img;
            if (typeof src === 'string') {
                return src.startsWith('http') ? src : `${API_BASE}${src}`;
            }
        }
        return null;
    };

    const formatPrice = (price) => {
        const num = parseFloat(price);
        if (isNaN(num)) return price;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(num);
    };

    return (
        <section className="py-32 bg-[#fafafa] dark:bg-neutral-950 transition-colors duration-500 overflow-hidden">
            <div className="mx-auto px-6 relative">

                {/* Header */}
                <div className="text-center mb-24">
                    <div className="inline-block relative mb-6">
                        <span className="text-[11px] font-bold tracking-[0.4em] text-gray-400 dark:text-gray-500 uppercase">
                            Collection
                        </span>
                        <div className="h-[1px] w-12 bg-gray-300 dark:bg-gray-700 mx-auto mt-3"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-8 tracking-tight">
                        Our Products
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-light">
                        Explore our curated selection of premium products. Every item is crafted with care and designed to elevate your everyday.
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-20">
                        <ShoppingBagIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Could not load products. Please try again later.</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-20">
                        <ShoppingBagIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-light">No products available yet.</p>
                        <p className="text-gray-400 dark:text-gray-600 text-sm mt-2">Check back soon — new items are on the way.</p>
                    </div>
                )}

                {/* Products Carousel */}
                {!loading && !error && products.length > 0 && (
                    <div className="relative group/slider">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 4 },
                            }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            loop={products.length > 3}
                            navigation={{
                                prevEl: '.swiper-prev',
                                nextEl: '.swiper-next',
                            }}
                            pagination={{
                                clickable: true,
                                el: '.custom-pagination'
                            }}
                            className="!pb-20"
                        >
                            {products.slice(0, 7).map((product) => {
                                const imageUrl = getImageUrl(product);
                                return (
                                    <SwiperSlide key={product.id}>
                                        <Link to={`/products/${product.slug}`}>
                                            <div className="relative h-full max-w-7xl bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 group cursor-grab active:cursor-grabbing overflow-hidden">

                                                {/* Product Image */}
                                                <div className="w-full aspect-[4/3] bg-gray-50 dark:bg-neutral-800 overflow-hidden">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={product.name}
                                                            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    {/* Fallback if no image */}
                                                    <div
                                                        className={`w-full h-full items-center justify-center ${imageUrl ? 'hidden' : 'flex'}`}
                                                        style={{ display: imageUrl ? 'none' : 'flex' }}
                                                    >
                                                        <ShoppingBagIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                                                    </div>
                                                </div>

                                                {/* Card Content */}
                                                <div className="p-8">
                                                    {/* Category Badge */}
                                                    {product.category_name && (
                                                        <div className="flex items-center gap-1.5 mb-4">
                                                            <TagIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                                            <span className="text-[10px] font-bold tracking-[0.25em] text-gray-400 dark:text-gray-500 uppercase">
                                                                {product.category_name}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Name */}
                                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 tracking-tight line-clamp-2">
                                                        {product.name}
                                                    </h3>

                                                    {/* Description */}
                                                    {product.description && (
                                                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 font-light text-sm line-clamp-3">
                                                            {product.description}
                                                        </p>
                                                    )}

                                                    {/* Price + CTA */}
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <span className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
                                                            {formatPrice(product.base_price)}
                                                        </span>
                                                        <a
                                                            href={`#product-${product.slug || product.id}`}
                                                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black dark:text-white group/link hover:gap-3 transition-all duration-300"
                                                        >
                                                            Shop Now
                                                            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* Hover bottom accent */}
                                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-neutral-900 dark:bg-white transition-all duration-500 group-hover:w-full rounded-b-2xl"></div>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>

                        {/* Navigation Buttons */}
                        <button className="swiper-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 rounded-full bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 shadow-xl flex items-center justify-center text-black dark:text-white opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0 transition-all duration-500">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button className="swiper-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 rounded-full bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 shadow-xl flex items-center justify-center text-black dark:text-white opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0 transition-all duration-500">
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>

                        {/* Custom Pagination */}
                        <div className="custom-pagination !bottom-4 flex justify-center gap-2"></div>
                    </div>
                )}
            </div>

            {/* Pagination Style Overrides */}
            <style jsx="true">{`
                .custom-pagination .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: #d1d5db;
                    opacity: 1;
                    transition: all 0.3s ease;
                    border-radius: 4px;
                }
                .custom-pagination .swiper-pagination-bullet-active {
                    width: 24px;
                    background: #171717;
                }
                .dark .custom-pagination .swiper-pagination-bullet {
                    background: #404040;
                }
                .dark .custom-pagination .swiper-pagination-bullet-active {
                    background: #ffffff;
                }
            `}</style>
        </section>
    );
};

export default ProductSection;
