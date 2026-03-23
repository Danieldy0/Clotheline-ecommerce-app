import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const products = [
    {
        id: 1,
        brand: 'The Row',
        name: 'Silk Slip Dress',
        price: '€890',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 2,
        brand: 'Totême',
        name: 'Wool Coat',
        price: '€1200',
        image: 'https://images.unsplash.com/photo-1539109132314-34a7795ee12f?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 3,
        brand: 'Sophie Buhai',
        name: 'Pearl Drop Earrings',
        price: '€350',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 4,
        brand: 'Khaite',
        name: 'Leather Loafers',
        price: '€590',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 5,
        brand: 'Jil Sander',
        name: 'Tangle Small Bag',
        price: '€750',
        image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 6,
        brand: 'Bottega Veneta',
        name: 'Drop Earrings',
        price: '€650',
        image: 'https://images.unsplash.com/photo-1535632787350-4e68e4af916b?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 7,
        brand: 'Lemaire',
        name: 'Croissant Bag',
        price: '€890',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 8,
        brand: 'Acne Studios',
        name: 'Mohair Beanie',
        price: '€150',
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop'
    }
];

const ProductSection = () => {
    return (
        <section className="py-24 bg-white dark:bg-black">
            <div className="text-center mb-20">
                <div className="inline-block relative mb-4">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase">Products</span>
                    <div className="h-[2px] w-8 bg-gray-400 dark:bg-gray-600 mx-auto mt-2"></div>
                </div>
                <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-8 tracking-tight">Recent Products</h2>
                <p className="max-w-3xl mx-auto text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                    Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit.
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam
                </p>
            </div>
            <div className="px-6">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={32}
                    slidesPerView={1.2}
                    breakpoints={{
                        640: { slidesPerView: 2.5, spaceBetween: 32 },
                        768: { slidesPerView: 3, spaceBetween: 32 },
                        1024: { slidesPerView: 4, spaceBetween: 32 },
                    }}
                    navigation={{
                        prevEl: '.hero-prev',
                        nextEl: '.hero-next',
                    }}
                    pagination={{ clickable: true }}
                    className="w-full !pb-16 group [&_.swiper-pagination-bullet]:bg-gray-400 [&_.swiper-pagination-bullet-active]:bg-black dark:[&_.swiper-pagination-bullet-active]:bg-white"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product.id}>
                            <div className="group cursor-pointer">
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-neutral-900 mb-6 transition-all duration-500 group-hover:opacity-90">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="bg-white/90 dark:bg-black/90 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-black dark:text-white border border-black/10 dark:border-white/10 backdrop-blur-sm rounded-full">
                                            View
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                            {product.brand}
                                        </h4>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                            {product.name}
                                        </h3>
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                                        {product.price}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    {/* Navigation Arrows */}
                    <button className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-900 dark:text-white" />
                    </button>
                    <button className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                        <ChevronRightIcon className="w-6 h-6 text-gray-900 dark:text-white" />
                    </button>
                </Swiper>
            </div>
        </section>
    );
};

export default ProductSection;
