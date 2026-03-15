import React from 'react';
import { Award } from 'lucide-react';
import AboutVideo from '../assets/about.mp4';

const About = () => {
  return (
    <section className="py-24 bg-white dark:bg-black font-sans transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Top Header Section (from Image 2) */}
        <div className="text-center mb-20">
          <div className="inline-block relative mb-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase">About</span>
            <div className="h-[2px] w-8 bg-gray-400 dark:bg-gray-600 mx-auto mt-2"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-8 tracking-tight">About Us</h2>
          <p className="max-w-3xl mx-auto text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit.
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left Content Column (from Image 1) */}
          <div className="space-y-10">
            <h3 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white leading-[1.15] tracking-tight">
              Crafting Excellence Through Innovation and Dedication
            </h3>

            <div className="space-y-8">
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                We are passionate professionals committed to delivering exceptional results that exceed expectations and drive meaningful transformation.
              </p>

              <div className="space-y-6 text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>

            {/* Stats Section with large numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pt-10 border-t border-gray-100 dark:border-gray-800">
              <div className="space-y-2">
                <div className="text-5xl font-light text-gray-900 dark:text-white tracking-tighter">15</div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">Years Experience</p>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-light text-gray-900 dark:text-white tracking-tighter">850</div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">Projects Completed</p>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-light text-gray-900 dark:text-white tracking-tighter">240</div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">Happy Clients</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button className="px-10 py-4 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm active:scale-95">
                Meet Our Team
              </button>
            </div>
          </div>

          {/* Right Image Column with floating card */}
          <div className="relative mt-10 lg:mt-0">
            <div className="rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
              <video src={AboutVideo} autoPlay loop muted />
            </div>

            {/* Award Floating Card - precisely as in design */}
            <div className="absolute -bottom-8 -right-4 md:right-8 bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-gray-50 dark:border-gray-800 z-20 transition-colors duration-500">
              <div className="flex flex-col gap-6">
                <div className="bg-gray-100 dark:bg-gray-800 w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Award Winning</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    Recognized for excellence in our industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

