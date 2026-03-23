import React, { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { PlayIcon, ArrowTrendingUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { createTimeline, utils, stagger } from 'animejs'

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
  const staggerVisualizerRef = useRef(null);

  useEffect(() => {
    if (!staggerVisualizerRef.current) return;

    let animation;
    let isUnmounted = false;
    let resizeTimeout;

    const staggerVisualizerEl = staggerVisualizerRef.current;
    const wrapperEl = staggerVisualizerEl.parentElement;

    let observer;

    function initGrid() {
      if (isUnmounted) return;
      if (animation) animation.pause();

      staggerVisualizerEl.innerHTML = '<div class="cursor text-red-500 bg-current"></div>';

      const rect = wrapperEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        resizeTimeout = setTimeout(initGrid, 100);
        return;
      }

      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      let dotTotalSize;

      // Scale dot spacing based on screen width
      if (window.innerWidth < 768) {
        dotTotalSize = 5 * rem; // Low density for mobile
      } else if (window.innerWidth < 1024) {
        dotTotalSize = 3.5 * rem; // Medium density for tablet
      } else {
        dotTotalSize = 2.5 * rem; // High density for desktop
      }

      const cols = Math.max(1, Math.floor(rect.width / dotTotalSize));
      const rows = Math.max(1, Math.floor(rect.height / (dotTotalSize)));
      const grid = [cols, rows];
      const numberOfElements = cols * rows;

      staggerVisualizerEl.style.width = `${cols * dotTotalSize}px`;
      staggerVisualizerEl.style.height = `${rows * dotTotalSize}px`;

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < numberOfElements; i++) {
        const dotEl = document.createElement('div');
        dotEl.classList.add('dot');
        const size = rem * 0.4;
        dotEl.style.width = `${size}px`;
        dotEl.style.height = `${size}px`;
        dotEl.style.margin = `${(dotTotalSize - size) / 2}px`;
        fragment.appendChild(dotEl);
      }

      staggerVisualizerEl.appendChild(fragment);

      const cursorEl = staggerVisualizerEl.querySelector('.cursor');
      const dotsEl = staggerVisualizerEl.querySelectorAll('.dot');

      let index = utils.random(0, numberOfElements - 1);
      let nextIndex = 0;

      utils.set(cursorEl, {
        x: stagger(`-${dotTotalSize}px`, { grid, from: index, axis: 'x' }),
        y: stagger(`-${dotTotalSize}px`, { grid, from: index, axis: 'y' })
      });

      function animateGrid() {
        if (isUnmounted) return;
        if (animation) animation.pause();

        nextIndex = utils.random(0, numberOfElements - 1);

        animation = createTimeline({
          defaults: { ease: 'inOutQuad' },
          onComplete: animateGrid
        })
          .add(cursorEl, {
            keyframes: [
              { scale: .625 },
              { scale: 1.125 },
              { scale: 1 }
            ],
            duration: 600
          })
          .add(dotsEl, {
            keyframes: [
              {
                x: stagger('-.35rem', { grid, from: index, axis: 'x' }),
                y: stagger('-.35rem', { grid, from: index, axis: 'y' }),
                duration: 200
              }, {
                x: stagger('.25rem', { grid, from: index, axis: 'x' }),
                y: stagger('.25rem', { grid, from: index, axis: 'y' }),
                scale: 2,
                duration: 500
              }, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 600,
              }
            ],
            delay: stagger(50, { grid, from: index }),
          }, 0)
          .add(cursorEl, {
            x: { from: stagger(`-${dotTotalSize}px`, { grid, from: index, axis: 'x' }), to: stagger(`-${dotTotalSize}px`, { grid, from: nextIndex, axis: 'x' }), duration: utils.random(800, 1200) },
            y: { from: stagger(`-${dotTotalSize}px`, { grid, from: index, axis: 'y' }), to: stagger(`-${dotTotalSize}px`, { grid, from: nextIndex, axis: 'y' }), duration: utils.random(800, 1200) },
            ease: 'outCirc'
          }, '-=1500');

        index = nextIndex;
      }

      // Intersection Observer to stop animation when not in view
      if (observer) observer.disconnect();
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateGrid();
          } else {
            if (animation) animation.pause();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(wrapperEl);
    }

    initGrid();

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initGrid, 300);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      isUnmounted = true;
      if (animation) animation.pause();
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div className="relative w-full bg-white dark:bg-black py-12 md:py-20 lg:py-24 group overflow-hidden">

      {/* Anime.js Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden flex justify-center items-center opacity-20 dark:opacity-40 pointer-events-none text-blue-300 dark:text-blue-500">
        <div className="stagger-visualizer" ref={staggerVisualizerRef}></div>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: '.hero-pagination' }}
        navigation={{
          nextEl: '.hero-next',
          prevEl: '.hero-prev',
        }}
        loop
        className="w-full relative z-10"
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

                  <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-10 font-sans italic">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-6">
                    <button className="bg-neutral-800 hover:bg-neutral-900 text-white px-8 py-4 rounded-lg font-medium shadow-lg transition-all active:scale-95 pointer-events-auto">
                      {slide.cta}
                    </button>
                    <button className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:text-blue-600 transition-colors pointer-events-auto">
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
                  <div className="absolute bottom-2 -left-6 md:-left-12 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 animate-bounce-subtle z-20 pointer-events-auto">
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
        <button className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <ChevronLeftIcon className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
        <button className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 dark:bg-black/80 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <ChevronRightIcon className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
      </Swiper>

      {/* Pagination dots styling */}
      <div className="hero-pagination relative z-10 mt-12 flex justify-center gap-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet-active]:bg-gray-900 dark:[&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet]:transition-all pointer-events-auto" />

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }

        /* Anime.js stagger visualizer styles */
        .stagger-visualizer {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-content: flex-start;
        }

        .stagger-visualizer .dot {
          position: relative;
          background-color: currentColor;
          border-radius: 50%;
          will-change: transform;
        }

        .stagger-visualizer .cursor {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }
      `}</style>
    </div>
  )
}

export default HeroCarosel