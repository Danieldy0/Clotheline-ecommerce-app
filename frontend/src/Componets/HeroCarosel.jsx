import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { PlayIcon, ArrowTrendingUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import hero1 from '../assets/hero1.jpg'
import hero2 from '../assets/hero2.jpg'
import hero3 from '../assets/hero3.jpg'

const slides = [
  {
    image: hero1,
    title: 'Transform Your Business Vision Into Reality',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    cta: 'Get Started Today',
    stats: [
      { label: '500+', sublabel: 'Successful Projects' },
      { label: '98%', sublabel: 'Client Satisfaction' },
      { label: '10+', sublabel: 'Years Experience' },
    ],
    floatingCard: {
      title: 'Revenue Growth',
      value: '+45%',
    }
  },
  {
    image: hero2,
    title: 'Elevate Your Digital Presence Globally',
    subtitle: 'Discover innovative strategies that drive results and scale your brand to new heights with our expert team of designers and developers.',
    cta: 'Explore Solutions',
    stats: [
      { label: '1.2k', sublabel: 'Active Clients' },
      { label: '24/7', sublabel: 'Global Support' },
      { label: '150+', sublabel: 'Expert Tools' },
    ],
    floatingCard: {
      title: 'Market Reach',
      value: '+60%',
    }
  },
  {
    image: hero3,
    title: 'Transform Your Business Vision Into Reality',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    cta: 'Get Started Today',
    stats: [
      { label: '500+', sublabel: 'Successful Projects' },
      { label: '98%', sublabel: 'Client Satisfaction' },
      { label: '10+', sublabel: 'Years Experience' },
    ],
    floatingCard: {
      title: 'Revenue Growth',
      value: '+45%',
    }
  },
]

const HeroCarosel = () => {
  return (
    <div className="relative w-full bg-white dark:bg-black py-12 md:py-20 lg:py-24 group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: '.hero-pagination' }}
        navigation={{
          nextEl: '.hero-next',
          prevEl: '.hero-prev',
        }}
        loop
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Left Content */}
                <div className="flex flex-col space-y-8">
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-gray-900 dark:text-white leading-[1.1]">
                    {slide.title}
                  </h1>

                  <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-6">
                    <button className="bg-neutral-800 hover:bg-neutral-900 text-white px-8 py-4 rounded-lg font-medium shadow-lg transition-all active:scale-95">
                      {slide.cta}
                    </button>
                    <button className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:text-blue-600 transition-colors">
                      <div className="w-10 h-10 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center">
                        <PlayIcon className="w-5 h-5" />
                      </div>
                      Watch Demo
                    </button>
                  </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                    {slide.stats.map((stat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                          {stat.label}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          {stat.sublabel}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Image Section */}
                <div className="relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full aspect-[4/5] lg:aspect-square object-cover"
                    />
                  </div>

                  {/* Floating Card */}
                  <div className="absolute bottom-2 -left-6 md:-left-12 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 animate-bounce-subtle z-20">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                      <ArrowTrendingUpIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{slide.floatingCard.title}</div>
                      <div className="text-xl font-black text-emerald-500">{slide.floatingCard.value}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Arrows */}
        <button className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeftIcon className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
        <button className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
      </Swiper>

      {/* Pagination dots styling */}
      <div className="hero-pagination mt-12 flex justify-center gap-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet-active]:bg-gray-900 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet]:transition-all" />

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default HeroCarosel